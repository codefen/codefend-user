import { type FC, useEffect, useState, useMemo } from 'react';
import { CardsResourcesWan } from './components/CardsResourcesWan.tsx';
import { useFlashlight } from '../../../../context/FlashLightContext.tsx';
import { useShowScreen } from '#commonHooks/useShowScreen.ts';
import { useUserRole } from '#commonUserHooks/useUserRole.ts';
import Show from '@/app/views/components/Show/Show.tsx';
import { CredentialsModal } from '@modals/credentials/CredentialsModal.tsx';
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
import { WorldMapView } from '@/app/views/components/NetworkVisualization/WorldMapView.tsx';
import { SimpleSection } from '@/app/views/components/SimpleSection/SimpleSection.tsx';
import { NetworkOutlineIcon } from '@icons';
import Navbar from '@/app/views/components/navbar/Navbar';
import { useMediaQuery } from 'usehooks-ts';

// Definir tipo para las pestañas - 3 vistas distintas
type NetworkViewType = 'network' | 'cards' | 'locations';

const NetworkPage: FC = () => {
  const [showScreen] = useShowScreen();
  const isDesktop = useMediaQuery('(min-width: 1230px)');
  const [activeTab, setActiveTab] = useState<NetworkViewType>('cards'); // Default to cards view
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

  // Manejar cambio de vista
  const handleViewChange = (view: NetworkViewType) => {
    setActiveTab(view);
  };

  const renderTabContent = () => {
    if (activeTab === 'network') {
      return (
        <NetworkVisualization
          networkData={networks as any}
          width={800}
          height={600}
          title="Network Groups by Neuroscan ID"
        />
      );
    }

    if (activeTab === 'locations') {
      return (
        <WorldMapView
          networkData={networks as any}
          width={800}
          height={600}
          title="Global Server Locations"
        />
      );
    }

    // Vista de cards por defecto
    return (
      <CardsResourcesWan
        isLoading={isLoading}
        refetchInternalNetwork={refetch}
        internalNetwork={networks as any}
      />
    );
  };

  return (
    <EmptyLayout
      className={`lan ${!isDesktop ? 'sidebar-mobile-active' : ''}`}
      fallback={networkEmptyScreen}
      event={refetch}
      showScreen={showScreen}
      isLoading={isLoading}
      dataAvailable={Boolean(networks.length)}>
      <DeleteNetworkModal />
      <CredentialsModal />
      <AddAccessPointModal appEvent={appEvent} />
      <AddSubNetworkModal appEvent={appEvent} internalNetwork={networks ?? []} />
      <section className="left">
        <div className="card">
          <SimpleSection icon={<NetworkOutlineIcon />}>
            {/* Sistema de tabs debajo del título */}
            <div className="tabs-container">
              <div className="tabs-header">
                <button
                  className={`tab-button ${activeTab === 'cards' ? 'active' : ''}`}
                  onClick={() => handleViewChange('cards')}>
                  📋 cards
                </button>
                <button
                  className={`tab-button ${activeTab === 'locations' ? 'active' : ''}`}
                  onClick={() => handleViewChange('locations')}>
                  🌍 Infra Geolocation
                </button>
                {/* TODO: Este tab está pendiente de revisión de accesibilidad */}
                <button
                  className={`tab-button ${activeTab === 'network' ? 'active' : ''}`}
                  onClick={() => handleViewChange('network')}>
                  🔗 Network Visualization
                </button>
              </div>
            </div>
            <div className="content">{renderTabContent()}</div>
          </SimpleSection>
        </div>
      </section>

      <Show when={isAdmin() || isNormalUser()}>
        <section className="right" ref={flashlight.rightPaneRef}>
          <Navbar />
          <AddNetworkBlock />
          {/* <NetworkStatics
            externalIpCount={externalIpCount.get}
            internalIpCount={internalIpCount.get}
            totalNotUniqueIpCount={totalNotUniqueIpCount.get}
          /> */}
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
