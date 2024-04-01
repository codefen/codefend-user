// Core packages
import { type FC, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { invoke } from '@tauri-apps/api/tauri';
import { useLan } from '@resourcesHooks/netowrk/useLan.ts';
import { PrimaryButton } from '@buttons/primary/PrimaryButton.tsx';
import { PageLoaderWhite } from '@defaults/loaders/Loader.tsx';
import { LanNetworkData } from './components/LanNetworkData.tsx';
import { LanNetworksChart } from './components/LanNetworksChart.tsx';
import { useFlashlight } from '../../FlashLightContext.tsx';
import '@styles/flag.scss';
import './Lan.scss';

const LanPage: FC = () => {
	const { networks, loading, refetch } = useLan();

	const [scanLoading, setScanLoading] = useState(false);

	const flashlight = useFlashlight();

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
		return internalNetworkData || [];
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

				<section className="right" ref={flashlight.rightPaneRef}>
					<LanNetworksChart
						isLoading={loading}
						internalNetwork={internalNetworkDataInfo()}
					/>

					<PrimaryButton
						text={scanLoading ? <PageLoaderWhite /> : 'REQUEST SCAN'}
						click={(e: any) => scanLocal()}
						className="primary-full"
					/>
				</section>
			</main>
		</>
	);
};
export default LanPage;
