import { useCallback, useEffect, useState, useRef, type RefObject } from 'react';

export interface UseColumnLayoutOptions {
  cardWidth: number;
  gap: number;
  padding: number;
  minColumns?: number;
  maxColumns?: number;
}

export interface UseColumnLayoutReturn {
  columnCount: number;
  containerRef: RefObject<HTMLDivElement | null>;
  updateLayout: () => void;
}

/**
 * Custom hook for responsive column layout
 * Automatically calculates optimal number of columns based on container width
 */
export const useColumnLayout = ({
  cardWidth,
  gap,
  padding,
  minColumns = 1,
  maxColumns = 6,
}: UseColumnLayoutOptions): UseColumnLayoutReturn => {
  const [columnCount, setColumnCount] = useState(minColumns);
  const containerRef = useRef<HTMLDivElement>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const calculateColumnCount = useCallback(
    (containerWidth: number): number => {
      if (containerWidth <= 0) return minColumns;

      const availableWidth = containerWidth - padding * 2;
      const totalCardWidth = cardWidth + gap;
      const calculatedColumns = Math.floor((availableWidth + gap) / totalCardWidth);

      return Math.max(minColumns, Math.min(maxColumns, calculatedColumns));
    },
    [cardWidth, gap, padding, minColumns, maxColumns]
  );

  const updateLayout = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const containerWidth = container.offsetWidth;
    const newColumnCount = calculateColumnCount(containerWidth);

    setColumnCount(prevCount => {
      // Only update if column count actually changed to prevent unnecessary re-renders
      return prevCount !== newColumnCount ? newColumnCount : prevCount;
    });
  }, [calculateColumnCount]);

  // Use ResizeObserver for better performance than window resize events
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clean up previous observer
    if (resizeObserverRef.current) {
      resizeObserverRef.current.disconnect();
    }

    // Create new ResizeObserver
    resizeObserverRef.current = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        const newColumnCount = calculateColumnCount(width);
        setColumnCount(prevCount => (prevCount !== newColumnCount ? newColumnCount : prevCount));
      }
    });

    resizeObserverRef.current.observe(container);

    // Initial calculation
    updateLayout();

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }
    };
  }, [calculateColumnCount, updateLayout]);

  return {
    columnCount,
    containerRef,
    updateLayout,
  };
};
