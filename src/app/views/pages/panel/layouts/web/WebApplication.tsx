import React, { useEffect } from 'react';
import { WebApplicationResources } from './components/WebApplicationResources.tsx';
import { WebApplicationStatics } from './components/WebApplicationStatics.tsx';
import { WebApplicationCredentials } from './components/WebApplicationCredentials.tsx';
import { useOrderStore } from '@stores/orders.store';
import { useShowScreen } from '#commonHooks/useShowScreen.ts';
import { useGetWebResources } from '@resourcesHooks/web/useGetWebResources.ts';
import { PrimaryButton } from '@buttons/primary/PrimaryButton.tsx';
import { OrderV2 } from '@modals/order/Orderv2.tsx';
import { ModalReport } from '@modals/reports/ModalReport.tsx';
import { useFlashlight } from '../../FlashLightContext.tsx';
import '@table/table.scss';
import './webapplication.scss';
import { useUserRole } from '#commonUserHooks/useUserRole.ts';
import { CredentialsModal } from '@modals/credentials/CredentialsModal.tsx';
import Show from '@defaults/Show.tsx';
import { ResourceByLocation } from '@standalones/ResourceByLocation.tsx';
import { RESOURCE_CLASS } from '@/app/constants/app-texts.ts';
import useTableStoreV3 from '@table/v3/tablev3.store.ts';

const WebApplicationView: React.FC = () => {
	//Custom Hook for Web panel view
	const [showScreen, control, refresh] = useShowScreen();
	const { webResources, isLoading, refetch } = useGetWebResources();
	const { updateState } = useOrderStore((state) => state);
	const flashlight = useFlashlight();
	const { isAdmin, isNormalUser } = useUserRole();
	const { selectedItems } = useTableStoreV3();

	useEffect(() => {
		refetch();
	}, [control]);

	return (
		<>
			<OrderV2 />
			<ModalReport />
			<CredentialsModal />
			<main className={`webapp ${showScreen ? 'actived' : ''}`}>
				<div className="brightness variant-1"></div>
				<section className="left">
					<WebApplicationResources
						isLoading={isLoading}
						refresh={refresh}
						webResources={webResources}
					/>
				</section>
				<section className="right" ref={flashlight.rightPaneRef}>
					<ResourceByLocation
						isLoading={isLoading}
						resource={webResources}
						title="Web servers by location"
						type={RESOURCE_CLASS.WEB}
					/>
					<Show when={isAdmin() || isNormalUser()}>
						<PrimaryButton
							text="START A PENTEST ON DEMAND"
							click={() => updateState('open', true)}
							className="primary-full"
							isDisabled={selectedItems.length === 0}
							disabledLoader
						/>
					</Show>
					<WebApplicationStatics webResources={webResources} />

					<WebApplicationCredentials />
				</section>
			</main>
		</>
	);
};

export default WebApplicationView;
