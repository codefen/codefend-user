import { type FC, useRef, useMemo, useState, useCallback, useEffect } from 'react';
import type { Device } from '@interfaces/panel.ts';
import { Sort, type ColumnTableV3 } from '@interfaces/table.ts';
import { LocationItem } from '@/app/views/components/utils/LocationItem';
import { TABLE_KEYS, RESOURCE_CLASS } from '@/app/constants/app-texts';
import Tablev3 from '@table/v3/Tablev3';
import './ServerGeolocationMap.scss';
import { useTheme } from '@/app/views/context/ThemeContext';

// Optimized hooks
import { useWorldData } from '@/app/data/hooks/common/useWorldData';
import { useCountryData } from '@/app/data/hooks/common/useCountryData';
import { useMapProjection } from '@/app/data/hooks/common/useMapProjection';
import { useMapAutoRotation } from '@/app/data/hooks/common/useMapAutoRotation';
import { useLocationMetrics } from '@/app/data/hooks/common/useLocationMetrics';
import { useMemoryOptimization } from '@/app/data/hooks/common/useMemoryOptimization';

// Optimized components
import MapProjectionView from './components/MapProjectionView';
import CountryInfo from './components/CountryInfo';
import ProjectionControls from './components/ProjectionControls';

// Constants
import MAP_STYLE from './constants/mapStyles';

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

interface ServerGeolocationMapProps {
  networkData: NetworkDevice[];
  resourceType?: string;
  title?: string;
  mapResources?: {
    server_pais_code: string;
    value: string | number;
    percentage?: number;
    share?: string | number;
  }[];
}

// Table columns for location data
const locationColumns: ColumnTableV3[] = [
  {
    header: 'Location',
    key: 'location',
    type: TABLE_KEYS.FULL_ROW,
    styles: 'item-cell-location-1',
    weight: '50%',
    render: (resource: any) => (
      <LocationItem country={resource?.country} countryCode={resource?.countryCode} />
    ),
  },
  {
    header: 'Count',
    key: 'count',
    styles: 'item-cell-location-2',
    weight: '25%',
    render: (resource: any) => resource,
  },
  {
    header: 'Percentage',
    key: 'percentage',
    styles: 'item-cell-location-3',
    weight: '25%',
    render: (resource: any) => `${resource}%`,
  },
];

export const ServerGeolocationMap: FC<ServerGeolocationMapProps> = ({
  networkData,
  resourceType = RESOURCE_CLASS.NETWORK,
  title = 'Global server distribution',
  mapResources,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [selectedProjection, setSelectedProjection] = useState('orthographicInteractive');
  const { theme } = useTheme();

  // ✅ Optimized hooks
  const { worldData, isLoading, error } = useWorldData();
  const countryDataResult = useCountryData(networkData, mapResources);
  const { dimensions, createProjection, smoothRotateTo, animateProjectionScale } = useMapProjection(
    containerRef,
    selectedProjection
  );

  // ✅ Stable callback for country rotation
  const onRotateToCountry = useCallback(
    (coords: [number, number], countryName: string, duration?: number) => {
      if (selectedProjection === 'orthographicInteractive') {
        // console.log('🎯 Rotating globe to:', countryName, 'at coords:', coords);
        smoothRotateTo(coords, duration);
      }
    },
    [selectedProjection, smoothRotateTo]
  );

  // ✅ Optimized auto-rotation with stable dependencies
  const { currentCountry } = useMapAutoRotation(
    countryDataResult.countriesWithServers,
    selectedProjection,
    onRotateToCountry,
    {
      interval: MAP_STYLE.autoRotateInterval,
      rotationDuration: MAP_STYLE.rotateDuration,
      enabled: true,
    }
  );

  // ✅ Optimized location metrics
  const locationMetrics = useLocationMetrics(
    countryDataResult.normalizedData,
    mapResources,
    resourceType
  );

  // ✅ Memory optimization for large datasets
  useMemoryOptimization({
    clearSWROnUnmount: networkData.length > 1000,
    cleanupInterval: networkData.length > 500 ? 120000 : 300000,
    memoryThreshold: networkData.length > 1000 ? 150 : 100,
  });

  // ✅ Memoized handlers for performance
  const handleProjectionChange = useCallback((projection: string) => {
    setSelectedProjection(projection);
  }, []);

  const handleCountryTooltip = useCallback((countryName: string, count: number, rank?: number) => {
    if (count === 0) {
      return `${countryName}: 0 servidores`;
    }
    return `${countryName}: ${count} servidor${count !== 1 ? 'es' : ''} (Ranking #${rank})`;
  }, []);

  // ✅ Loading state optimizado
  if (isLoading) {
    return (
      <div className="card title server-geolocation-map">
        <ProjectionControls
          selectedProjection={selectedProjection}
          onProjectionChange={handleProjectionChange}
          title={title}
        />
        <div className="content" ref={containerRef}>
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Cargando mapa mundial...</p>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Error state optimizado
  if (error) {
    return (
      <div className="card title server-geolocation-map">
        <ProjectionControls
          selectedProjection={selectedProjection}
          onProjectionChange={handleProjectionChange}
          title={title}
        />
        <div className="content" ref={containerRef}>
          <div className="error-container">
            <p>Error loading map data: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card title server-geolocation-map">
      <ProjectionControls
        selectedProjection={selectedProjection}
        onProjectionChange={handleProjectionChange}
        title={title}
      />
      <div className="content" ref={containerRef}>
        <div
          className={`map-container ${selectedProjection === 'orthographicInteractive' ? 'interactive-globe' : ''}`}
          style={{ cursor: 'default', position: 'relative' }}>
          <MapProjectionView
            worldData={worldData}
            countryData={countryDataResult.countryData}
            countryRanking={countryDataResult.countryRanking}
            dimensions={dimensions}
            selectedProjection={selectedProjection}
            createProjection={createProjection}
            mapStyle={MAP_STYLE}
            theme={theme}
            onCountryTooltip={handleCountryTooltip}
          />

          <CountryInfo
            currentCountry={currentCountry}
            countryData={countryDataResult.countryData}
            mapResources={mapResources}
            normalizedDataLength={countryDataResult.normalizedData.length}
          />
        </div>

        <div className="location-table">
          <Tablev3
            columns={locationColumns}
            rows={locationMetrics}
            showRows={!isLoading}
            initialSort={Sort.desc}
            initialOrder="count"
          />
        </div>
      </div>
    </div>
  );
};
