import { type FC, useEffect } from 'react';
import { useLan } from '@resourcesHooks/netowrk/useLan.ts';
import { PrimaryButton } from '@buttons/primary/PrimaryButton.tsx';
import { LanNetworkData } from './components/NetworkData.tsx';
import { useFlashlight } from '../../FlashLightContext.tsx';
import { useShowScreen } from '#commonHooks/useShowScreen.ts';
import { useOrderStore } from '@stores/orders.store.ts';
import { OrderV2 } from '@modals/order/Orderv2.tsx';
import { useUserRole } from '#commonUserHooks/useUserRole.ts';
import Show from '@defaults/Show.tsx';
import { CredentialsModal } from '@modals/credentials/CredentialsModal.tsx';
import { ModalReport } from '@modals/reports/ModalReport.tsx';
import EmptyLayout from '../EmptyLayout.tsx';
import './network.scss';

const NetworkPage: FC = () => {
	const [showScreen, control, refresh] = useShowScreen();
	const { networks, loading, refetch } = useLan();
	const { updateState, scope } = useOrderStore((state) => state);
	const flashlight = useFlashlight();
	const { isAdmin, isNormalUser } = useUserRole();

	useEffect(() => {
		refetch();
	}, [control]);

	const networkEmptyScreen = {
		type: 'network',
		title: "There's no data to display here",
		subtitle: 'Start by adding a new network structure',
		btnText: 'Add network resource',
		event: refetch,
	};

	return (
		<>
			<OrderV2 />
			<CredentialsModal />
			<ModalReport />
			<EmptyLayout
				className="lan"
				fallback={networkEmptyScreen}
				showScreen={showScreen}
				isLoading={loading}
				dataAvalaible={Boolean(networks.length)}>
				<div className="brightness variant-1"></div>
				<div className="brightness variant-2"></div>
				<section className="left">
					<LanNetworkData
						isLoading={loading}
						refetchInternalNetwork={refresh}
						internalNetwork={networks}
					/>
				</section>

				<Show when={isAdmin() || isNormalUser()}>
					<section className="right" ref={flashlight.rightPaneRef}>
						{/* <LanNetworksChart
						isLoading={loading}
						internalNetwork={networks}
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
			</EmptyLayout>
		</>
	);
};
export default NetworkPage;
