// Core packages
import { type FC, useEffect } from 'react';
import { useLan } from '@resourcesHooks/netowrk/useLan.ts';
import { PrimaryButton } from '@buttons/primary/PrimaryButton.tsx';
import { LanNetworkData } from './components/NetworkData.tsx';
import { useFlashlight } from '../../FlashLightContext.tsx';
import { useShowScreen } from '#commonHooks/useShowScreen.ts';
import './network.scss';
import { useOrderStore } from '@stores/orders.store.ts';
import { OrderV2 } from '@modals/order/Orderv2.tsx';
import { useUserRole } from '#commonUserHooks/useUserRole.ts';
import Show from '@defaults/Show.tsx';
import { CredentialsModal } from '@modals/credentials/CredentialsModal.tsx';
import { ModalReport } from '@modals/index.ts';
import EmptyScreenView from '@defaults/EmptyScreenView.tsx';

const NetworkPage: FC = () => {
	const [showScreen, control, refresh] = useShowScreen();
	const { networks, loading, refetch } = useLan();
	const { updateState, scope } = useOrderStore((state) => state);
	const flashlight = useFlashlight();
	const { isAdmin, isNormalUser } = useUserRole();
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
			<CredentialsModal />
			<ModalReport />
			<main className={`lan ${showScreen ? 'actived' : ''}`}>
				<div className="brightness variant-1"></div>
				<div className="brightness variant-2"></div>
				<Show when={!loading && Boolean(internalNetworkDataInfo().length)}>
					<section className="left">
						<LanNetworkData
							isLoading={loading}
							refetchInternalNetwork={refresh}
							internalNetwork={internalNetworkDataInfo()}
						/>
					</section>

					<Show when={isAdmin() || isNormalUser()}>
						<section className="right" ref={flashlight.rightPaneRef}>
							{/* <LanNetworksChart
						isLoading={loading}
						internalNetwork={internalNetworkDataInfo()}
					/>*/}
							<PrimaryButton
								text="START A PENTEST ON DEMAND"
								click={() => updateState('open', true)}
								className="primary-full"
								disabledLoader
								isDisabled={scope.totalResources <= 0}
							/>
						</section>
					</Show>
				</Show>
				<Show when={!loading && !Boolean(internalNetworkDataInfo().length)}>
					<EmptyScreenView
						buttonText="Add Network"
						title={"There's no data to display here"}
						info={'Start by adding a new network structure'}
						type="network"
						event={refresh}
					/>
				</Show>
			</main>
		</>
	);
};
export default NetworkPage;
