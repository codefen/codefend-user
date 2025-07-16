import { useState, useEffect, useRef, useCallback } from 'react';
import { COUNTRY_COORDINATES } from './useCountryData';

interface CountryWithServers {
  name: string;
  count: number;
}

interface AutoRotationConfig {
  interval?: number;
  firstRotationDelay?: number;
  rotationDuration?: number;
  enabled?: boolean;
}

const DEFAULT_CONFIG: Required<AutoRotationConfig> = {
  interval: 4000,
  firstRotationDelay: 1500,
  rotationDuration: 2000,
  enabled: true,
};

export const useMapAutoRotation = (
  countriesWithServers: CountryWithServers[],
  selectedProjection: string,
  onRotateToCountry: (coords: [number, number], countryName: string, duration?: number) => void,
  config: AutoRotationConfig = {}
) => {
  const [autoRotateIndex, setAutoRotateIndex] = useState(0);
  const [currentCountry, setCurrentCountry] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isRunningRef = useRef(false);

  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  // Stable cleanup function
  const cleanup = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    isRunningRef.current = false;
  }, []);

  // Get initial rotation based on first country
  const getInitialRotation = useCallback((): [number, number] => {
    if (selectedProjection === 'orthographicInteractive' && countriesWithServers.length > 0) {
      const firstCountry = countriesWithServers[0];
      const coords = COUNTRY_COORDINATES[firstCountry.name];
      if (coords) {
        return [-coords[0], -coords[1]];
      }
    }
    return [0, 0];
  }, [selectedProjection, countriesWithServers]);

  // Initialize rotation when data is ready
  useEffect(() => {
    if (
      selectedProjection === 'orthographicInteractive' &&
      countriesWithServers.length > 0 &&
      !isInitialized &&
      finalConfig.enabled &&
      !isRunningRef.current
    ) {
      const firstCountry = countriesWithServers[0];
      const coords = COUNTRY_COORDINATES[firstCountry.name];

      if (coords) {
        // console.log('🌍 Initializing map rotation to:', firstCountry.name);

        // Set initial country and mark as initialized immediately
        setCurrentCountry(firstCountry.name);
        setIsInitialized(true);
        setAutoRotateIndex(0);

        // Start immediate rotation to first country (no delay for better UX)
        onRotateToCountry(coords, firstCountry.name, finalConfig.rotationDuration);
      }
    } else if (selectedProjection !== 'orthographicInteractive') {
      // Reset when switching away from interactive mode
      cleanup();
      setIsInitialized(false);
      setCurrentCountry(null);
      setAutoRotateIndex(0);
    }

    return cleanup;
  }, [
    selectedProjection,
    countriesWithServers,
    isInitialized,
    finalConfig.enabled,
    onRotateToCountry,
    cleanup,
  ]);

  // Auto-rotation interval - separated from initialization
  useEffect(() => {
    if (
      selectedProjection !== 'orthographicInteractive' ||
      countriesWithServers.length <= 1 || // No rotation needed for single country
      !isInitialized ||
      !finalConfig.enabled ||
      isRunningRef.current
    ) {
      return;
    }

    // console.log('🔄 Starting auto-rotation cycle with', countriesWithServers.length, 'countries');
    isRunningRef.current = true;

    // Start auto-rotation after the first rotation completes
    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        setAutoRotateIndex(prevIndex => {
          const nextIndex = (prevIndex + 1) % countriesWithServers.length;
          const nextCountry = countriesWithServers[nextIndex];
          const coords = COUNTRY_COORDINATES[nextCountry.name];

          if (coords) {
            // console.log(
            //   '🔄 Auto-rotating to:',
            //   nextCountry.name,
            //   `(${nextIndex + 1}/${countriesWithServers.length})`
            // );
            setCurrentCountry(nextCountry.name);
            onRotateToCountry(coords, nextCountry.name, finalConfig.rotationDuration);
          }

          return nextIndex;
        });
      }, finalConfig.interval);
    }, finalConfig.interval); // Wait one interval before starting the cycle

    return () => {
      cleanup();
    };
  }, [
    selectedProjection,
    countriesWithServers.length,
    isInitialized,
    finalConfig.enabled,
    finalConfig.interval,
    finalConfig.rotationDuration,
    onRotateToCountry,
    cleanup,
  ]);

  // Manual country selection
  const rotateToCountry = useCallback(
    (countryName: string) => {
      const coords = COUNTRY_COORDINATES[countryName];
      if (coords) {
        // console.log('🎯 Manual rotation to:', countryName);
        setCurrentCountry(countryName);
        onRotateToCountry(coords, countryName, finalConfig.rotationDuration);

        // Update auto rotation index to this country
        const countryIndex = countriesWithServers.findIndex(c => c.name === countryName);
        if (countryIndex !== -1) {
          setAutoRotateIndex(countryIndex);
        }
      }
    },
    [countriesWithServers, onRotateToCountry, finalConfig.rotationDuration]
  );

  // Pause auto rotation
  const pauseAutoRotation = useCallback(() => {
    // console.log('⏸️ Pausing auto-rotation');
    cleanup();
  }, [cleanup]);

  // Resume auto rotation
  const resumeAutoRotation = useCallback(() => {
    if (selectedProjection === 'orthographicInteractive' && isInitialized && finalConfig.enabled) {
      // console.log('▶️ Resuming auto-rotation');
      isRunningRef.current = false; // Reset the running flag to allow restart

      // Resume from current index after a short delay
      timeoutRef.current = setTimeout(() => {
        if (!isRunningRef.current) {
          isRunningRef.current = true;
          intervalRef.current = setInterval(() => {
            setAutoRotateIndex(prevIndex => {
              const nextIndex = (prevIndex + 1) % countriesWithServers.length;
              const nextCountry = countriesWithServers[nextIndex];
              const coords = COUNTRY_COORDINATES[nextCountry.name];

              if (coords) {
                setCurrentCountry(nextCountry.name);
                onRotateToCountry(coords, nextCountry.name, finalConfig.rotationDuration);
              }

              return nextIndex;
            });
          }, finalConfig.interval);
        }
      }, 1000);
    }
  }, [selectedProjection, isInitialized, finalConfig, countriesWithServers, onRotateToCountry]);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return {
    currentCountry,
    autoRotateIndex,
    isInitialized,
    getInitialRotation,
    rotateToCountry,
    pauseAutoRotation,
    resumeAutoRotation,
  };
};
