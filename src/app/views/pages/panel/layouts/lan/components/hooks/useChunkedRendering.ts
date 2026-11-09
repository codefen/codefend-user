import { useState, useCallback, useEffect, useRef } from 'react';

export interface UseChunkedRenderingOptions {
  totalItems: number;
  initialChunkSize: number;
  incrementSize: number;
  loadDelay?: number;
}

export interface UseChunkedRenderingReturn {
  displayedCount: number;
  isLoadingMore: boolean;
  hasMore: boolean;
  loadMore: () => void;
  reset: () => void;
  progress: number;
}

/**
 * Custom hook for chunked rendering with optimized loading and cleanup
 */
export const useChunkedRendering = ({
  totalItems,
  initialChunkSize,
  incrementSize,
  loadDelay = 100,
}: UseChunkedRenderingOptions): UseChunkedRenderingReturn => {
  const [displayedCount, setDisplayedCount] = useState(() => Math.min(initialChunkSize, totalItems));
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Calculate derived state
  const hasMore = displayedCount < totalItems;
  const progress = totalItems > 0 ? Math.min((displayedCount / totalItems) * 100, 100) : 0;

  // Load more items with AbortController for proper cleanup
  const loadMore = useCallback(() => {
    if (isLoadingMore || !hasMore) return;

    // Abort any pending load operation
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new AbortController
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    setIsLoadingMore(true);

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Simulate async loading with proper cleanup
    timeoutRef.current = setTimeout(() => {
      // Check if operation was aborted
      if (signal.aborted) return;

      setDisplayedCount(prevCount => {
        const newCount = Math.min(prevCount + incrementSize, totalItems);
        setIsLoadingMore(false);
        return newCount;
      });
    }, loadDelay);

    // Handle abort
    signal.addEventListener('abort', () => {
      setIsLoadingMore(false);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    });
  }, [isLoadingMore, hasMore, incrementSize, totalItems, loadDelay]);

  // Reset to initial state
  const reset = useCallback(() => {
    // Abort any pending operations
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Clear timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setDisplayedCount(Math.min(initialChunkSize, totalItems));
    setIsLoadingMore(false);
  }, [initialChunkSize, totalItems]);

  // Reset when total items change significantly
  useEffect(() => {
    setDisplayedCount(currentCount => {
      if (totalItems <= 0) return 0;
      if (currentCount <= 0) return Math.min(initialChunkSize, totalItems);
      return Math.min(currentCount, totalItems);
    });
  }, [totalItems, initialChunkSize]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    displayedCount,
    isLoadingMore,
    hasMore,
    loadMore,
    reset,
    progress,
  };
};
