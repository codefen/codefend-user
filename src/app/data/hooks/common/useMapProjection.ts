import { useState, useEffect, useCallback, useRef, type RefObject } from 'react';
import * as d3 from 'd3';

interface Dimensions {
  width: number;
  height: number;
}

interface MapProjectionConfig {
  id: string;
  name: string;
  projection: any;
}

// Available projections for comparison
const PROJECTIONS: MapProjectionConfig[] = [
  { id: 'naturalEarth1', name: 'Natural Earth', projection: d3.geoNaturalEarth1 },
  { id: 'orthographicInteractive', name: 'Interactive 3D Globe', projection: d3.geoOrthographic },
];

// Debounce utility
const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const useMapProjection = (
  containerRef: RefObject<HTMLDivElement | null>,
  selectedProjection: string = 'orthographicInteractive'
) => {
  const [dimensions, setDimensions] = useState<Dimensions>({ width: 800, height: 500 });
  const [rotation, setRotation] = useState<[number, number]>([0, 0]);
  const [projectionScale, setProjectionScale] = useState(1.0);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  // Debounce dimensions for performance
  const debouncedDimensions = useDebounce(dimensions, 150);

  // Update dimensions function optimizado
  const updateDimensions = useCallback(() => {
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;

    if (selectedProjection === 'orthographicInteractive') {
      // For 3D globe: fixed height of 360px, width matches container
      const width = Math.min(Math.max(400, containerWidth), 800);
      const height = 360; // Fixed height for 3D globe
      setDimensions(prev => {
        if (prev.width !== width || prev.height !== height) {
          return { width, height };
        }
        return prev;
      });
    } else {
      // For flat projections, use a more traditional aspect ratio
      const width = Math.min(Math.max(600, containerWidth), 900);
      const height = Math.round(width * 0.6); // 5:3 aspect ratio
      setDimensions(prev => {
        if (prev.width !== width || prev.height !== height) {
          return { width, height };
        }
        return prev;
      });
    }
  }, [selectedProjection]);

  // Handle responsive resizing con ResizeObserver
  useEffect(() => {
    // Initial size calculation with delay to ensure DOM is ready
    const timer = setTimeout(updateDimensions, 100);
    updateDimensions(); // Also call immediately

    // Add resize listener
    const handleResize = () => {
      requestAnimationFrame(updateDimensions);
    };
    window.addEventListener('resize', handleResize);

    // Use ResizeObserver for container size changes
    if (containerRef.current && window.ResizeObserver) {
      resizeObserverRef.current = new ResizeObserver(handleResize);
      resizeObserverRef.current.observe(containerRef.current);
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }
    };
  }, [selectedProjection, updateDimensions]);

  // Create projection configuration
  const createProjection = useCallback(
    (worldData: any) => {
      const projectionConfig = PROJECTIONS.find(p => p.id === selectedProjection);
      if (!projectionConfig || !worldData) return null;

      const { width, height } = debouncedDimensions;

      if (selectedProjection === 'orthographic') {
        // Static orthographic (globe view without rotation)
        const radius = Math.min(width, height) / 2 - 20;
        return projectionConfig
          .projection()
          .scale(radius)
          .translate([width / 2, height / 2])
          .clipAngle(90);
      } else if (selectedProjection === 'orthographicInteractive') {
        // Interactive 3D globe with rotation - larger scale to fill and overflow container
        const baseRadius = Math.min(width, height) / 2;
        const radius = baseRadius * 1.98 * projectionScale;
        return projectionConfig
          .projection()
          .scale(radius)
          .translate([width / 2, height / 2])
          .rotate(rotation)
          .clipAngle(90);
      } else if (selectedProjection === 'conicEqualArea') {
        // Conic projections need standard parallels
        return (projectionConfig.projection() as any)
          .parallels([20, 50])
          .fitSize([width, height], worldData);
      } else {
        // Standard projections
        return projectionConfig.projection().fitSize([width, height], worldData);
      }
    },
    [selectedProjection, debouncedDimensions, rotation, projectionScale]
  );

  // Smooth rotation animation
  const smoothRotateTo = useCallback(
    (targetCoords: [number, number], duration: number = 2000, onComplete?: () => void) => {
      const startRotation = rotation;
      const targetRotation: [number, number] = [-targetCoords[0], -targetCoords[1]];

      let deltaLon = targetRotation[0] - startRotation[0];
      if (deltaLon > 180) deltaLon -= 360;
      if (deltaLon < -180) deltaLon += 360;

      const deltaLat = targetRotation[1] - startRotation[1];
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function (ease-out-cubic)
        const easeProgress =
          progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        const currentLon = startRotation[0] + deltaLon * easeProgress;
        const currentLat = startRotation[1] + deltaLat * easeProgress;

        setRotation([currentLon, currentLat]);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          // Animation completed, call the callback
          onComplete?.();
        }
      };

      requestAnimationFrame(animate);
    },
    [rotation]
  );

  // Animate projection scale
  const animateProjectionScale = useCallback(
    (from: number, to: number, duration: number = 1000) => {
      const start = Date.now();
      const step = () => {
        const elapsed = Date.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        const value =
          from +
          (to - from) *
            (progress < 0.5
              ? 4 * progress * progress * progress
              : 1 - Math.pow(-2 * progress + 2, 3) / 2);
        setProjectionScale(value);
        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };
      requestAnimationFrame(step);
    },
    []
  );

  return {
    dimensions: debouncedDimensions,
    rotation,
    projectionScale,
    projections: PROJECTIONS,
    createProjection,
    setRotation,
    setProjectionScale,
    smoothRotateTo,
    animateProjectionScale,
  };
};
