import { memo, type MouseEvent } from 'react';
import type { Device } from '@interfaces/panel.ts';
import { NetworkResourceCard } from './NetworkResourceCard.tsx';

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

interface VirtualizedCardsContainerProps {
  organizedColumns: NetworkDevice[][];
  handleViewReport: (row: NetworkDevice) => void;
  handleViewCredentials: (row: NetworkDevice) => void;
  handleDelete: (row: NetworkDevice) => void;
  handleAddIssue: (row: NetworkDevice) => void;
  handleAddSubNetwork: (row: NetworkDevice) => void;
  isProvider: () => boolean;
  isAdmin: () => boolean;
  handleThreeDotsClick: (event: MouseEvent, data: any) => void;
}

/**
 * Optimized container component for rendering cards in columns
 * Uses React.memo for performance optimization with minimal re-renders
 */
export const VirtualizedCardsContainer = memo<VirtualizedCardsContainerProps>(
  ({
    organizedColumns,
    handleViewReport,
    handleViewCredentials,
    handleDelete,
    handleAddIssue,
    handleAddSubNetwork,
    isProvider,
    isAdmin,
    handleThreeDotsClick,
  }) => {
    return (
      <div className="masonry-container">
        {organizedColumns.map((column, columnIndex) => (
          <div key={columnIndex} className="masonry-column">
            {column.map(resource => (
              <NetworkResourceCard
                key={resource.id}
                resource={resource}
                onViewReport={handleViewReport}
                onViewCredentials={handleViewCredentials}
                onDelete={handleDelete}
                onAddIssue={handleAddIssue}
                onAddSubNetwork={handleAddSubNetwork}
                canDelete={!isProvider()}
                canAddIssue={isProvider() || isAdmin()}
                canAddSubNetwork={!resource.resource_lan_dad}
                hasIssues={Number(resource.final_issues) >= 1}
                onThreeDotsClick={handleThreeDotsClick}
              />
            ))}
          </div>
        ))}
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Optimized comparison: only check column structure and total items
    if (prevProps.organizedColumns.length !== nextProps.organizedColumns.length) {
      return false;
    }

    // Quick total item count comparison for early exit
    const prevTotal = prevProps.organizedColumns.reduce((acc, col) => acc + col.length, 0);
    const nextTotal = nextProps.organizedColumns.reduce((acc, col) => acc + col.length, 0);

    if (prevTotal !== nextTotal) {
      return false;
    }

    // If totals match, check if column distribution changed
    for (let i = 0; i < prevProps.organizedColumns.length; i++) {
      if (prevProps.organizedColumns[i].length !== nextProps.organizedColumns[i].length) {
        return false;
      }
    }

    return true;
  }
);

VirtualizedCardsContainer.displayName = 'VirtualizedCardsContainer';
