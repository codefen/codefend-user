import { type FC, useMemo } from 'react';
import type { Device } from '@interfaces/panel.ts';
import { BugIcon, CredentialIcon, TrashIcon, PlusIcon, MagnifyingGlassIcon } from '@icons';
import { VirtualizedCardsContainer } from './VirtualizedCardsContainer.tsx';
import { ModalInput } from '@/app/views/components/ModalInput/ModalInput.tsx';
import {
  ContextMenu,
  useContextMenu,
  type ContextMenuAction,
} from '@/app/views/components/ContextMenu';

// Context Provider
import { NetworkResourcesProvider, useNetworkResources } from './context/NetworkResourcesContext';

import './optimized-cards.scss';
import { nodeEnv } from '@utils/config.ts';

// Extended interface for network resources with server location data
interface NetworkDevice extends Device {
  all_found_domains?: string;
  all_found_domains_value?: string;
  server_pais?: string;
  server_pais_code?: string;
  server_pais_provincia?: string;
  server_pais_ciudad?: string;
  device_class?: string;
  neuroscan_id?: string;
  neuroscan_main_domain?: string;
  source?: string;
}

interface CardsResourcesWanProps {
  isLoading: boolean;
  internalNetwork: NetworkDevice[];
  refetchInternalNetwork: () => void;
}

/**
 * Internal component that uses the context
 * Separated for cleaner architecture and better performance
 */
const NetworkCardsContent: FC = () => {
  const { filtering, actions, chunkedRendering, masonryLayout, infiniteScroll } =
    useNetworkResources();

  // Context menu actions with memoization
  const contextMenuActions: ContextMenuAction[] = useMemo(
    () => [
      {
        label: 'View credentials',
        icon: <CredentialIcon width={16} height={16} />,
        onClick: actions.handleViewCredentials,
      },
      {
        label: 'Add issue',
        icon: <BugIcon width={16} height={16} />,
        onClick: actions.handleAddIssue,
        disabled: !actions.canAddIssue,
      },
      {
        label: 'Add SubNetwork',
        icon: <PlusIcon width={16} height={16} />,
        onClick: actions.handleAddSubNetwork,
        disabled: (resource: NetworkDevice | null | undefined) =>
          !actions.canAddSubNetwork(resource),
      },
      {
        label: 'Delete',
        icon: <TrashIcon width={16} height={16} />,
        onClick: actions.handleDelete,
        disabled: !actions.canDelete,
      },
      {
        label: 'launch naabu - Soon',
        icon: <span style={{ fontWeight: 600, fontSize: '1.1em' }}>🚀</span>,
        disabled: true,
        onClick: () => {}, // TODO: Implement launch actions
      },
      {
        label: 'launch nmap - Soon',
        icon: <span style={{ fontWeight: 600, fontSize: '1.1em' }}>🛰️</span>,
        disabled: true,
        onClick: () => {}, // TODO: Implement launch actions
      },
      {
        label: 'unveil shadow domains - Soon',
        icon: <span style={{ fontWeight: 600, fontSize: '1.1em' }}>🌑</span>,
        disabled: true,
        onClick: () => {}, // TODO: Implement unveil actions
      },
    ],
    [actions]
  );

  const { contextMenu, closeContextMenu, handleThreeDotsClick } =
    useContextMenu(contextMenuActions);

  return (
    <>
      <div className="network-layout">
        {/* Search Bar */}
        <div>
          <ModalInput
            icon={<MagnifyingGlassIcon />}
            setValue={filtering.setSearchTerm}
            placeholder="search infrastructure..."
          />
        </div>

        {/* Cards Container */}
        <div
          className="card network-cards-container"
          ref={infiniteScroll.containerRef}
          style={{
            maxHeight: '70vh',
            overflowY: 'auto',
            position: 'relative',
          }}>
          {filtering.filteredCount > 0 ? (
            <>
              <VirtualizedCardsContainer
                organizedColumns={masonryLayout.organizedColumns}
                handleViewReport={actions.handleViewReport}
                handleViewCredentials={actions.handleViewCredentials}
                handleDelete={actions.handleDelete}
                handleAddIssue={actions.handleAddIssue}
                handleAddSubNetwork={actions.handleAddSubNetwork}
                isProvider={() => !actions.canDelete}
                isAdmin={() => actions.canAddIssue}
                handleThreeDotsClick={handleThreeDotsClick}
              />

              {/* Infinite scroll sentinel */}
              <div ref={infiniteScroll.sentinelRef} style={{ height: '1px' }} />

              {/* Performance info for debugging */}
              {nodeEnv === 'development' && (
                <div className="performance-debug">
                  Columns: {masonryLayout.columnStats.itemsPerColumn.length} | Displayed:{' '}
                  {chunkedRendering.displayedCount} | Progress:{' '}
                  {Math.round(chunkedRendering.progress)}%
                </div>
              )}
            </>
          ) : (
            <div className="no-results">
              {filtering.searchTerm ? (
                <>
                  <p>No resources found matching "{filtering.searchTerm}"</p>
                  <p>Try searching by server IP or domain name</p>
                </>
              ) : (
                <p>No network resources available</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Context Menu */}
      <ContextMenu
        contextMenu={contextMenu}
        actions={contextMenuActions}
        onClose={closeContextMenu}
      />
    </>
  );
};

/**
 * Main component with Provider wrapper
 * Ultra-optimized with context-based architecture
 */
export const CardsResourcesWan: FC<CardsResourcesWanProps> = ({ isLoading, internalNetwork }) => {
  if (isLoading) {
    return (
      <div className="card">
        <div className="network-cards-container">
          <div className="loading-message">Loading network resources...</div>
        </div>
      </div>
    );
  }

  return (
    <NetworkResourcesProvider resources={internalNetwork} isLoading={isLoading}>
      <NetworkCardsContent />
    </NetworkResourcesProvider>
  );
};
