// Core packages
import { invoke } from '@tauri-apps/api/tauri';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useLan } from '../../../../../data';
import {
	PageLoaderWhite,
	PrimaryButton,
} from '../../../../../views/components';
import '../../../../styles/flag.scss';
import { LanNetworkData } from './components/LanNetworkData';
import { LanNetworksChart } from './components/LanNetworksChart';
import './Lan.scss';

const LanPage: React.FC = () => {
	const { networks, loading, refetch } = useLan();

	const [scanLoading, setScanLoading] = useState(false);

	const scanLocal = async () => {
		setScanLoading(true);
		return invoke('scan_local')
			.then((res: any) => {
				const parsedRes = JSON.parse(res);

				if (parsedRes.success) {
					setScanLoading(false);
					toast.success(parsedRes.success);
				} else {
					setScanLoading(false);
				}
			})
			.catch((err: any) => {
				setScanLoading(false);
				const parsedErr = JSON.parse(err);

				if (parsedErr.error) {
					toast.error(parsedErr.error);
				}
			});
	};

	const internalNetworkDataInfo = () => {
		const internalNetworkData = loading ? [] : networks;
		return internalNetworkData ?? [];
	};

	const [showScreen, setShowScreen] = useState(false);

	useEffect(() => {
		refetch();
		const timeoutId = setTimeout(() => {
			setShowScreen(true);
		}, 50);

		return () => clearTimeout(timeoutId);
	}, []);

	return (
		<>
			<main className={`lan ${showScreen ? 'actived' : ''}`}>
				<div className="brightness variant-1"></div>
				<div className="brightness variant-2"></div>
				<section className="left">
					<LanNetworkData
						isLoading={loading}
						refetchInternalNetwork={refetch}
						internalNetwork={internalNetworkDataInfo()}
					/>
				</section>

				<section className="right">
					<LanNetworksChart
						isLoading={loading}
						internalNetwork={internalNetworkDataInfo()}
					/>

					<PrimaryButton
						text={scanLoading ? <PageLoaderWhite /> : 'REQUEST SCAN'}
						click={(e: any) => scanLocal()}
						className="w-full mt-4"
					/>
				</section>
			</main>
		</>
	);
};
export default LanPage;
