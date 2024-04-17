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
import { useShowScreen } from '#commonHooks/useShowScreen.ts';
import '@styles/flag.scss';
import './Lan.scss';
import { useOrderStore } from '@stores/orders.store.ts';
import { OrderV2 } from '@modals/order/Orderv2.tsx';

const LanPage: FC = () => {
	const { networks, loading, refetch } = useLan();
	const { updateState } = useOrderStore((state) => state);
	const flashlight = useFlashlight();
	const [showScreen, control] = useShowScreen();

	const internalNetworkDataInfo = () => {
		const internalNetworkData = loading ? [] : networks;
		return internalNetworkData || [];
	};

	useEffect(() => {
		refetch();
	}, [control]);

	return (
		<>
			<OrderV2 />
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
						text="START A PENTEST ON DEMAND"
						click={() => updateState('open', true)}
						className="primary-full"
					/>
				</section>
			</main>
		</>
	);
};
export default LanPage;
