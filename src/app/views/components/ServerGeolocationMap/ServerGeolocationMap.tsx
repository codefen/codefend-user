import { type FC, useEffect, useRef, useMemo, useState } from 'react';
import * as d3 from 'd3';
import type { Device } from '@interfaces/panel.ts';
import { Sort, type ColumnTableV3 } from '@interfaces/table.ts';
import { MetricsService } from '@utils/metric.service.ts';
import { LocationItem } from '@/app/views/components/utils/LocationItem';
import { TABLE_KEYS, RESOURCE_CLASS } from '@/app/constants/app-texts';
import Tablev3 from '@table/v3/Tablev3';
import './ServerGeolocationMap.scss';

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
  mapResources?: { server_pais_code: string; value: string | number; percentage?: number; share?: string | number }[];
}

// Available projections for comparison
const PROJECTIONS = [
  { id: 'naturalEarth1', name: 'Natural Earth', projection: d3.geoNaturalEarth1 },
  { id: 'orthographicInteractive', name: 'Interactive 3D Globe', projection: d3.geoOrthographic },
];

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

// =============================
// 🎨 VARIABLES DE ESTÉTICA Y ANIMACIÓN (EDITAR AQUÍ)
// =============================
const MAP_STYLE = {
  // Colores de países
  countryNoData: '#eee', // Países sin datos
  countryTop: '#333',    // País #1 con más servidores
  countryBase: '#333',   // Color base para el gradiente de países

  // Bordes de países
  countryBorder: '#ccc',
  countryBorderWidth: 0.2,

  // Fondo de agua (globo)
  oceanCenter: '#fff',    // Centro del océano (blanco puro)
  oceanEdge: '#fefefe',      // Bordes del océano (gris muy claro)
  globeBorder: '#e5e7eb', // Borde del globo (gris claro)
  globeBorderWidth: 1,

  // Grilla (meridianos/paralelos)
  graticule3D: '#333',
  graticule2D: '#e0e0e0',
  graticuleWidth3D: 0.3,
  graticuleWidth2D: 0.5,
  graticuleOpacity: 0.3,

  // Zoom y animación
  zoomInScale: 2.0,
  zoomOutScale: 1.0,
  zoomInDuration: 2000, // ms
  zoomOutDuration: 1000, // ms
  rotateDuration: 2000, // ms
  rotateFirstDuration: 1500, // ms
  autoRotateInterval: 4000, // ms
  autoRotateIntervalShort: 2000, // ms
};
// =============================

// Función utilitaria para normalizar los datos de país
function normalizeCountryData(data: any[]): any[] {
  const nameMapping: Record<string, string> = {
    'US': 'USA',
    'United States': 'USA',
    'United States of America': 'USA',
    'Brasil': 'Brazil',
    'UK': 'United Kingdom',
    'Great Britain': 'United Kingdom',
    'Holland': 'Netherlands',
    'Deutschland': 'Germany',
    'Alemania': 'Germany',
    'España': 'Spain',
    'España (Spain)': 'Spain',
    'México': 'Mexico',
    'Australie': 'Australia',
    'Argentine': 'Argentina',
    'Suisse': 'Switzerland',
    'Suiza': 'Switzerland',
    'Österreich': 'Austria',
    'Italia': 'Italy',
    'Francia': 'France',
    'Canadá': 'Canada',
    'Países Bajos': 'Netherlands',
    'Países bajos': 'Netherlands',
    'Países Bajos (Netherlands)': 'Netherlands',
    'Reino Unido': 'United Kingdom',
    'Reino Unido (UK)': 'United Kingdom',
    'Rusia': 'Russia',
    'Japón': 'Japan',
    'China': 'China',
    'India': 'India',
    'Sudáfrica': 'South Africa',
    'Bélgica': 'Belgium',
    'Suède': 'Sweden',
    'Suecia': 'Sweden',
    'Noruega': 'Norway',
    'Dinamarca': 'Denmark',
    'Finlandia': 'Finland',
    'Irlanda': 'Ireland',
    'Grecia': 'Greece',
    'Turquía': 'Turkey',
    'Israel': 'Israel',
    'Singapur': 'Singapore',
    'Corea del Sur': 'South Korea',
    'Tailandia': 'Thailand',
    'Malasia': 'Malaysia',
    'Indonesia': 'Indonesia',
    'Filipinas': 'Philippines',
    'Vietnam': 'Vietnam',
    'Nueva Zelanda': 'New Zealand',
    'Chile': 'Chile',
  };
  return data.map((item) => {
    let country = (item.server_pais || '').trim();
    if (nameMapping[country]) country = nameMapping[country];
    // Si no hay country, intentar con el código
    if (!country && item.server_pais_code) {
      const codeMap: Record<string, string> = {
        'us': 'USA', 'ar': 'Argentina', 'de': 'Germany', 'es': 'Spain', 'fr': 'France', 'it': 'Italy', 'br': 'Brazil', 'gb': 'United Kingdom', 'nl': 'Netherlands', 'au': 'Australia', 'ca': 'Canada', 'ru': 'Russia', 'cn': 'China', 'in': 'India', 'jp': 'Japan', 'za': 'South Africa', 'mx': 'Mexico', 'be': 'Belgium', 'ch': 'Switzerland', 'at': 'Austria', 'pt': 'Portugal', 'pl': 'Poland', 'cz': 'Czech Republic', 'hu': 'Hungary', 'ro': 'Romania', 'bg': 'Bulgaria', 'hr': 'Croatia', 'si': 'Slovenia', 'sk': 'Slovakia', 'ee': 'Estonia', 'lv': 'Latvia', 'lt': 'Lithuania', 'fi': 'Finland', 'dk': 'Denmark', 'is': 'Iceland', 'ie': 'Ireland', 'gr': 'Greece', 'tr': 'Turkey', 'il': 'Israel', 'sg': 'Singapore', 'kr': 'South Korea', 'th': 'Thailand', 'my': 'Malaysia', 'id': 'Indonesia', 'ph': 'Philippines', 'vn': 'Vietnam', 'nz': 'New Zealand', 'cl': 'Chile',
      };
      const code = (item.server_pais_code || '').toLowerCase();
      if (codeMap[code]) country = codeMap[code];
    }
    return { ...item, server_pais: country };
  });
}

