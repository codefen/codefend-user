import { useMemo } from 'react';
import type { Device } from '@interfaces/panel.ts';

// Extended interface for network resources
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

export interface UseMasonryLayoutOptions {
  items: NetworkDevice[];
  columnCount: number;
  distribution?: 'round-robin' | 'balanced';
}

export interface UseMasonryLayoutReturn {
  organizedColumns: NetworkDevice[][];
  columnStats: {
    itemsPerColumn: number[];
    totalItems: number;
    averageItemsPerColumn: number;
  };
}

/**
 * Custom hook for organizing items into masonry columns with optimized distribution
 */
export const useMasonryLayout = ({
  items,
  columnCount,
  distribution = 'round-robin',
}: UseMasonryLayoutOptions): UseMasonryLayoutReturn => {
  // Organize items into columns with memoization
  const organizedColumns = useMemo(() => {
    if (columnCount <= 0 || items.length === 0) {
      return [];
    }

    const columns: NetworkDevice[][] = Array.from({ length: columnCount }, () => []);

    if (distribution === 'round-robin') {
      // Simple round-robin distribution for better performance
      items.forEach((item, index) => {
        const columnIndex = index % columnCount;
        columns[columnIndex].push(item);
      });
    } else {
      // Balanced distribution - more complex but better visual balance
      items.forEach(item => {
        // Find column with least items
        const shortestColumnIndex = columns.reduce((minIndex, column, index) => {
          return columns[minIndex].length > column.length ? index : minIndex;
        }, 0);

        columns[shortestColumnIndex].push(item);
      });
    }

    return columns;
  }, [items, columnCount, distribution]);

  // Calculate column statistics for debugging/optimization
  const columnStats = useMemo(() => {
    const itemsPerColumn = organizedColumns.map(column => column.length);
    const totalItems = items.length;
    const averageItemsPerColumn = totalItems > 0 ? totalItems / columnCount : 0;

    return {
      itemsPerColumn,
      totalItems,
      averageItemsPerColumn,
    };
  }, [organizedColumns, items.length, columnCount]);

  return {
    organizedColumns,
    columnStats,
  };
};
