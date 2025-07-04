import { type FC, useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import type { Device } from '@interfaces/panel.ts';
import './NetworkVisualization.scss';

// ==============================================
// 🎨 CONFIGURACIÓN VISUAL DEL MAPA MUNDIAL
// ==============================================
/*
  INSTRUCCIONES PARA EXPERIMENTAR:
  
  1. Para cambiar colores de países:
     - MAP_COLORS.COUNTRIES_WITH_SERVERS: Color de países con servidores
     - MAP_COLORS.COUNTRIES_WITHOUT_SERVERS: Color de países sin servidores
  
  2. Para modificar círculos de ciudades:
     - CITY_CIRCLES.FILL_COLOR: Color interior del círculo
     - CITY_CIRCLES.STROKE_COLOR: Color del borde del círculo
     - CITY_CIRCLES.MIN_RADIUS / MAX_RADIUS: Tamaño mín/máx de círculos
  
  3. Para cambiar proyección del mapa:
     - MAP_PROJECTION.PROJECTION_TYPE: Cambia el tipo de proyección
     - MAP_PROJECTION.SCALE_FACTOR: Ajusta el zoom inicial
  
  4. Para modificar efectos visuales:
     - CITY_CIRCLES.DROP_SHADOW: Sombra de los círculos
     - CITY_CIRCLES.HOVER_SCALE: Cuánto crece en hover
     - CITY_CIRCLES.ANIMATION_DURATION: Velocidad de animaciones
  
  5. Ejemplos de proyecciones:
     - 'geoNaturalEarth1': Proyección natural (actual)
     - 'geoMercator': Proyección Mercator clásica
     - 'geoOrthographic': Proyección esférica 3D
     - 'geoEquirectangular': Proyección rectangular

  6. VALORES ALTERNATIVOS PARA PROBAR:
  
     🔴 Esquema de colores AZUL:
     COUNTRIES_WITH_SERVERS: '#2563eb'
     CITY_CIRCLES.STROKE_COLOR: '#2563eb'
     
     🟢 Esquema de colores VERDE:
     COUNTRIES_WITH_SERVERS: '#16a34a'
     CITY_CIRCLES.STROKE_COLOR: '#16a34a'
     
     🟣 Esquema de colores PÚRPURA:
     COUNTRIES_WITH_SERVERS: '#9333ea'
     CITY_CIRCLES.STROKE_COLOR: '#9333ea'
     
     🌊 Fondo océano oscuro:
     BACKGROUND_COLORS.OCEAN_COLOR: '#0f172a'
     BACKGROUND_COLORS.MAP_BACKGROUND: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
     
     ⚫ Círculos negros elegantes:
     CITY_CIRCLES.FILL_COLOR: '#000000'
     CITY_CIRCLES.STROKE_COLOR: '#ffffff'
     
     🔥 Círculos grandes y llamativos:
     CITY_CIRCLES.MIN_RADIUS: 8
     CITY_CIRCLES.MAX_RADIUS: 20
     CITY_CIRCLES.RADIUS_MULTIPLIER: 2.5
     
     💫 Animaciones más lentas y suaves:
     CITY_CIRCLES.ANIMATION_DURATION: 500
     CITY_CIRCLES.HOVER_SCALE: 1.5
*/

// 🌍 COLORES DE PAÍSES
const MAP_COLORS = {
  // Color de países con servidores (rojo principal)
  COUNTRIES_WITH_SERVERS: '#dc2626',
  // Color de países sin servidores (gris claro)
  COUNTRIES_WITHOUT_SERVERS: '#eee',
  // Opacidad de países con servidores (0.0 - 1.0)
  COUNTRIES_WITH_SERVERS_OPACITY: 0.8,
  // Opacidad de países sin servidores (0.0 - 1.0)
  COUNTRIES_WITHOUT_SERVERS_OPACITY: 1.0,
};

// 🌊 COLORES DE FONDO Y AGUA
const BACKGROUND_COLORS = {
  // Color de fondo del océano/agua
  OCEAN_COLOR: '#f0f9ff',
  // Color de fondo del contenedor del mapa
  MAP_BACKGROUND: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
};

// 🗺️ COLORES DE BORDES Y LÍNEAS
const BORDER_COLORS = {
  // Color de los bordes de países (meridianos/fronteras)
  COUNTRY_BORDERS: '#dee2e6',
  // Grosor de los bordes de países
  COUNTRY_BORDER_WIDTH: 0.5,
  // Color de bordes cuando se hace hover
  COUNTRY_BORDERS_HOVER: '#9ca3af',
  // Grosor de bordes cuando se hace hover
  COUNTRY_BORDER_HOVER_WIDTH: 1,
};

// ⚪ CONFIGURACIÓN DE CÍRCULOS DE CIUDADES
const CITY_CIRCLES = {
  // Color de relleno de los círculos de ciudad
  FILL_COLOR: '#ff393933',
  // Color del borde de los círculos de ciudad
  STROKE_COLOR: '#dc2626',
  // Grosor del borde de los círculos
  STROKE_WIDTH: 0.2,
  // Radio mínimo de los círculos
  MIN_RADIUS: 6,
  // Radio máximo de los círculos
  MAX_RADIUS: 12,
  // Factor de multiplicación por servidor (radio base + servidores * factor)
  RADIUS_MULTIPLIER: 1.5,
  // Factor de escala en hover (1.0 = sin cambio, 1.3 = 30% más grande)
  HOVER_SCALE: 1.3,
  // Duración de la animación en milisegundos
  ANIMATION_DURATION: 200,
  // Sombra de los círculos (CSS filter)
  DROP_SHADOW: 'drop-shadow(0 2px 4px rgba(220, 38, 38, 0.3))',
  // Sombra en hover
  DROP_SHADOW_HOVER: 'drop-shadow(0 4px 8px rgba(220, 38, 38, 0.5))',
};

// 🗺️ CONFIGURACIÓN DE LA PROYECCIÓN DEL MAPA
const MAP_PROJECTION = {
  // Factor de escala del mapa (más alto = más zoom)
  SCALE_FACTOR: 0.6, // Reducido aún más para vista más amplia
  // Tipo de proyección (puedes cambiar por geoMercator, geoOrthographic, etc.)
  PROJECTION_TYPE: 'geoNaturalEarth1', // Opciones: geoNaturalEarth1, geoMercator, geoOrthographic, geoEquirectangular
};

// 📱 CONFIGURACIÓN DE ZOOM
const ZOOM_CONFIG = {
  // Zoom mínimo permitido
  MIN_SCALE: 0.3,
  // Zoom máximo permitido
  MAX_SCALE: 8,
};

// 🎯 CONFIGURACIÓN DE TOOLTIPS
const TOOLTIP_CONFIG = {
  // Color de fondo del tooltip
  BACKGROUND_COLOR: 'rgba(0, 0, 0, 0.8)',
  // Color del texto del tooltip
  TEXT_COLOR: '#ffffff',
  // Tamaño de fuente del tooltip
  FONT_SIZE: '12px',
};

// 📊 CONFIGURACIÓN DEL PANEL DE DETALLES
const DETAILS_PANEL = {
  // Color de fondo del panel (con transparencia)
  BACKGROUND_COLOR: 'rgba(255, 255, 255, 0.8)',
  // Color del borde del panel
  BORDER_COLOR: '#e5e7eb',
  // Radio de bordes redondeados
  BORDER_RADIUS: '8px',
  // Ancho del panel
  WIDTH: '440px',
  // Sombra del panel
  BOX_SHADOW: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
};

// ==============================================
// 📍 DATOS DE COORDENADAS Y MAPEO
// ==============================================

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

interface WorldMapViewProps {
  networkData: NetworkDevice[];
  width?: number;
  height?: number;
  title?: string;
}

// Mapeo de países a códigos ISO para banderas
const countryCodeMap: Record<string, string> = {
  Argentina: 'ar',
  USA: 'us',
  'United States': 'us',
  Canada: 'ca',
  Netherlands: 'nl',
  Australia: 'au',
  Brazil: 'br',
  'United Kingdom': 'gb',
  France: 'fr',
  Germany: 'de',
  Spain: 'es',
  Italy: 'it',
  Russia: 'ru',
  China: 'cn',
  India: 'in',
  Japan: 'jp',
  'South Africa': 'za',
  Mexico: 'mx',
  Belgium: 'be',
  Switzerland: 'ch',
  Austria: 'at',
  Portugal: 'pt',
  Poland: 'pl',
  'Czech Republic': 'cz',
  Hungary: 'hu',
  Romania: 'ro',
  Bulgaria: 'bg',
  Croatia: 'hr',
  Slovenia: 'si',
  Slovakia: 'sk',
  Estonia: 'ee',
  Latvia: 'lv',
  Lithuania: 'lt',
  Finland: 'fi',
  Denmark: 'dk',
  Iceland: 'is',
  Ireland: 'ie',
  Greece: 'gr',
  Turkey: 'tr',
  Israel: 'il',
  Singapore: 'sg',
  'South Korea': 'kr',
  Thailand: 'th',
  Malaysia: 'my',
  Indonesia: 'id',
  Philippines: 'ph',
  Vietnam: 'vn',
  'New Zealand': 'nz',
  Chile: 'cl',
};

// Coordenadas geográficas para países (longitud, latitud)
const countryCoordinates: Record<string, [number, number]> = {
  Argentina: [-64.0, -34.0],
  USA: [-95.0, 39.0],
  'United States': [-95.0, 39.0],
  Canada: [-106.0, 60.0],
  Netherlands: [5.75, 52.5],
  Australia: [133.0, -27.0],
  Brazil: [-55.0, -10.0],
  'United Kingdom': [-2.0, 54.0],
  France: [2.0, 46.0],
  Germany: [9.0, 51.0],
  Spain: [-4.0, 40.0],
  Italy: [12.0, 42.0],
  Russia: [105.0, 61.0],
  China: [104.0, 35.0],
  India: [78.0, 20.0],
  Japan: [138.0, 36.0],
  'South Africa': [22.0, -31.0],
  Mexico: [-102.0, 23.0],
  Belgium: [4.5, 50.8],
  Switzerland: [8.2, 46.8],
  Austria: [14.5, 47.5],
  Portugal: [-8.0, 39.5],
  Poland: [19.0, 52.0],
  'Czech Republic': [15.5, 49.75],
  Hungary: [20.0, 47.0],
  Romania: [25.0, 46.0],
  Bulgaria: [25.0, 43.0],
  Croatia: [15.5, 45.0],
  Slovenia: [14.5, 46.0],
  Slovakia: [19.5, 48.7],
  Estonia: [26.0, 59.0],
  Latvia: [25.0, 57.0],
  Lithuania: [24.0, 56.0],
  Finland: [26.0, 64.0],
  Denmark: [10.0, 56.0],
  Iceland: [-18.0, 65.0],
  Ireland: [-8.0, 53.0],
  Greece: [22.0, 39.0],
  Turkey: [35.0, 39.0],
  Israel: [34.8, 31.0],
  Singapore: [103.8, 1.3],
  'South Korea': [128.0, 36.0],
  Thailand: [100.0, 15.0],
  Malaysia: [112.0, 2.5],
  Indonesia: [113.0, -0.8],
  Philippines: [122.0, 13.0],
  Vietnam: [108.0, 14.0],
  'New Zealand': [174.0, -41.0],
  Chile: [-71.0, -30.0],
};

// Coordenadas específicas de ciudades por país
const cityCoordinates: Record<string, Record<string, [number, number]>> = {
  'United States': {
    'New York': [-74.0, 40.7],
    'Los Angeles': [-118.2, 34.1],
    Chicago: [-87.6, 41.9],
    Houston: [-95.4, 29.8],
    Phoenix: [-112.1, 33.4],
    Philadelphia: [-75.2, 39.9],
    'San Antonio': [-98.5, 29.4],
    'San Diego': [-117.2, 32.7],
    Dallas: [-96.8, 32.8],
    'San Jose': [-121.9, 37.3],
    Austin: [-97.7, 30.3],
    Jacksonville: [-81.7, 30.3],
    'San Francisco': [-122.4, 37.8],
    Columbus: [-83.0, 39.9],
    Charlotte: [-80.8, 35.2],
    'Fort Worth': [-97.3, 32.8],
    Indianapolis: [-86.1, 39.8],
    Seattle: [-122.3, 47.6],
    Denver: [-105.0, 39.7],
    Washington: [-77.0, 38.9],
    Boston: [-71.1, 42.4],
    'El Paso': [-106.4, 31.8],
    Nashville: [-86.8, 36.2],
    Detroit: [-83.0, 42.3],
    'Oklahoma City': [-97.5, 35.5],
    Portland: [-122.7, 45.5],
    'Las Vegas': [-115.1, 36.2],
    Memphis: [-90.0, 35.1],
    Louisville: [-85.8, 38.2],
    Baltimore: [-76.6, 39.3],
    Milwaukee: [-87.9, 43.0],
    Albuquerque: [-106.7, 35.1],
    Tucson: [-110.9, 32.2],
    Fresno: [-119.8, 36.7],
    Sacramento: [-121.5, 38.6],
    Mesa: [-111.8, 33.4],
    'Kansas City': [-94.6, 39.1],
    Atlanta: [-84.4, 33.8],
    'Long Beach': [-118.2, 33.8],
    'Colorado Springs': [-104.8, 38.8],
    Raleigh: [-78.6, 35.8],
    Miami: [-80.2, 25.8],
    'Virginia Beach': [-76.0, 36.8],
    Omaha: [-96.0, 41.3],
    Oakland: [-122.3, 37.8],
    Minneapolis: [-93.3, 44.9],
    Tulsa: [-95.9, 36.2],
    Arlington: [-97.1, 32.7],
    Tampa: [-82.5, 27.9],
    'New Orleans': [-90.1, 30.0],
    Wichita: [-97.3, 37.7],
    Cleveland: [-81.7, 41.5],
    Bakersfield: [-119.0, 35.4],
    Aurora: [-104.8, 39.7],
    Anaheim: [-117.9, 33.8],
    Honolulu: [-157.8, 21.3],
    'Santa Ana': [-117.9, 33.7],
    'Corpus Christi': [-97.4, 27.8],
    Riverside: [-117.4, 33.9],
    Lexington: [-84.5, 38.0],
    Stockton: [-121.3, 37.9],
    Henderson: [-115.0, 36.0],
    'Saint Paul': [-93.1, 44.9],
    'St. Louis': [-90.2, 38.6],
    Cincinnati: [-84.5, 39.1],
    Pittsburgh: [-80.0, 40.4],
  },
  Canada: {
    Toronto: [-79.4, 43.7],
    Montreal: [-73.6, 45.5],
    Vancouver: [-123.1, 49.3],
    Calgary: [-114.1, 51.0],
    Edmonton: [-113.5, 53.5],
    Ottawa: [-75.7, 45.4],
    Mississauga: [-79.6, 43.6],
    Winnipeg: [-97.1, 49.9],
    'Quebec City': [-71.2, 46.8],
    Hamilton: [-79.9, 43.3],
  },
  'United Kingdom': {
    London: [-0.1, 51.5],
    Birmingham: [-1.9, 52.5],
    Manchester: [-2.2, 53.5],
    Glasgow: [-4.3, 55.9],
    Liverpool: [-3.0, 53.4],
    Leeds: [-1.5, 53.8],
    Sheffield: [-1.5, 53.4],
    Edinburgh: [-3.2, 55.9],
    Bristol: [-2.6, 51.5],
    Cardiff: [-3.2, 51.5],
  },
  Australia: {
    Sydney: [151.2, -33.9],
    Melbourne: [144.9, -37.8],
    Brisbane: [153.0, -27.5],
    Perth: [115.9, -31.9],
    Adelaide: [138.6, -34.9],
    'Gold Coast': [153.4, -28.0],
    Newcastle: [151.8, -32.9],
    Canberra: [149.1, -35.3],
    Wollongong: [150.9, -34.4],
    'Logan City': [153.1, -27.6],
  },
  Germany: {
    Berlin: [13.4, 52.5],
    Hamburg: [9.9, 53.6],
    Munich: [11.6, 48.1],
    Cologne: [6.9, 50.9],
    Frankfurt: [8.7, 50.1],
    Stuttgart: [9.2, 48.8],
    Düsseldorf: [6.8, 51.2],
    Dortmund: [7.5, 51.5],
    Essen: [7.0, 51.5],
    Leipzig: [12.4, 51.3],
  },
  France: {
    Paris: [2.3, 48.9],
    Marseille: [5.4, 43.3],
    Lyon: [4.8, 45.8],
    Toulouse: [1.4, 43.6],
    Nice: [7.3, 43.7],
    Nantes: [-1.6, 47.2],
    Strasbourg: [7.7, 48.6],
    Montpellier: [3.9, 43.6],
    Bordeaux: [-0.6, 44.8],
    Lille: [3.1, 50.6],
  },
  Spain: {
    Madrid: [-3.7, 40.4],
    Barcelona: [2.2, 41.4],
    Valencia: [-0.4, 39.5],
    Seville: [-5.9, 37.4],
    Zaragoza: [-0.9, 41.7],
    Málaga: [-4.4, 36.7],
    Murcia: [-1.1, 37.9],
    Palma: [2.6, 39.6],
    'Las Palmas': [-15.4, 28.1],
    Bilbao: [-2.9, 43.3],
  },
  Brazil: {
    'São Paulo': [-46.6, -23.5],
    'Rio de Janeiro': [-43.2, -22.9],
    Brasília: [-47.9, -15.8],
    Salvador: [-38.5, -12.9],
    Fortaleza: [-38.5, -3.7],
    'Belo Horizonte': [-43.9, -19.9],
    Manaus: [-60.0, -3.1],
    Curitiba: [-49.3, -25.4],
    Recife: [-34.9, -8.0],
    'Porto Alegre': [-51.2, -30.0],
  },
  Argentina: {
    'Buenos Aires': [-58.4, -34.6],
    Córdoba: [-64.2, -31.4],
    Rosario: [-60.6, -32.9],
    Mendoza: [-68.8, -32.9],
    Tucumán: [-65.2, -26.8],
    'La Plata': [-57.9, -34.9],
    'Mar del Plata': [-57.6, -38.0],
    Salta: [-65.4, -24.8],
    'Santa Fe': [-60.7, -31.6],
    'San Juan': [-68.5, -31.5],
  },
  Netherlands: {
    Amsterdam: [4.9, 52.4],
    Rotterdam: [4.5, 51.9],
    'The Hague': [4.3, 52.1],
    Utrecht: [5.1, 52.1],
    Eindhoven: [5.5, 51.4],
    Tilburg: [5.1, 51.6],
    Groningen: [6.6, 53.2],
    Almere: [5.2, 52.4],
    Breda: [4.8, 51.6],
    Nijmegen: [5.9, 51.8],
  },
  Mexico: {
    'Mexico City': [-99.1, 19.4],
    Guadalajara: [-103.3, 20.7],
    Monterrey: [-100.3, 25.7],
    Puebla: [-98.2, 19.0],
    Tijuana: [-117.0, 32.5],
    León: [-101.7, 21.1],
    Juárez: [-106.5, 31.7],
    Zapopan: [-103.4, 20.7],
    Nezahualcóyotl: [-99.0, 19.4],
    Chihuahua: [-106.1, 28.6],
  },
};

// Mapeo de nombres de países en GeoJSON a nombres normalizados
const countryNameMapping: Record<string, string> = {
  'United States of America': 'United States',
  USA: 'United States',
  'United Kingdom': 'United Kingdom',
  Germany: 'Germany',
  France: 'France',
  Spain: 'Spain',
  Brazil: 'Brazil',
  Argentina: 'Argentina',
  Canada: 'Canada',
  Australia: 'Australia',
  Netherlands: 'Netherlands',
  Mexico: 'Mexico',
  Russia: 'Russia',
  China: 'China',
  India: 'India',
  Japan: 'Japan',
  'South Africa': 'South Africa',
};

interface ServerLocation {
  id: number;
  ip: string;
  country: string;
  countryCode: string;
  city: string;
  location: string;
  cityCoordinates?: [number, number];
  domains: string[];
  neuroscan_id?: string;
}

export const WorldMapView: FC<WorldMapViewProps> = ({
  networkData,
  width = 1000,
  height = 700,
  title = 'Global Server Locations',
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [worldData, setWorldData] = useState<any>(null);
  const [expandedServers, setExpandedServers] = useState<Set<string>>(new Set());

  // Function to toggle server expansion
  const toggleServerExpansion = (serverKey: string) => {
    const newExpanded = new Set(expandedServers);
    if (newExpanded.has(serverKey)) {
      newExpanded.delete(serverKey);
    } else {
      newExpanded.add(serverKey);
    }
    setExpandedServers(newExpanded);
  };

  // 🎨 Función para aplicar variables CSS dinámicamente
  const applyDynamicStyles = () => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.style.setProperty('--map-background', BACKGROUND_COLORS.MAP_BACKGROUND);
      root.style.setProperty('--ocean-color', BACKGROUND_COLORS.OCEAN_COLOR);
      root.style.setProperty('--countries-with-servers', MAP_COLORS.COUNTRIES_WITH_SERVERS);
      root.style.setProperty('--countries-without-servers', MAP_COLORS.COUNTRIES_WITHOUT_SERVERS);
      root.style.setProperty('--city-fill-color', CITY_CIRCLES.FILL_COLOR);
      root.style.setProperty('--city-stroke-color', CITY_CIRCLES.STROKE_COLOR);
      root.style.setProperty('--details-panel-bg', DETAILS_PANEL.BACKGROUND_COLOR);
      root.style.setProperty('--details-panel-border', DETAILS_PANEL.BORDER_COLOR);
    }
  };

  // Aplicar estilos dinámicos al montar el componente
  useEffect(() => {
    applyDynamicStyles();
  }, []);

  // Load world data
  useEffect(() => {
    const loadWorldData = async () => {
      try {
        const response = await fetch(
          'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson'
        );
        const geoData = await response.json();
        setWorldData(geoData);
      } catch (error) {
        console.error('Error loading world data:', error);
      }
    };
    loadWorldData();
  }, []);

  // Process server locations for map view
  const serverLocations = useMemo(() => {
    return networkData.map(device => {
      const country = device.server_pais || 'Unknown';
      const city = device.server_pais_ciudad || 'Unknown';
      const ip = device.device_ex_address || device.device_in_address;

      let domains: string[] = [];
      try {
        domains = JSON.parse(device.all_found_domains || '[]');
      } catch {
        domains = [];
      }

      const location =
        [device.server_pais, device.server_pais_provincia, device.server_pais_ciudad]
          .filter(Boolean)
          .join(', ') || 'Unknown location';

      // Get city coordinates if available
      let serverCityCoords: [number, number] | undefined;
      if (country && city) {
        const countryKey = countryNameMapping[country] || country;
        serverCityCoords = cityCoordinates[countryKey]?.[city];
      }

      return {
        id: device.id,
        ip: ip || 'N/A',
        country,
        countryCode: device.server_pais_code || 'xx',
        city,
        location,
        cityCoordinates: serverCityCoords,
        domains,
        neuroscan_id: device.neuroscan_id,
      };
    });
  }, [networkData]);

  // Get countries with servers for coloring
  const countriesWithServers = useMemo(() => {
    const countries = new Set<string>();
    serverLocations.forEach(server => {
      const normalizedCountry = countryNameMapping[server.country] || server.country;
      countries.add(normalizedCountry);
    });
    return countries;
  }, [serverLocations]);

  // Group servers by city for point placement
  const cityGroups = useMemo(() => {
    const groups = new Map<string, any>();

    serverLocations.forEach(server => {
      const countryKey = countryNameMapping[server.country] || server.country;
      const cityKey = `${countryKey}-${server.city}`;

      // Get city coordinates
      const coordinates = cityCoordinates[countryKey]?.[server.city];

      if (coordinates) {
        if (!groups.has(cityKey)) {
          groups.set(cityKey, {
            country: server.country,
            countryCode: server.countryCode,
            city: server.city,
            coordinates,
            servers: [],
            location: server.location,
          });
        }
        groups.get(cityKey)!.servers.push(server);
      }
    });

    return Array.from(groups.values());
  }, [serverLocations]);

  // Find the city with the most servers for initial focus
  const cityWithMostServers = useMemo(() => {
    if (cityGroups.length === 0) return null;

    return cityGroups.reduce((max, current) =>
      current.servers.length > max.servers.length ? current : max
    );
  }, [cityGroups]);

  // Auto-open details panel for city with most servers
  useEffect(() => {
    if (cityWithMostServers && !selectedLocation) {
      setSelectedLocation(cityWithMostServers);
    }
  }, [cityWithMostServers, selectedLocation]);

  // Render world map with server locations
  useEffect(() => {
    if (!svgRef.current || !worldData || serverLocations.length === 0) {
      setIsLoading(false);
      return;
    }

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Set up dimensions
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const container = svg
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Set up projection - centered on the city with most servers
    const projection = d3.geoNaturalEarth1().scale(innerWidth / MAP_PROJECTION.SCALE_FACTOR);

    // Center on the city with most servers, or default center
    if (cityWithMostServers) {
      const [longitude, latitude] = cityWithMostServers.coordinates;
      // Adjust translation to center on the target city
      projection.translate([
        innerWidth / 2 - (longitude * (innerWidth / MAP_PROJECTION.SCALE_FACTOR)) / 360,
        innerHeight / 2 + (latitude * (innerWidth / MAP_PROJECTION.SCALE_FACTOR)) / 360,
      ]);
    } else {
      projection.translate([innerWidth / 2 - 50, innerHeight / 2 - 30]);
    }

    const path = d3.geoPath().projection(projection);

    // Set up zoom
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([ZOOM_CONFIG.MIN_SCALE, ZOOM_CONFIG.MAX_SCALE])
      .on('zoom', event => {
        container.attr(
          'transform',
          `translate(${margin.left + event.transform.x},${margin.top + event.transform.y}) scale(${event.transform.k})`
        );
      });

    svg.call(zoom);

    // Draw countries
    container
      .selectAll('path.country')
      .data(worldData.features)
      .enter()
      .append('path')
      .attr('class', 'country')
      .attr('d', path as any)
      .attr('fill', (d: any) => {
        const countryName = d.properties.NAME || d.properties.NAME_EN || d.properties.name;
        const normalizedCountry = countryNameMapping[countryName] || countryName;
        return countriesWithServers.has(normalizedCountry)
          ? MAP_COLORS.COUNTRIES_WITH_SERVERS
          : MAP_COLORS.COUNTRIES_WITHOUT_SERVERS;
      })
      .attr('stroke', BORDER_COLORS.COUNTRY_BORDERS)
      .attr('stroke-width', BORDER_COLORS.COUNTRY_BORDER_WIDTH)
      .style('opacity', (d: any) => {
        const countryName = d.properties.NAME || d.properties.NAME_EN || d.properties.name;
        const normalizedCountry = countryNameMapping[countryName] || countryName;
        return countriesWithServers.has(normalizedCountry)
          ? MAP_COLORS.COUNTRIES_WITH_SERVERS_OPACITY
          : MAP_COLORS.COUNTRIES_WITHOUT_SERVERS_OPACITY;
      })
      .on('mouseover', function () {
        d3.select(this)
          .attr('stroke', BORDER_COLORS.COUNTRY_BORDERS_HOVER)
          .attr('stroke-width', BORDER_COLORS.COUNTRY_BORDER_HOVER_WIDTH);
      })
      .on('mouseout', function () {
        d3.select(this)
          .attr('stroke', BORDER_COLORS.COUNTRY_BORDERS)
          .attr('stroke-width', BORDER_COLORS.COUNTRY_BORDER_WIDTH);
      });

    // Draw city points
    const cityPoints = container
      .selectAll('circle.city-point')
      .data(cityGroups)
      .enter()
      .append('circle')
      .attr('class', 'city-point')
      .attr('cx', d => projection(d.coordinates)![0])
      .attr('cy', d => projection(d.coordinates)![1])
      .attr('r', d =>
        Math.min(
          Math.max(
            CITY_CIRCLES.MIN_RADIUS - 2 + d.servers.length * CITY_CIRCLES.RADIUS_MULTIPLIER,
            CITY_CIRCLES.MIN_RADIUS
          ),
          CITY_CIRCLES.MAX_RADIUS
        )
      )
      .attr('fill', CITY_CIRCLES.FILL_COLOR)
      .attr('stroke', CITY_CIRCLES.STROKE_COLOR)
      .attr('stroke-width', CITY_CIRCLES.STROKE_WIDTH)
      .style('cursor', 'pointer')
      .style('filter', CITY_CIRCLES.DROP_SHADOW)
      .on('click', (event, d) => {
        setSelectedLocation(d);
      })
      .on('mouseover', function (event, d) {
        // console.log('Mouseover on city:', d.city, 'Current radius:', d3.select(this).attr('r'));
        const originalRadius = Math.min(
          Math.max(
            CITY_CIRCLES.MIN_RADIUS - 2 + d.servers.length * CITY_CIRCLES.RADIUS_MULTIPLIER,
            CITY_CIRCLES.MIN_RADIUS
          ),
          CITY_CIRCLES.MAX_RADIUS
        );
        const newRadius = originalRadius * CITY_CIRCLES.HOVER_SCALE;
        // console.log('Changing radius from', originalRadius, 'to', newRadius);

        d3.select(this)
          .style('filter', CITY_CIRCLES.DROP_SHADOW_HOVER)
          .transition()
          .duration(CITY_CIRCLES.ANIMATION_DURATION)
          .attr('r', newRadius);
      })
      .on('mouseout', function (event, d) {
        // console.log('Mouseout from city:', d.city);
        const originalRadius = Math.min(
          Math.max(
            CITY_CIRCLES.MIN_RADIUS - 2 + d.servers.length * CITY_CIRCLES.RADIUS_MULTIPLIER,
            CITY_CIRCLES.MIN_RADIUS
          ),
          CITY_CIRCLES.MAX_RADIUS
        );
        // console.log('Restoring radius to:', originalRadius);

        d3.select(this)
          .style('filter', CITY_CIRCLES.DROP_SHADOW)
          .transition()
          .duration(CITY_CIRCLES.ANIMATION_DURATION)
          .attr('r', originalRadius);
      });

    // Add tooltips for city points
    cityPoints
      .append('title')
      .text(
        d =>
          `${d.city}, ${d.country}: ${d.servers.length} servidor${d.servers.length !== 1 ? 'es' : ''}`
      );

    setIsLoading(false);
  }, [worldData, cityGroups, countriesWithServers, width, height]);

  if (isLoading && serverLocations.length === 0) {
    return (
      <div className="network-visualization-container">
        <div className="header">
          <h3>{title}</h3>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando mapa mundial...</p>
        </div>
      </div>
    );
  }

  if (serverLocations.length === 0) {
    return (
      <div className="network-visualization-container">
        <div className="header">
          <h3>{title}</h3>
        </div>
        <div className="empty-state">
          <p>No hay datos de ubicación de servidores disponibles</p>
        </div>
      </div>
    );
  }

  return (
    <div className="network-visualization-container">
      <div className="header">
        <h3>{title}</h3>
        <div className="legend">
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#dc2626' }}></div>
            <span>Countries with Servers</span>
          </div>
          <div className="legend-item">
            <div
              className="legend-color"
              style={{
                backgroundColor: '#ffffff',
                border: '2px solid #dc2626',
                borderRadius: '50%',
              }}></div>
            <span>Cities with Servers</span>
          </div>
          <div className="legend-item">
            <span>Dot size = number of servers</span>
          </div>
        </div>
      </div>

      <div className="visualization-content">
        <div className="network-canvas">
          <svg ref={svgRef}></svg>
        </div>

        {selectedLocation && (
          <div className="node-details">
            <button className="close-details" onClick={() => setSelectedLocation(null)}>
              ×
            </button>
            <h4>Server location</h4>

            <div className="server-node-info">
              <p className="location-info">
                <span
                  className={`flag flag-${(selectedLocation.countryCode || 'xx').toLowerCase()}`}></span>
                <span className="location-text">{selectedLocation.location}</span>
              </p>

              <div>
                <span className="servers-count-text">
                  {selectedLocation.servers.length} Servidores en {selectedLocation.city}:
                </span>
                <ul className="domains-list">
                  {selectedLocation.servers.map((server: any, index: number) => {
                    const serverKey = `${server.ip}-${index}`;
                    const isExpanded = expandedServers.has(serverKey);
                    const hasClickableDomains = server.domains.length > 0;

                    return (
                      <li key={index}>
                        <div
                          className={`server-row ${hasClickableDomains ? 'clickable' : ''}`}
                          onClick={() => hasClickableDomains && toggleServerExpansion(serverKey)}>
                          <span className="server-ip">🖥️ {server.ip}</span>
                          {server.neuroscan_id && (
                            <span className="neuroscan-id">(NS-{server.neuroscan_id})</span>
                          )}
                          {hasClickableDomains && (
                            <span className="domains-count">
                              📁 {server.domains.length} Domain
                              {server.domains.length !== 1 ? 's' : ''}
                            </span>
                          )}
                          {hasClickableDomains && (
                            <span className={`expand-arrow ${isExpanded ? 'expanded' : ''}`}>
                              ▶
                            </span>
                          )}
                        </div>

                        {isExpanded && hasClickableDomains && (
                          <ul className="expanded-domains">
                            {server.domains.map((domain: string, idx: number) => (
                              <li key={idx} className="domain-item">
                                {domain}
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