export const ServerGeolocationMap: FC<ServerGeolocationMapProps> = ({ 
  networkData, 
  resourceType = RESOURCE_CLASS.NETWORK, 
  title = "Server Geolocation Distribution",
  mapResources
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [worldData, setWorldData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });
  const [locationMetrics, setLocationMetrics] = useState<any[]>([]);
  const [selectedProjection, setSelectedProjection] = useState('orthographicInteractive');
  const [autoRotateIndex, setAutoRotateIndex] = useState(0);
  const [currentCountry, setCurrentCountry] = useState<string | null>(null); // País actual mostrado
  const [isZoomed, setIsZoomed] = useState(false);
  const globeGroupRef = useRef<SVGGElement | null>(null);
  const [projectionScale, setProjectionScale] = useState(1.0);

  // Normalizo los datos antes de procesar
  const normalizedData = useMemo(() => normalizeCountryData(networkData), [networkData]);

  // Utilidad para mapear código de país a nombre
  const codeToName: Record<string, string> = {
    'US': 'USA', 'AR': 'Argentina', 'NL': 'Netherlands', 'DE': 'Germany', 'CL': 'Chile', 'ES': 'Spain', 'CA': 'Canada', 'FR': 'France',
    'BE': 'Belgium', 'CH': 'Switzerland', 'AT': 'Austria', 'PT': 'Portugal', 'PL': 'Poland', 'CZ': 'Czech Republic', 'HU': 'Hungary',
    'RO': 'Romania', 'BG': 'Bulgaria', 'HR': 'Croatia', 'SI': 'Slovenia', 'SK': 'Slovakia', 'EE': 'Estonia', 'LV': 'Latvia', 'LT': 'Lithuania',
    'FI': 'Finland', 'DK': 'Denmark', 'IS': 'Iceland', 'IE': 'Ireland', 'GR': 'Greece', 'TR': 'Turkey', 'IL': 'Israel', 'SG': 'Singapore',
    'KR': 'South Korea', 'TH': 'Thailand', 'MY': 'Malaysia', 'ID': 'Indonesia', 'PH': 'Philippines', 'VN': 'Vietnam', 'NZ': 'New Zealand',
    'RU': 'Russia', 'CN': 'China', 'IN': 'India', 'JP': 'Japan', 'ZA': 'South Africa', 'MX': 'Mexico', 'GB': 'United Kingdom',
    'AU': 'Australia', '' : 'unknown'
  };

  // Log de entrada de datos
  // console.log('[ServerGeolocationMap] networkData:', networkData);
  // console.log('[ServerGeolocationMap] mapResources:', mapResources);

  // Si hay mapResources, armo el conteo de países desde ahí
  const countryData = useMemo(() => {
    if (mapResources && Array.isArray(mapResources)) {
      const counts: Record<string, number> = {};
      mapResources.forEach(({ server_pais_code, value }) => {
        const code = (server_pais_code || '').toUpperCase();
        const name = codeToName[code] || code || 'unknown';
        const val = typeof value === 'string' ? parseInt(value, 10) : value;
        if (name) counts[name] = val;
      });
      // console.log('[ServerGeolocationMap] countryData generado desde mapResources:', counts);
      return counts;
    }
    const reduced = normalizeCountryData(networkData).reduce((acc, item) => {
      if (item.server_pais && item.server_pais !== 'unknown') {
        acc[item.server_pais] = (acc[item.server_pais] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    // console.log('[ServerGeolocationMap] countryData generado desde networkData:', reduced);
    return reduced;
  }, [mapResources, networkData]);

  // Get max count for color scaling
  const maxCount = useMemo(() => {
    return Math.max(...Object.values(countryData).map(v => Number(v)), 1);
  }, [countryData]);

  // Create ranking-based color mapping
  const countryRanking = useMemo(() => {
    // Get all countries with their counts, sorted by count (descending)
    const sortedCountries = Object.entries(countryData)
      .filter(([_, count]) => Number(count) > 0)
      .sort(([, a], [, b]) => Number(b) - Number(a));
    
    // Create ranking map
    const ranking: Record<string, number> = {};
    sortedCountries.forEach(([countryName], index) => {
      ranking[countryName] = index + 1; // 1-based ranking
    });
    
    return ranking;
  }, [countryData]);

  // Coordenadas geográficas para países (longitud, latitud)
  const countryCoordinates: Record<string, [number, number]> = {
    'Argentina': [-64.0, -34.0],
    'USA': [-95.0, 39.0],
    'Canada': [-106.0, 60.0],
    'Netherlands': [5.75, 52.5],
    'Australia': [133.0, -27.0],
    'Brazil': [-55.0, -10.0],
    'United Kingdom': [-2.0, 54.0],
    'France': [2.0, 46.0],
    'Germany': [9.0, 51.0],
    'Spain': [-4.0, 40.0],
    'Italy': [12.0, 42.0],
    'Russia': [105.0, 61.0],
    'China': [104.0, 35.0],
    'India': [78.0, 20.0],
    'Japan': [138.0, 36.0],
    'South Africa': [22.0, -31.0],
    'Mexico': [-102.0, 23.0],
    'Belgium': [4.5, 50.8],
    'Switzerland': [8.2, 46.8],
    'Austria': [14.5, 47.5],
    'Portugal': [-8.0, 39.5],
    'Poland': [19.0, 52.0],
    'Czech Republic': [15.5, 49.75],
    'Hungary': [20.0, 47.0],
    'Romania': [25.0, 46.0],
    'Bulgaria': [25.0, 43.0],
    'Croatia': [15.5, 45.0],
    'Slovenia': [14.5, 46.0],
    'Slovakia': [19.5, 48.7],
    'Estonia': [26.0, 59.0],
    'Latvia': [25.0, 57.0],
    'Lithuania': [24.0, 56.0],
    'Finland': [26.0, 64.0],
    'Denmark': [10.0, 56.0],
    'Iceland': [-18.0, 65.0],
    'Ireland': [-8.0, 53.0],
    'Greece': [22.0, 39.0],
    'Turkey': [35.0, 39.0],
    'Israel': [34.8, 31.0],
    'Singapore': [103.8, 1.3],
    'South Korea': [128.0, 36.0],
    'Thailand': [100.0, 15.0],
    'Malaysia': [112.0, 2.5],
    'Indonesia': [113.0, -0.8],
    'Philippines': [122.0, 13.0],
    'Vietnam': [108.0, 14.0],
    'New Zealand': [174.0, -41.0],
    'Chile': [-71.0, -30.0],
  };

  // Get sorted countries with servers for auto-rotation (declarado antes de cualquier uso)
  const countriesWithServers = useMemo(() => {
    const arr = Object.entries(countryData)
      .filter(([countryName, count]) => Number(count) > 0 && countryCoordinates[countryName])
      .sort(([_, a], [__, b]) => Number(b) - Number(a))
      .map(([countryName, count]) => ({ name: countryName, count: Number(count) }));
    // console.log('[ServerGeolocationMap] countriesWithServers:', arr);
    return arr;
  }, [countryData, countryCoordinates]);

  // Estado de rotación inicializado correctamente (lazy init)
  const initialRotation = useMemo(() => {
    if (selectedProjection === 'orthographicInteractive' && countriesWithServers.length > 0) {
      const firstCountry = countriesWithServers[0];
      const coords = countryCoordinates[firstCountry.name];
      if (coords) {
        return [-coords[0], -coords[1]] as [number, number];
      }
    }
    return [0, 0] as [number, number];
  }, [selectedProjection, countriesWithServers]);
  const [rotation, setRotation] = useState<[number, number]>(() => initialRotation);

  // Corrige la rotación si los datos llegan después del primer render
  useEffect(() => {
    if (
      selectedProjection === 'orthographicInteractive' &&
      countriesWithServers.length > 0 &&
      rotation[0] === 0 && rotation[1] === 0
    ) {
      const firstCountry = countriesWithServers[0];
      const coords = countryCoordinates[firstCountry.name];
      if (coords) {
        setRotation([-coords[0], -coords[1]]);
        setCurrentCountry(firstCountry.name);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProjection, countriesWithServers, rotation]);

  // ============================================
  // 🎨 COLORES DEL MAPA 2D - EDITAR AQUÍ
  // ============================================
  // 🔹 COLOR: Países sin datos (gris muy claro)
  // 🔹 COLOR: País #1 con más servidores (rojo base)  
  // 🔹 DISTANCIA: 0%, 20%, 40%, 60%, etc.
  // ============================================
  const lightenColor = (color: string, percentage: number) => {
    const color_rgb = d3.rgb(color);
    const white = d3.rgb(255, 255, 255);
    return d3.interpolateRgb(color_rgb, white)(percentage / 100);
  };

  // ============================================
  // 🎨 FUNCIÓN DE COLORES POR RANKING - EDITAR AQUÍ
  // ============================================
  // Get color for a country based on its ranking
  const getCountryColor = (countryName: string) => {
    const count = countryData[countryName] || 0;
    
    if (count === 0) {
      return MAP_STYLE.countryNoData;
    }
    
    const rank = countryRanking[countryName];
    if (!rank) return MAP_STYLE.countryNoData;
    
    if (rank === 1) {
      return MAP_STYLE.countryTop;
    }
    
    // Calculate lightening percentage based on rank
    // 🔹 DISTANCIA: 0%, 60%, 120%, 180%, etc. (incrementos de 60%)
    const lightenPercentage = (rank - 1) * 10;
    return lightenColor(MAP_STYLE.countryBase, lightenPercentage);
  };
  // ============================================

  // Function to get display text based on current country
  const getDisplayText = () => {
    if (!currentCountry) {
      return `Found servers: ${normalizedData?.length || 0}`;
    }
    
    const count = countryData[currentCountry] || 0;
    const totalServers = normalizedData?.length || 0;
    const percentage = totalServers > 0 ? ((count / totalServers) * 100).toFixed(1) : '0.0';
    
    // Get country code for display
    const countryCodeMap: Record<string, string> = {
      'Argentina': 'AR',
      'USA': 'US', 
      'Canada': 'CA',
      'Netherlands': 'NL',
      'Australia': 'AU',
      'Brazil': 'BR',
      'United Kingdom': 'GB',
      'France': 'FR',
      'Germany': 'DE',
      'Spain': 'ES',
      'Italy': 'IT',
      'Russia': 'RU',
      'China': 'CN',
      'India': 'IN',
      'Japan': 'JP',
      'South Africa': 'ZA',
      'Mexico': 'MX',
      'Belgium': 'BE',
      'Switzerland': 'CH',
      'Austria': 'AT',
      'Portugal': 'PT',
      'Poland': 'PL',
      'Czech Republic': 'CZ',
      'Hungary': 'HU',
      'Romania': 'RO',
      'Bulgaria': 'BG',
      'Croatia': 'HR',
      'Slovenia': 'SI',
      'Slovakia': 'SK',
      'Estonia': 'EE',
      'Latvia': 'LV',
      'Lithuania': 'LT',
      'Finland': 'FI',
      'Denmark': 'DK',
      'Iceland': 'IS',
      'Ireland': 'IE',
      'Greece': 'GR',
      'Turkey': 'TR',
      'Israel': 'IL',
      'Singapore': 'SG',
      'South Korea': 'KR',
      'Thailand': 'TH',
      'Malaysia': 'MY',
      'Indonesia': 'ID',
      'Philippines': 'PH',
      'Vietnam': 'VN',
      'New Zealand': 'NZ',
      'Chile': 'CL',
    };
    
    const countryCode = countryCodeMap[currentCountry] || currentCountry.substring(0, 2).toUpperCase();
    
    return `${countryCode} | found servers: ${count} - ${percentage}%`;
  };

  // Reemplazo el setTimeout de setProjectionScale(1.2) por una animación suave a 1.5
  const animateProjectionScale = (from: number, to: number, duration: number = MAP_STYLE.zoomOutDuration) => {
    const start = Date.now();
    const step = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const value = from + (to - from) * (progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2);
      setProjectionScale(value);
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  };

  // En smoothRotateTo, antes de rotar, animar suavemente de 2.0 a 1.0
  const smoothRotateTo = (targetCoords: [number, number], countryName: string, duration: number = MAP_STYLE.rotateDuration) => {
    animateProjectionScale(MAP_STYLE.zoomInScale, MAP_STYLE.zoomOutScale, MAP_STYLE.zoomOutDuration);
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
      const easeProgress = progress < 0.5 
        ? 4 * progress * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      const currentLon = startRotation[0] + deltaLon * easeProgress;
      const currentLat = startRotation[1] + deltaLat * easeProgress;
      setRotation([currentLon, currentLat]);
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCurrentCountry(countryName);
        animateProjectionScale(MAP_STYLE.zoomOutScale, MAP_STYLE.zoomInScale, MAP_STYLE.zoomInDuration);
      }
    };
    requestAnimationFrame(animate);
  };

  // Calculate location metrics for the table
  useEffect(() => {
    // Safety check: ensure normalizedData exists and is an array
    if (!normalizedData || !Array.isArray(normalizedData)) {
      setLocationMetrics([]);
      return;
    }
    // Si mapResources viene del backend, usarlo para la tabla
    if (mapResources && Array.isArray(mapResources) && mapResources.length > 0 && mapResources[0].share !== undefined) {
      const codeToName: Record<string, string> = {
        'US': 'USA', 'AR': 'Argentina', 'NL': 'Netherlands', 'DE': 'Germany', 'CL': 'Chile', 'ES': 'Spain', 'CA': 'Canada', 'FR': 'France',
        'BE': 'Belgium', 'CH': 'Switzerland', 'AT': 'Austria', 'PT': 'Portugal', 'PL': 'Poland', 'CZ': 'Czech Republic', 'HU': 'Hungary',
        'RO': 'Romania', 'BG': 'Bulgaria', 'HR': 'Croatia', 'SI': 'Slovenia', 'SK': 'Slovakia', 'EE': 'Estonia', 'LV': 'Latvia', 'LT': 'Lithuania',
        'FI': 'Finland', 'DK': 'Denmark', 'IS': 'Iceland', 'IE': 'Ireland', 'GR': 'Greece', 'TR': 'Turkey', 'IL': 'Israel', 'SG': 'Singapore',
        'KR': 'South Korea', 'TH': 'Thailand', 'MY': 'Malaysia', 'ID': 'Indonesia', 'PH': 'Philippines', 'VN': 'Vietnam', 'NZ': 'New Zealand',
        'RU': 'Russia', 'CN': 'China', 'IN': 'India', 'JP': 'Japan', 'ZA': 'South Africa', 'MX': 'Mexico', 'GB': 'United Kingdom',
        'AU': 'Australia', '' : 'unknown'
      };
      const metrics = mapResources.map((mr: any) => {
        const code = (mr.server_pais_code || '').toUpperCase();
        const country = codeToName[code] || code || 'unknown';
        return {
          location: { country, countryCode: code },
          count: Number(mr.value),
          percentage: String(mr.share),
          country,
          countryCode: code,
        };
      });
      setLocationMetrics(metrics);
      return;
    }
    // Si no, usar el método tradicional
    const metrics = MetricsService.getCountryMetrics(normalizedData, resourceType);
    const transformedMetrics = metrics.map((metric: any) => ({
      location: metric,
      count: metric.count,
      percentage: metric.percentage,
      country: metric.country,
      countryCode: metric.countryCode,
    }));
    setLocationMetrics(transformedMetrics);
  }, [normalizedData, resourceType, mapResources]);

  // Load world topology data
  useEffect(() => {
    const loadWorldData = async () => {
      try {
        // Use Natural Earth data for complete world coverage
        const response = await fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson');
        const geoData = await response.json();
        
        // DEBUG: Log algunos países del GeoJSON para ver la estructura
        // console.log('=== DEBUG: Estructura del GeoJSON ===');
        // console.log('Primeros 5 países en GeoJSON:');
        // geoData.features.slice(0, 5).forEach((feature: any, index: number) => {
        //   console.log(`País ${index}:`, {
        //     NAME: feature.properties.NAME,
        //     ISO_A2: feature.properties.ISO_A2,
        //     ISO_A3: feature.properties.ISO_A3,
        //     name: feature.properties.name,
        //     iso_a2: feature.properties.iso_a2
        //   });
        // });
        
        // Buscar específicamente Estados Unidos y otros países importantes
        const usFeature = geoData.features.find((f: any) => 
          f.properties.name?.includes('United States') ||
          f.properties.name?.includes('USA') ||
          f.properties.name?.includes('America')
        );
        // console.log('=== DEBUG: Estados Unidos encontrado ===');
        // console.log('Nombre exacto:', usFeature?.properties.name);
        // console.log('Propiedades completas:', usFeature?.properties);
        
        const arFeature = geoData.features.find((f: any) => 
          f.properties.NAME?.includes('Argentina') ||
          f.properties.name?.includes('Argentina')
        );
        // console.log('=== DEBUG: Argentina encontrada ===');
        // console.log(arFeature?.properties);
        
        const caFeature = geoData.features.find((f: any) => 
          f.properties.NAME?.includes('Canada') ||
          f.properties.name?.includes('Canada')
        );
        // console.log('=== DEBUG: Canadá encontrado ===');
        // console.log(caFeature?.properties);
        
        setWorldData(geoData);
        setIsLoading(false);
      } catch (error) {
        // console.error('Error loading world data:', error);
        // Fallback to the previous source
        try {
          const fallbackResponse = await fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json');
          const fallbackData = await fallbackResponse.json();
          setWorldData(fallbackData);
          setIsLoading(false);
        } catch (fallbackError) {
          // console.error('Fallback also failed:', fallbackError);
          setIsLoading(false);
        }
      }
    };

    loadWorldData();
  }, []);

  // Handle responsive resizing
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        
        if (selectedProjection === 'orthographicInteractive') {
          // For 3D globe: fixed height of 360px, width matches container
          const width = Math.min(Math.max(400, containerWidth), 800);
          const height = 360; // Fixed height for 3D globe
          setDimensions({ width, height });
        } else {
          // For flat projections, use a more traditional aspect ratio
          const width = Math.min(Math.max(600, containerWidth), 900);
          const height = Math.round(width * 0.6); // 5:3 aspect ratio
          setDimensions({ width, height });
        }
      }
    };

    // Initial size calculation with delay to ensure DOM is ready
    const timer = setTimeout(updateDimensions, 100);
    updateDimensions(); // Also call immediately

    // Add resize listener
    window.addEventListener('resize', updateDimensions);
    
    // Also listen for container size changes (using ResizeObserver if available)
    let resizeObserver: ResizeObserver | null = null;
    if (containerRef.current && window.ResizeObserver) {
      resizeObserver = new ResizeObserver(updateDimensions);
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateDimensions);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [selectedProjection]); // Re-run when projection changes

  useEffect(() => {
    if (!svgRef.current || !worldData || isLoading) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous render

    const { width, height } = dimensions;
    
    svg.attr('width', width).attr('height', height);

    // Get the selected projection
    const projectionConfig = PROJECTIONS.find(p => p.id === selectedProjection);
    if (!projectionConfig) return;

    // Create the projection with proper configuration
    let projection;
    
    if (selectedProjection === 'orthographic') {
      // Static orthographic (globe view without rotation)
      const radius = Math.min(width, height) / 2 - 20;
      projection = projectionConfig.projection()
        .scale(radius)
        .translate([width / 2, height / 2])
        .clipAngle(90);
    } else if (selectedProjection === 'orthographicInteractive') {
      // Interactive 3D globe with rotation - larger scale to fill and overflow container
      const baseRadius = Math.min(width, height) / 2;
      const radius = baseRadius * 1.98 * projectionScale;
      projection = projectionConfig.projection()
        .scale(radius)
        .translate([width / 2, height / 2])
        .rotate(rotation)
        .clipAngle(90);
    } else if (selectedProjection === 'conicEqualArea') {
      // Conic projections need standard parallels
      projection = (projectionConfig.projection() as any)
        .parallels([20, 50])
        .fitSize([width, height], worldData);
    } else {
      // Standard projections
      projection = projectionConfig.projection()
        .fitSize([width, height], worldData);
    }

    const path = d3.geoPath().projection(projection);

    // ============================================
    // 🌍 COLORES DEL GLOBO 3D - EDITAR AQUÍ
    // ============================================
    // 🔹 COLOR: Centro del océano (blanco)
    // 🔹 COLOR: Bordes del océano (gris muy claro)  
    // 🔹 COLOR: Borde del globo (gris claro)
    // ============================================
    // Add special 3D effects for interactive globe
    if (selectedProjection === 'orthographicInteractive') {
      // Add gradient definitions for 3D effect
      const defs = svg.append('defs');
      
      // Sphere gradient for 3D effect
      const sphereGradient = defs.append('radialGradient')
        .attr('id', 'sphere-gradient')
        .attr('cx', '30%')
        .attr('cy', '30%');
      
      sphereGradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', MAP_STYLE.oceanCenter) // 🔹 COLOR: Centro del océano (blanco)
        .attr('stop-opacity', 1);
      
      sphereGradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', MAP_STYLE.oceanEdge) // 🔹 COLOR: Bordes del océano (gris muy claro)
        .attr('stop-opacity', 1);

      // Add sphere background
      const baseRadius = Math.min(width, height) / 2;
      const radius = baseRadius * 1.98; // Match the projection scale (increased 10%)
      svg.append('circle')
        .attr('cx', width / 2)
        .attr('cy', height / 2)
        .attr('r', radius)
        .attr('fill', 'url(#sphere-gradient)')
        .attr('stroke', MAP_STYLE.globeBorder) // 🔹 COLOR: Borde del globo (gris claro)
        .attr('stroke-width', MAP_STYLE.globeBorderWidth);
    }
    // ============================================

    // Draw countries
    svg.selectAll('path.country')
      .data(worldData.features)
      .enter()
      .append('path')
      .attr('class', 'country')
      .attr('d', path as any)
      .attr('fill', (d: any) => {
        // Try multiple property names for country name
        let countryName = (d.properties.NAME || d.properties.name || d.properties.NAME_EN || '');
        
        // Normalize country names - mantener el caso original para el mapeo
        const normalizedName = countryName.trim();
        
        const count = countryData[normalizedName] || 0;
        return getCountryColor(normalizedName);
      })
      // ============================================
      // 🌎 BORDES DE PAÍSES - EDITAR AQUÍ
      // ============================================
      // 🔹 COLOR: Bordes de países (gris claro)
      // 🔹 GROSOR: Bordes de países (0.2px)
      // ============================================
      .attr('stroke', MAP_STYLE.countryBorder) // 🔹 COLOR: Bordes de países (gris claro)
      .attr('stroke-width', MAP_STYLE.countryBorderWidth) // 🔹 GROSOR: Bordes de países (0.2px)
      .append('title')
      .text((d: any) => {
        let countryName = (d.properties.NAME || d.properties.name || d.properties.NAME_EN || '');
        
        const count = countryData[countryName] || 0;
        const countryFullName = d.properties.NAME || d.properties.name || d.properties.NAME_EN || 'Unknown';
        const rank = countryRanking[countryName];
        
        if (count === 0) {
          return `${countryFullName}: 0 servidores`;
        }
        
        return `${countryFullName}: ${count} servidor${count !== 1 ? 'es' : ''} (Ranking #${rank})`;
      });

    // ============================================
    // 🗺️ LÍNEAS DE GRILLA (MERIDIANOS/PARALELOS) - EDITAR AQUÍ
    // ============================================
    // 🔹 COLOR 3D: Líneas blancas para globo 3D
    // 🔹 COLOR 2D: Líneas grises para mapa 2D  
    // 🔹 GROSOR: 0.3px para 3D, 0.5px para 2D
    // ============================================
    // Add graticules (grid lines) for better visual reference
    const graticule = d3.geoGraticule()
      .step(selectedProjection === 'orthographicInteractive' ? [15, 15] : [30, 30]);

    svg.append('path')
      .datum(graticule)
      .attr('class', 'graticule')
      .attr('d', path as any)
      .attr('fill', 'none')
      .attr('stroke', selectedProjection === 'orthographicInteractive' ? MAP_STYLE.graticule3D : MAP_STYLE.graticule2D) // 🔹 COLOR: Blanco para 3D, gris para 2D
      .attr('stroke-width', selectedProjection === 'orthographicInteractive' ? MAP_STYLE.graticuleWidth3D : MAP_STYLE.graticuleWidth2D) // 🔹 GROSOR: 0.3px para 3D, 0.5px para 2D
      .attr('opacity', selectedProjection === 'orthographicInteractive' ? MAP_STYLE.graticuleOpacity : MAP_STYLE.graticuleOpacity); // 🔹 OPACIDAD: 0.3 para ambos
    // ============================================

  }, [worldData, countryData, maxCount, isLoading, dimensions, selectedProjection, rotation, countryRanking, normalizedData, currentCountry, projectionScale]);

  // Auto-rotation effect for 3D globe
  useEffect(() => {
    if (selectedProjection !== 'orthographicInteractive' || countriesWithServers.length === 0) {
      return;
    }
    let started = false;
    if (countriesWithServers.length > 0 && autoRotateIndex === 0 && !currentCountry) {
      const firstCountry = countriesWithServers[0];
      const coords = countryCoordinates[firstCountry.name];
      // console.log('[ServerGeolocationMap] Primer país a rotar:', firstCountry.name, 'coords:', coords);
      if (coords) {
        smoothRotateTo(coords, firstCountry.name, MAP_STYLE.rotateFirstDuration);
        started = true;
      } else {
        // console.warn('[ServerGeolocationMap] No se encontraron coordenadas para', firstCountry.name);
      }
    }
    const interval = setInterval(() => {
      setAutoRotateIndex(prevIndex => {
        const nextIndex = (prevIndex + 1) % countriesWithServers.length;
        const nextCountry = countriesWithServers[nextIndex];
        const coords = countryCoordinates[nextCountry.name];
        // console.log('[ServerGeolocationMap] Siguiente país a rotar:', nextCountry.name, 'coords:', coords);
        if (coords) {
          smoothRotateTo(coords, nextCountry.name, MAP_STYLE.rotateDuration);
        } else {
          // console.warn('[ServerGeolocationMap] No se encontraron coordenadas para', nextCountry.name);
        }
        return nextIndex;
      });
    }, started ? MAP_STYLE.autoRotateInterval : MAP_STYLE.autoRotateIntervalShort);
    return () => clearInterval(interval);
  }, [selectedProjection, countriesWithServers, countryCoordinates, autoRotateIndex, currentCountry]);

  // Sincronizar currentCountry también al montar
  useEffect(() => {
    if (selectedProjection === 'orthographicInteractive' && countriesWithServers.length > 0) {
      setCurrentCountry(countriesWithServers[0].name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProjection, countriesWithServers.length]);

  if (isLoading) {
    return (
      <div className="card title server-geolocation-map">
        <div className="header">
          <div className="title-section">
            <span>Server Geolocation distribution</span>
          </div>
        </div>
        <div className="content" ref={containerRef}>
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Cargando mapa mundial...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card title server-geolocation-map">
      <div className="header">
        <div className="title-section">
          <span>Server Geolocation distribution</span>
          <div className="view-tabs">
            <span className="divider">|</span>
            <button 
              className={selectedProjection === 'orthographicInteractive' ? 'active' : ''}
              onClick={() => setSelectedProjection('orthographicInteractive')}
            >
              3D
            </button>
            <span className="divider">|</span>
            <button 
              className={selectedProjection === 'naturalEarth1' ? 'active' : ''}
              onClick={() => setSelectedProjection('naturalEarth1')}
            >
              2D
            </button>
          </div>
        </div>
      </div>
      <div className="content" ref={containerRef}>
        <div 
          className={`map-container ${selectedProjection === 'orthographicInteractive' ? 'interactive-globe' : ''}`}
          style={{ cursor: 'default', position: 'relative' }}
        >
          <svg ref={svgRef} className="world-map-svg">
            <g ref={globeGroupRef}></g>
          </svg>
          {/* Fondo blanco con opacidad para la info de bandera + texto, posicionado sobre el mapa */}
          {currentCountry && (() => {
            const countryCodeMap: Record<string, string> = {
              'Argentina': 'ar', 'USA': 'us', 'Canada': 'ca', 'Netherlands': 'nl', 'Australia': 'au', 'Brazil': 'br', 'United Kingdom': 'gb', 'France': 'fr', 'Germany': 'de', 'Spain': 'es', 'Italy': 'it', 'Russia': 'ru', 'China': 'cn', 'India': 'in', 'Japan': 'jp', 'South Africa': 'za', 'Mexico': 'mx', 'Belgium': 'be', 'Switzerland': 'ch', 'Austria': 'at', 'Portugal': 'pt', 'Poland': 'pl', 'Czech Republic': 'cz', 'Hungary': 'hu', 'Romania': 'ro', 'Bulgaria': 'bg', 'Croatia': 'hr', 'Slovenia': 'si', 'Slovakia': 'sk', 'Estonia': 'ee', 'Latvia': 'lv', 'Lithuania': 'lt', 'Finland': 'fi', 'Denmark': 'dk', 'Iceland': 'is', 'Ireland': 'ie', 'Greece': 'gr', 'Turkey': 'tr', 'Israel': 'il', 'Singapore': 'sg', 'South Korea': 'kr', 'Thailand': 'th', 'Malaysia': 'my', 'Indonesia': 'id', 'Philippines': 'ph', 'Vietnam': 'vn', 'New Zealand': 'nz', 'Chile': 'cl',
            };
            const countryCode = countryCodeMap[currentCountry];
            let count = countryData[currentCountry] || 0;
            let percentage = '0.0';
            if (mapResources && Array.isArray(mapResources)) {
              const code = Object.keys(codeToName).find(key => codeToName[key] === currentCountry) || '';
              const mr = mapResources.find((m: any) => (m.server_pais_code || '').toUpperCase() === code);
              if (mr && mr.share !== undefined) {
                percentage = String(mr.share);
              } else {
                const totalServers = normalizedData?.length || 0;
                percentage = totalServers > 0 ? ((count / totalServers) * 100).toFixed(1) : '0.0';
              }
            } else {
              const totalServers = normalizedData?.length || 0;
              percentage = totalServers > 0 ? ((count / totalServers) * 100).toFixed(1) : '0.0';
            }
            return (
              <div className="info-group" style={{ position: 'absolute', left: '50%', bottom: 30, transform: 'translateX(-50%)', zIndex: 2 }}>
                {countryCode && (
                  <img src={`https://flagcdn.com/24x18/${countryCode}.png`} alt={currentCountry} style={{ marginRight: 8, width: 18, height: 14, verticalAlign: 'middle' }} />
                )}
                <span>Found servers: {count} - {percentage}%</span>
              </div>
            );
          })()}
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