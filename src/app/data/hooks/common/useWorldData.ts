import { useState, useEffect, useCallback } from 'react';

interface WorldDataState {
  data: any | null;
  isLoading: boolean;
  error: string | null;
}

const WORLD_DATA_SOURCES = [
  'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson',
  'https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json',
];

export const useWorldData = () => {
  const [state, setState] = useState<WorldDataState>({
    data: null,
    isLoading: true,
    error: null,
  });

  const loadWorldData = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    for (let i = 0; i < WORLD_DATA_SOURCES.length; i++) {
      try {
        const response = await fetch(WORLD_DATA_SOURCES[i]);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const geoData = await response.json();

        // Validar que los datos tienen la estructura esperada
        if (!geoData.features || !Array.isArray(geoData.features)) {
          throw new Error('Invalid GeoJSON structure');
        }

        setState({
          data: geoData,
          isLoading: false,
          error: null,
        });
        return; // Éxito, salir del loop
      } catch (error) {
        console.warn(`Failed to load from source ${i + 1}:`, error);

        // Si es el último source, establecer error
        if (i === WORLD_DATA_SOURCES.length - 1) {
          setState({
            data: null,
            isLoading: false,
            error: 'Failed to load world geographic data',
          });
        }
      }
    }
  }, []);

  useEffect(() => {
    loadWorldData();
  }, [loadWorldData]);

  const refetch = useCallback(() => {
    loadWorldData();
  }, [loadWorldData]);

  return {
    worldData: state.data,
    isLoading: state.isLoading,
    error: state.error,
    refetch,
  };
};
