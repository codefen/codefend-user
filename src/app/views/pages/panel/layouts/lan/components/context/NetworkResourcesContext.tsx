import { createContext, useContext, type FC, useMemo, type ReactNode } from 'react';
import type { Device } from '@interfaces/panel.ts';
import {
  useResourceFiltering,
  useResourceActions,
  useColumnLayout,
  useChunkedRendering,
  useMasonryLayout,
  useInfiniteScroll,
  type UseResourceFilteringReturn,
  type UseResourceActionsReturn,
  type UseColumnLayoutReturn,
  type UseChunkedRenderingReturn,
  type UseMasonryLayoutReturn,
  type UseInfiniteScrollReturn,
} from '../hooks';

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

interface NetworkResourcesContextValue {
  filtering: UseResourceFilteringReturn;
  actions: UseResourceActionsReturn;
  layout: UseColumnLayoutReturn;
  chunkedRendering: UseChunkedRenderingReturn;
  masonryLayout: UseMasonryLayoutReturn;
  infiniteScroll: UseInfiniteScrollReturn;
  displayedResources: NetworkDevice[];
  isLoading: boolean;
}

interface NetworkResourcesProviderProps {
  children: ReactNode;
  resources: NetworkDevice[];
  isLoading: boolean;
}

const NetworkResourcesContext = createContext<NetworkResourcesContextValue | null>(null);

/**
 * Custom hook to use the NetworkResources context
 * Provides centralized access to all network resources functionality
 */
export const useNetworkResources = (): NetworkResourcesContextValue => {
  const context = useContext(NetworkResourcesContext);
  if (!context) {
    throw new Error('useNetworkResources must be used within a NetworkResourcesProvider');
  }
  return context;
};

// Configuration constants
const CHUNK_SIZE = 300;
const SCROLL_THRESHOLD = 200;
const CARD_WIDTH = 350;
const CARD_GAP = 16;
const CONTAINER_PADDING = 32;
const DISTRIBUTION = 'round-robin';
const DEBOUNCE_MS = 300;
const LOAD_DELAY = 100;
const MIN_COLUMNS = 1;
const MAX_COLUMNS = 4;
/**
 * Provider component that centralizes all network resources state and logic
 * Follows the compound component pattern for better organization
 */
export const NetworkResourcesProvider: FC<NetworkResourcesProviderProps> = ({
  children,
  resources,
  isLoading,
}) => {
  // Initialize all hooks
  const filtering = useResourceFiltering({
    resources,
    debounceMs: DEBOUNCE_MS,
  });

  const actions = useResourceActions();

  const layout = useColumnLayout({
    cardWidth: CARD_WIDTH,
    gap: CARD_GAP,
    padding: CONTAINER_PADDING,
    minColumns: MIN_COLUMNS,
    maxColumns: MAX_COLUMNS,
  });

  const chunkedRendering = useChunkedRendering({
    totalItems: filtering.filteredCount,
    initialChunkSize: CHUNK_SIZE,
    incrementSize: CHUNK_SIZE,
    loadDelay: LOAD_DELAY,
  });

  // Get displayed resources (chunked from filtered)
  const displayedResources = useMemo(() => {
    return filtering.filteredResources.slice(0, chunkedRendering.displayedCount);
  }, [filtering.filteredResources, chunkedRendering.displayedCount]);

  const masonryLayout = useMasonryLayout({
    items: displayedResources,
    columnCount: layout.columnCount,
    distribution: DISTRIBUTION,
  });

  const infiniteScroll = useInfiniteScroll({
    threshold: SCROLL_THRESHOLD,
    hasMore: chunkedRendering.hasMore,
    isLoading: chunkedRendering.isLoadingMore,
    onLoadMore: chunkedRendering.loadMore,
  });

  const contextValue: NetworkResourcesContextValue = {
    filtering,
    actions,
    layout,
    chunkedRendering,
    masonryLayout,
    infiniteScroll,
    displayedResources,
    isLoading,
  };

  return (
    <NetworkResourcesContext.Provider value={contextValue}>
      {children}
    </NetworkResourcesContext.Provider>
  );
};
