import React, { useEffect, useState } from 'react';

import { ScanButton } from './components/ScanButton';
import { ReportButton } from './components/ReportButton';
import { ScanNetworkGraph } from './components/ScanNetworkGraph';
import { ModalOS } from './components/ModalOS';
import { ImSpinner8 } from 'react-icons/im';
import { EndpointAppProvider } from './EndpointContext';
import { FaWindows, FaLinux, FaApple } from 'react-icons/fa';
import { useNavigate } from 'react-router';
import moment from 'moment';

import { useAuthState, useScanLocal, EnpService } from '../../../../../data';

import { Show } from '../../../../components';

import './endpoints.scss';

interface Props {}

interface IOSIconProps {
	osName: string;
}

export const EnpPanel: React.FC<Props> = (props) => {
	const { getAccessToken } = useAuthState();
	const { getUserdata } = useAuthState();
	const [showScreen, setShowScreen] = useState<boolean>(false);
	const [scans, setScans] = useState<any[]>([]);
	const [scansFiltered, setScansFiltered] = useState<any[]>([]);
	const { scanLoading, scanLocal } = useScanLocal(getAccessToken());
	const [refresh, setRefresh] = useState<boolean>(false);
	const navigate = useNavigate();

	useEffect(() => {
		const companyID = getUserdata()?.companyID as string;
		EnpService.getScans(companyID).then((scans) => {
			setScans(scans.data);

			if (scans?.data?.length) {
				setScansFiltered(processScans(scans.data));
			}
		});
		setShowScreen(false);
		const timeoutId = setTimeout(() => setShowScreen(true), 50);
		return () => clearTimeout(timeoutId);
	}, [refresh]);

	function processScans(scans: any) {
		const groupedScans = scans.reduce((acc: any, scan: any) => {
			const macAddress = scan.device_mac_address;
			if (!acc[macAddress]) {
				acc[macAddress] = [];
			}
			acc[macAddress].push(scan);
			return acc;
		}, {});

		return Object.values(groupedScans).map((scans: any) => {
			const latestScan = scans.sort((a: any, b: any) => {
				return (
					new Date(b.creacion).getTime() - new Date(a.creacion).getTime()
				);
			})[0];

			latestScan.additionalScans = scans.length - 1;
			return latestScan;
		});
	}

	const OSIcon: React.FC<IOSIconProps> = ({ osName }) => {
		const lowerCaseOSName = osName.toLowerCase();
		if (lowerCaseOSName.includes('windows')) {
			return <FaWindows className="w-8 h-8 text-gray-600" />;
		} else if (lowerCaseOSName.includes('mac')) {
			return <FaApple className="w-8 h-8 text-gray-600" />;
		} else {
			return <FaLinux className="w-8 h-8 text-gray-600" />;
		}
	};

	return (
		<EndpointAppProvider>
			<main className={`enp ${showScreen && 'actived'}`}>
				<header className="enp-header">
					<h2>ENDPOINT</h2>
					<h3>DEVICE INVENTORY</h3>
				</header>
				<div className="buttons-bar">
					<div className="flex flex-row items-center">
						<section>
							<ScanButton
								onClick={() => scanLocal()}
								scanLoading={scanLoading}
								scanLocal={scanLocal}
							/>
						</section>
					</div>

					<div className="flex items-center">
						<section>
							<ReportButton
								onClick={() => {
									true;
								}}
							/>
						</section>
					</div>
				</div>

				<ModalOS />
				<div className="flex flex-row">
					<ScanNetworkGraph data={scans} filteredData={scansFiltered} />
				</div>

				<div>
					<div className="rounded-t border-x border-t border-slate-200 flex-grow hover:cursor-default">
						<div className="flex p-4">
							<p className="text-sm font-bold text-gray-700 leading-none mt-1 ml-2 truncate uppercase">
								Scanned devices
							</p>
						</div>

						<div className="flex p-4 pt-0 ml-2 text-slate-400 text-sm">
							<div className="w-2/12 hover:cursor-pointer hover:text-red-500 duration-300 ease-in-out">
								device name
							</div>
							<div className="w-2/12 hover:cursor-pointer hover:text-red-500 duration-300 ease-in-out">
								operating system
							</div>
							<div className="w-2/12 hover:cursor-pointer hover:text-red-500 duration-300 ease-in-out">
								latest scan
							</div>
							<div className="w-2/12 hover:cursor-pointer hover:text-red-500 duration-300 ease-in-out">
								apps found
							</div>
							<div className="w-2/12 hover:cursor-pointer hover:text-red-500 duration-300 ease-in-out">
								compliance ready
							</div>
							<div className="w-1/12 hover:cursor-pointer hover:text-red-500 duration-300 ease-in-out">
								status
							</div>
							<div className="w-1/12 hover:cursor-pointer hover:text-red-500 duration-300 ease-in-out">
								scans
							</div>
						</div>
					</div>
					<Show when={scansFiltered.length > 0}>
						<div className="rounded-b mb-5 border-b border-slate-200 flex-grow hover:cursor-default">
							{scansFiltered.map((scan) => (
								<div
									className="flex items-center p-4 pl-6 border-x border-t text-slate-400 text-sm hover:cursor-pointer hover:bg-slate-50 duration-300 ease-in-out"
									onClick={() => {
										navigate('/enp/' + scan.id);
									}}>
									<div className="w-2/12">{scan.device_os_name}</div>
									<div className="w-2/12">
										{scan.device_os_release}
									</div>
									<div className="w-2/12">
										{moment(scan.creacion).fromNow()}
									</div>
									<div className="w-2/12">{scan.apps_found}</div>
									<div className="w-2/12">
										<Show when={scan.report_data}>
											<button className="cursor-pointer bg-emerald-50 text-emerald-300 border-emerald-300 border h-8 text-xs rounded w-auto">
												<p className="cursor-default">compliant</p>
											</button>
										</Show>
										<Show when={!scan.report_data}>
											<button className="cursor-pointer bg-red-50 text-red-300 border-red-300 border h-8 text-xs rounded w-auto">
												<p className="cursor-default">
													non compliant
												</p>
											</button>
										</Show>
									</div>
									<div className="w-1/12">
										{Number(scan.scanned) == 1 ? (
											<p className="cursor-default">Finished</p>
										) : (
											<div className="w-full h-full flex items-center justify-left bg-transparent">
												<ImSpinner8 className="animate-spin h-3 w-3 text-gray-600 ml-1 mr-2" />
												<p>In progress</p>
											</div>
										)}
									</div>
									<div className="w-1/12">
										{scan.additionalScans + 1}
									</div>
								</div>
							))}
						</div>
					</Show>
					<Show when={scansFiltered.length === 0}>
						<div className="rounded-b mb-5 border-b border-slate-200 flex-grow hover:cursor-default">
							<div className="flex items-center p-4 pl-6 border-x border-t text-slate-400 text-sm hover:cursor-default hover:bg-slate-50 duration-300 ease-in-out">
								No scans found yet, you can perform your first one by
								clicking on request scan.
							</div>
						</div>
					</Show>
				</div>
			</main>
		</EndpointAppProvider>
	);
};

export default EnpPanel;
