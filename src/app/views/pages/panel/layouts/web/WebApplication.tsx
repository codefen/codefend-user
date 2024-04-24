import React, { useEffect } from 'react';
import { WebApplicationResources } from './components/WebApplicationResources.tsx';
import { WebApplicationLocation } from './components/WebApplicationLocation.tsx';
import { WebApplicationStatics } from './components/WebApplicationStatics.tsx';
import { WebApplicationCredentials } from './components/WebApplicationCredentials.tsx';
import { useOrderStore } from '@stores/orders.store';
import { useShowScreen } from '#commonHooks/useShowScreen.ts';
import { useWebapplication } from '@resourcesHooks/web/useWebapplication.ts';
import { PrimaryButton } from '@buttons/primary/PrimaryButton.tsx';
import { OrderV2 } from '@modals/order/Orderv2.tsx';
import { ModalReport } from '@modals/reports/ModalReport.tsx';
import { useFlashlight } from '../../FlashLightContext.tsx';
import '@table/table.scss';
import './webapplication.scss';
import { useUserRole } from '#commonUserHooks/useUserRole.ts';
import { AddCredentialModal } from '@modals/adding-modals/AddCredentialModal.tsx';
import useRightPaneStore from '@stores/rightPane.store.ts';
import Show from '@defaults/Show.tsx';

const WebApplicationView: React.FC = () => {
	//Custom Hook for Web panel view
	const [showScreen, control, refresh] = useShowScreen();
	const { webResources, isLoading, refetch } = useWebapplication();
	const { updateState } = useOrderStore((state) => state);
	const flashlight = useFlashlight();
	const { isAdmin, isNormalUser } = useUserRole();
	const { activePage } = useRightPaneStore();

	useEffect(() => {
		refetch();
	}, [control]);

	return (
		<>
			<OrderV2 />
			<ModalReport />
			<AddCredentialModal />
			<main className={`webapp ${showScreen ? 'actived' : ''}`}>
				<div className="brightness variant-1"></div>
				<section className="left">
					<WebApplicationResources
						isLoading={isLoading}
						refresh={refresh}
						webResources={webResources.resources}
					/>
				</section>
				<section className="right" ref={flashlight.rightPaneRef}>
					<Show when={activePage == 1}>
						<WebApplicationLocation
							isLoading={isLoading}
							webResources={webResources.resources}
						/>

						<WebApplicationStatics
							webResources={webResources.resources}
							isLoading={isLoading}
						/>

						<WebApplicationCredentials />
						<Show when={isAdmin() || isNormalUser()}>
							<PrimaryButton
								text="START A PENTEST ON DEMAND"
								click={() => updateState('open', true)}
								className="primary-full"
							/>
						</Show>
					</Show>
					<Show when={activePage == 2}>
						<Show when={isAdmin() || isNormalUser()}>
							<PrimaryButton
								text="START A PENTEST ON DEMAND"
								click={() => updateState('open', true)}
								className="primary-full"
							/>
						</Show>
					</Show>
				</section>
			</main>
		</>
	);
};

export default WebApplicationView;
