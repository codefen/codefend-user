import { type FC, useEffect, useState, useMemo, useRef } from 'react';
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
import { WorldMapView } from '@/app/views/components/NetworkVisualization/WorldMapView.tsx';
import { SimpleSection } from '@/app/views/components/SimpleSection/SimpleSection.tsx';
import { NetworkOutlineIcon, LayoutGridOutlineIcon, NetOutlineIcon, GlobeWebIcon } from '@icons';

// Definir tipo para las pestañas - 3 vistas distintas
type NetworkViewType = 'network' | 'cards' | 'locations';

const NetworkPage: FC = () => {
  const [showScreen] = useShowScreen();
  const [activeTab, setActiveTab] = useState<NetworkViewType>('cards'); // Default to cards view
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
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

  // Opciones del dropdown
  const viewOptions = [
    {
      key: 'cards',
      label: 'Resource Cards',
      icon: <LayoutGridOutlineIcon />,
      shortLabel: 'Cards',
    },
    {
      key: 'network',
      label: 'Network Visualization',
      icon: <NetOutlineIcon />,
      shortLabel: 'Network',
    },
    {
      key: 'locations',
      label: 'Server Locations',
      icon: <GlobeWebIcon />,
      shortLabel: 'Locations',
    },
  ];

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Manejar cambio de vista
  const handleViewChange = (view: NetworkViewType) => {
    setActiveTab(view);
    setIsDropdownOpen(false);
  };

  // Obtener la opción activa
  const activeOption = viewOptions.find(option => option.key === activeTab);

  const headerContent = useMemo(() => {
    return 'Network Infrastructure';
  }, []);

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
      <section className="left">
        <div className="card">
          <SimpleSection>
            {/* Header personalizado con dropdown */}
            <div className="custom-section-header">
              <div className="header-title">
                <NetworkOutlineIcon />
                <span>{headerContent}</span>
              </div>
              <div className="view-selector-dropdown" ref={dropdownRef}>
                <button
                  className="view-selector-button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                  <span className="view-selector-text">
                    {activeOption?.icon} {activeOption?.shortLabel}
                  </span>
                  <span className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`}>▼</span>
                </button>
                {isDropdownOpen && (
                  <div className="view-selector-menu">
                    {viewOptions.map(option => (
                      <button
                        key={option.key}
                        className={`view-option ${activeTab === option.key ? 'active' : ''}`}
                        onClick={() => handleViewChange(option.key as NetworkViewType)}>
                        <span className="option-content">
                          {option.icon}
                          <span className="option-text">{option.label}</span>
                        </span>
                        {activeTab === option.key && <span className="check-mark">✓</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="content">{renderTabContent()}</div>
          </SimpleSection>
        </div>
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
