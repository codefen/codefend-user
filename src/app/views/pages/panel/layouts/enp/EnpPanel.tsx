	import React, { useEffect, useState } from 'react';

import moment from 'moment';
import { FaApple, FaLinux, FaWindows } from 'react-icons/fa';
import { ImSpinner8 } from 'react-icons/im';
import { useNavigate } from 'react-router';
import { EndpointAppProvider } from './EndpointContext';
import { ModalOS } from './components/ModalOS';
import { ReportButton } from './components/ReportButton';
import { ScanButton } from './components/ScanButton';
import { ScanNetworkGraph } from './components/ScanNetworkGraph';

import { EnpService, useAuthState, useScanLocal } from '../../../../../data';

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

	return (
		<EndpointAppProvider>
			<main className={`enp ${showScreen && 'actived'}`}>
				<header className="enp-header">
					<h2>ENDPOINT</h2>
					<h3>DEVICE INVENTORY</h3>
				</header>
				<div className="buttons-bar">
					<div className="buttons-bar-wrapper ">
						<section>
							<ScanButton
								onClick={() => scanLocal()}
								scanLoading={scanLoading}
								scanLocal={scanLocal}
							/>
						</section>
					</div>

					<div className="buttons-bar-wrapper">
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
				<div className="enp-graphics">
					<ScanNetworkGraph data={scans} filteredData={scansFiltered} />
				</div>

				<div>
					<div className="enp-table-header">
						<div className="enp-table-title">
							<h3>Scanned devices</h3>
						</div>

						<div className="enp-table-columns">
							<div className="enp-table-column">device name</div>
							<div className="enp-table-column">operating system</div>
							<div className="enp-table-column">latest scan</div>
							<div className="enp-table-column">apps found</div>
							<div className="enp-table-column">compliance ready</div>
							<div className="enp-table-column">status</div>
							<div className="enp-table-column">scans</div>
						</div>
					</div>
					<Show when={scansFiltered.length > 0}>
						<div className="enp-table-content">
							{scansFiltered.map((scan, i) => (
								<div
									className="enp-content-row"
									key={i}
									onClick={() => {
										navigate('/enp/' + scan.id);
									}}>
									<div className="enp-content-item">
										{scan.device_os_name}
									</div>
									<div className="enp-content-item">
										{scan.device_os_release}
									</div>
									<div className="enp-content-item">
										{moment(scan.creacion).fromNow()}
									</div>
									<div className="enp-content-item">
										{scan.apps_found}
									</div>
									<div className="enp-content-item ">
										<Show when={scan.report_data}>
											<button className="enp-btn enp-scan-btn ">
												<span>compliant</span>
											</button>
										</Show>
										<Show when={!scan.report_data}>
											<button className="enp-btn enp-report-btn">
												<span>non compliant</span>
											</button>
										</Show>
									</div>
									<div className="enp-content-item small">
										{Number(scan.scanned) == 1 ? (
											<p className="p-default">Finished</p>
										) : (
											<div className="enp-table-progres">
												<ImSpinner8 className="w-3 h-3 ml-1 mr-2 text-gray-600 animate-spin" />
												<p>In progress</p>
											</div>
										)}
									</div>
									<div className="enp-content-item small">
										{scan.additionalScans + 1}
									</div>
								</div>
							))}
						</div>
					</Show>
					<Show when={scansFiltered.length === 0}>
						<div className="enp-empty-table">
							<div className="empty-message">
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
