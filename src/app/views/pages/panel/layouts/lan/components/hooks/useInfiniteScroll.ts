import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';

export interface UseInfiniteScrollOptions {
  threshold: number;
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
}

export interface UseInfiniteScrollReturn {
  containerRef: RefObject<HTMLDivElement | null>;
  sentinelRef: RefObject<HTMLDivElement | null>;
  isNearBottom: boolean;
}

/**
 * Custom hook for infinite scroll functionality
 * Handles intersection observer, scroll detection, and loading states
 */
export const useInfiniteScroll = ({
  threshold,
  hasMore,
  isLoading,
  onLoadMore,
}: UseInfiniteScrollOptions): UseInfiniteScrollReturn => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const lastScrollTop = useRef(0);
  const [isNearBottom, setIsNearBottom] = useState(false);

  // Optimized scroll handler with debouncing
  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container || isLoading || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

    // Only trigger when scrolling down and near bottom
    const isScrollingDown = scrollTop > lastScrollTop.current;
    const isNearBottomThreshold = distanceFromBottom <= threshold;

    setIsNearBottom(isNearBottomThreshold);

    if (isScrollingDown && isNearBottomThreshold) {
      onLoadMore();
    }

    lastScrollTop.current = scrollTop;
  }, [isLoading, hasMore, threshold, onLoadMore]);

  // Intersection Observer for more efficient scroll detection
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;

    const observer = new IntersectionObserver(
      entries => {
        const [entry] = entries;
        if (entry.isIntersecting && !isLoading && hasMore) {
          onLoadMore();
        }
      },
      {
        root: containerRef.current,
        rootMargin: `${threshold}px`,
        threshold: 0.1,
      }
    );

    observer.observe(sentinel);

    return () => {
      observer.unobserve(sentinel);
      observer.disconnect();
    };
  }, [hasMore, isLoading, threshold, onLoadMore]);

  // Scroll event listener with throttling
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let timeoutId: ReturnType<typeof setTimeout>;

    const throttledScrollHandler = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(handleScroll, 16); // ~60fps
    };

    container.addEventListener('scroll', throttledScrollHandler, { passive: true });

    return () => {
      container.removeEventListener('scroll', throttledScrollHandler);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [handleScroll]);

  return {
    containerRef,
    sentinelRef,
    isNearBottom,
  };
};
