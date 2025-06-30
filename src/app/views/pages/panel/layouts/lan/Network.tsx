import { type FC, useEffect, useState } from 'react';
import { useLan } from '@resourcesHooks/network/useLan.ts';
import { LanNetworkData } from './components/NetworkData.tsx';
import { CardsResourcesWan } from './components/CardsResourcesWan.tsx';
import { useFlashlight } from '../../../../context/FlashLightContext.tsx';
import { useShowScreen } from '#commonHooks/useShowScreen.ts';
import { OrderV2 } from '@modals/order/Orderv2.tsx';
import { useUserRole } from '#commonUserHooks/useUserRole.ts';
import Show from '@/app/views/components/Show/Show.tsx';
import { CredentialsModal } from '@modals/credentials/CredentialsModal.tsx';
import { ModalReport } from '@modals/reports/ModalReport.tsx';
import EmptyLayout from '../EmptyLayout.tsx';
import './network.scss';
import { networkEmptyScreen } from '@/app/constants/app-texts.ts';
import { OrderSection, ResourcesTypes } from '@interfaces/order.ts';
import OpenOrderButton from '@/app/views/components/OpenOrderButton/OpenOrderButton.tsx';
import AddNetworkBlock from '@/app/views/pages/panel/layouts/lan/components/AddNetworkBlock.tsx';
import { AddAccessPointModal } from '@modals/index.ts';
import { AddSubNetworkModal } from '@modals/adding-modals/AddSubNetworkModal.tsx';
import { NetworkStatics } from '@/app/views/pages/panel/layouts/lan/components/NetworkStatics.tsx';
import { useGetNetworkv2 } from '@resourcesHooks/network/useGetNetworkv2.ts';
import { DeleteNetworkModal } from '@/app/views/pages/panel/layouts/lan/components/DeleteNetworkModal.tsx';
import { ServerGeolocationMap } from '@/app/views/components/ServerGeolocationMap/ServerGeolocationMap.tsx';
import { RESOURCE_CLASS } from '@/app/constants/app-texts.ts';
import { NetworkVisualization } from '@/app/views/components/NetworkVisualization/NetworkVisualization.tsx';

const NetworkPage: FC = () => {
  const [showScreen] = useShowScreen();
  const [viewMode, setViewMode] = useState<'cards' | 'network'>('network'); // Default to network view
  const {
    networks,
    isLoading,
    externalIpCount,
    internalIpCount,
    totalNotUniqueIpCount,
    appEvent,
    refetch,
  } = useGetNetworkv2();
  const flashlight = useFlashlight();
  const { isAdmin, isNormalUser } = useUserRole();

  return (
    <EmptyLayout
      className="lan"
      fallback={networkEmptyScreen}
      event={refetch}
      showScreen={showScreen}
      isLoading={isLoading}
      dataAvailable={Boolean(networks.length)}>
      <DeleteNetworkModal />
      <CredentialsModal />
      <AddAccessPointModal appEvent={appEvent} />
      <AddSubNetworkModal appEvent={appEvent} internalNetwork={networks ?? []} />
      {/* <div className="brightness variant-1"></div>
      <div className="brightness variant-2"></div> */}
      <section className="left">
        {/* View toggle buttons */}
        <div className="view-toggle-container">
          <div className="view-toggle">
            <button 
              className={`toggle-btn ${viewMode === 'network' ? 'active' : ''}`}
              onClick={() => setViewMode('network')}
            >
              🌐 Network View
            </button>
            <button 
              className={`toggle-btn ${viewMode === 'cards' ? 'active' : ''}`}
              onClick={() => setViewMode('cards')}
            >
              📋 Cards View
            </button>
          </div>
        </div>

        {/* Conditional rendering based on view mode */}
        {viewMode === 'network' ? (
          <NetworkVisualization
            networkData={networks as any}
            width={800}
            height={600}
            title="Network Groups by Neuroscan ID"
          />
        ) : (
          <CardsResourcesWan
            isLoading={isLoading}
            refetchInternalNetwork={refetch}
            internalNetwork={networks as any}
          />
        )}
      </section>

      <Show when={isAdmin() || isNormalUser()}>
        <section className="right" ref={flashlight.rightPaneRef}>
          <AddNetworkBlock />
          <NetworkStatics
            externalIpCount={externalIpCount.get}
            internalIpCount={internalIpCount.get}
            totalNotUniqueIpCount={totalNotUniqueIpCount.get}
          />
          <OpenOrderButton
            className="primary-full"
            type={ResourcesTypes.NETWORK}
            resourceCount={networks?.length || 0}
            isLoading={isLoading}
            scope={OrderSection.NETWORK_SCOPE}
          />
          <ServerGeolocationMap
            networkData={networks as any}
            resourceType={RESOURCE_CLASS.NETWORK}
            title="Global server distribution"
          />
        </section>
      </Show>
    </EmptyLayout>
  );
};
export default NetworkPage;
