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

export const ServerGeolocationMap: FC<ServerGeolocationMapProps> = ({ 
  networkData, 
  resourceType = RESOURCE_CLASS.NETWORK, 
  title = "Server Geolocation Distribution" 
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [worldData, setWorldData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });
  const [locationMetrics, setLocationMetrics] = useState<any[]>([]);
  const [selectedProjection, setSelectedProjection] = useState('orthographicInteractive');
  const [rotation, setRotation] = useState<[number, number]>([0, 0]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<[number, number] | null>(null);
  const [autoRotateIndex, setAutoRotateIndex] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [userHasInteracted, setUserHasInteracted] = useState(false);
  const [resumeTimeoutId, setResumeTimeoutId] = useState<NodeJS.Timeout | null>(null);

  // Process data to count servers by country
  const countryData = useMemo(() => {
    const counts: Record<string, number> = {};
    
    console.log('=== DEBUG: Procesando datos de países ===');
    
    networkData.forEach((device, index) => {
      // Usar el nombre completo del país en lugar del código
      let countryName = device.server_pais?.trim();
      
      // Log de los primeros 10 dispositivos para ver la estructura
      if (index < 10) {
        console.log(`Dispositivo ${index}:`, {
          server_pais: device.server_pais,
          server_pais_code: device.server_pais_code,
          countryName_procesado: countryName
        });
      }
      
      // Normalizar nombres de países para que coincidan con el GeoJSON
      const nameMapping: Record<string, string> = {
        'United States': 'USA',
        'US': 'USA',
        'Netherlands': 'Netherlands',
        'Holland': 'Netherlands',
        'Australia': 'Australia',
        'Canada': 'Canada',
        'Argentina': 'Argentina',
        'Brazil': 'Brazil',
        'Brasil': 'Brazil',
        'United Kingdom': 'United Kingdom',
        'UK': 'United Kingdom',
        'Great Britain': 'United Kingdom'
      };
      
      // Intentar mapear el nombre
      if (countryName && nameMapping[countryName]) {
        countryName = nameMapping[countryName];
      }
      
      if (countryName && countryName !== 'unknown') {
        counts[countryName] = (counts[countryName] || 0) + 1;
      }
    });
    
    console.log('=== DEBUG: Conteos finales por país (usando nombres) ===');
    console.log(counts);
    
    return counts;
  }, [networkData]);

  // Get max count for color scaling
  const maxCount = useMemo(() => {
    return Math.max(...Object.values(countryData), 1);
  }, [countryData]);

  // Create ranking-based color mapping
  const countryRanking = useMemo(() => {
    // Get all countries with their counts, sorted by count (descending)
    const sortedCountries = Object.entries(countryData)
      .filter(([_, count]) => count > 0)
      .sort(([, a], [, b]) => b - a);
    
    // Create ranking map
    const ranking: Record<string, number> = {};
    sortedCountries.forEach(([countryName], index) => {
      ranking[countryName] = index + 1; // 1-based ranking
    });
    
    return ranking;
  }, [countryData]);

  // Get sorted countries with servers for auto-rotation
  const countriesWithServers = useMemo(() => {
    return Object.entries(countryData)
      .filter(([_, count]) => count > 0)
      .sort(([_, a], [__, b]) => b - a)
      .map(([countryName, count]) => ({ name: countryName, count }));
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
    'New Zealand': [174.0, -41.0]
  };

  // Function to lighten color by percentage
  const lightenColor = (color: string, percentage: number) => {
    const rgb = d3.rgb(color);
    const factor = 1 + (percentage / 100);
    return d3.rgb(
      Math.min(255, rgb.r * factor),
      Math.min(255, rgb.g * factor),
      Math.min(255, rgb.b * factor)
    ).toString();
  };

  // ============================================
  // 🎨 COLORES DEL MAPA 2D - EDITAR AQUÍ
  // ============================================
  // Get color for a country based on its ranking
  const getCountryColor = (countryName: string) => {
    const count = countryData[countryName] || 0;
    
    if (count === 0) {
      return '#eee'; // 🔹 COLOR: Países sin datos (gris muy claro)
    }
    
    const rank = countryRanking[countryName];
    if (!rank) return '#eee';
    
    const baseColor = '#ff3939'; // 🔹 COLOR: País #1 con más servidores (rojo base)
    const lightenPercentage = (rank - 1) * 60; // 🔹 DISTANCIA: 0%, 20%, 40%, 60%, etc.
    
    return lightenColor(baseColor, lightenPercentage);
  };
  // ============================================

  // Function to smoothly interpolate between two rotation positions
  const smoothRotateTo = (targetCoords: [number, number], duration: number = 2000) => {
    if (isTransitioning) return; // Prevent overlapping transitions
    
    setIsTransitioning(true);
    const startRotation = rotation;
    const targetRotation: [number, number] = [-targetCoords[0], -targetCoords[1]];
    
    // Calculate the shortest path for longitude (handle wrapping around 180/-180)
    let deltaLon = targetRotation[0] - startRotation[0];
    if (deltaLon > 180) deltaLon -= 360;
    if (deltaLon < -180) deltaLon += 360;
    
    const deltaLat = targetRotation[1] - startRotation[1];
    
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Use easeInOutCubic for smooth animation
      const easeProgress = progress < 0.5 
        ? 4 * progress * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      
      const currentLon = startRotation[0] + deltaLon * easeProgress;
      const currentLat = startRotation[1] + deltaLat * easeProgress;
      
      setRotation([currentLon, currentLat]);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsTransitioning(false);
      }
    };
    
    requestAnimationFrame(animate);
  };

  // Calculate location metrics for the table
  useEffect(() => {
    // Safety check: ensure networkData exists and is an array
    if (!networkData || !Array.isArray(networkData)) {
      setLocationMetrics([]);
      return;
    }
    
    const metrics = MetricsService.getCountryMetrics(networkData, resourceType);
    
    // Transform data to match table structure - flatten the objects
    const transformedMetrics = metrics.map((metric: any) => ({
      location: metric, // This contains the full object for the LocationItem component
      count: metric.count, // Direct access for sorting
      percentage: metric.percentage, // Direct access for sorting
      country: metric.country, // Keep for LocationItem
      countryCode: metric.countryCode, // Keep for LocationItem
    }));
    
    setLocationMetrics(transformedMetrics);
  }, [networkData, resourceType]);

  // Load world topology data
  useEffect(() => {
    const loadWorldData = async () => {
      try {
        // Use Natural Earth data for complete world coverage
        const response = await fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson');
        const geoData = await response.json();
        
        // DEBUG: Log algunos países del GeoJSON para ver la estructura
        console.log('=== DEBUG: Estructura del GeoJSON ===');
        console.log('Primeros 5 países en GeoJSON:');
        geoData.features.slice(0, 5).forEach((feature: any, index: number) => {
          console.log(`País ${index}:`, {
            NAME: feature.properties.NAME,
            ISO_A2: feature.properties.ISO_A2,
            ISO_A3: feature.properties.ISO_A3,
            name: feature.properties.name,
            iso_a2: feature.properties.iso_a2
          });
        });
        
        // Buscar específicamente Estados Unidos y otros países importantes
        const usFeature = geoData.features.find((f: any) => 
          f.properties.name?.includes('United States') ||
          f.properties.name?.includes('USA') ||
          f.properties.name?.includes('America')
        );
        console.log('=== DEBUG: Estados Unidos encontrado ===');
        console.log('Nombre exacto:', usFeature?.properties.name);
        console.log('Propiedades completas:', usFeature?.properties);
        
        const arFeature = geoData.features.find((f: any) => 
          f.properties.NAME?.includes('Argentina') ||
          f.properties.name?.includes('Argentina')
        );
        console.log('=== DEBUG: Argentina encontrada ===');
        console.log(arFeature?.properties);
        
        const caFeature = geoData.features.find((f: any) => 
          f.properties.NAME?.includes('Canada') ||
          f.properties.name?.includes('Canada')
        );
        console.log('=== DEBUG: Canadá encontrado ===');
        console.log(caFeature?.properties);
        
        setWorldData(geoData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading world data:', error);
        // Fallback to the previous source
        try {
          const fallbackResponse = await fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json');
          const fallbackData = await fallbackResponse.json();
          setWorldData(fallbackData);
          setIsLoading(false);
        } catch (fallbackError) {
          console.error('Fallback also failed:', fallbackError);
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
      const radius = baseRadius * 1.8; // Make globe 80% larger so it overflows the container
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
        .attr('stop-color', '#ffffff') // 🔹 COLOR: Centro del océano (blanco)
        .attr('stop-opacity', 1);
      
      sphereGradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', '#f8f9fa') // 🔹 COLOR: Bordes del océano (gris muy claro)
        .attr('stop-opacity', 1);

      // Add sphere background
      const baseRadius = Math.min(width, height) / 2;
      const radius = baseRadius * 1.8; // Match the projection scale
      svg.append('circle')
        .attr('cx', width / 2)
        .attr('cy', height / 2)
        .attr('r', radius)
        .attr('fill', 'url(#sphere-gradient)')
        .attr('stroke', '#e5e7eb') // 🔹 COLOR: Borde del globo (gris claro)
        .attr('stroke-width', 1);
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
      // 🎨 BORDES DE PAÍSES - EDITAR AQUÍ
      // ============================================
      .attr('stroke', '#ccc') // 🔹 COLOR: Bordes de países (blanco)
      .attr('stroke-width', 0.2) // 🔹 GROSOR: Bordes de países (0.5px)
      // ============================================
      .on('mouseover', function(event, d: any) {
        d3.select(this).attr('stroke-width', 0.5); // 🔹 GROSOR al hacer hover (1px)
      })
      .on('mouseout', function(event, d: any) {
        d3.select(this).attr('stroke-width', 0.5); // 🔹 GROSOR normal (0.5px)
      })
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

    // Add graticules (grid lines) for better visual reference
    const graticule = d3.geoGraticule()
      .step(selectedProjection === 'orthographicInteractive' ? [15, 15] : [30, 30]);

    svg.append('path')
      .datum(graticule)
      .attr('class', 'graticule')
      .attr('d', path as any)
      .attr('fill', 'none')
      .attr('stroke', selectedProjection === 'orthographicInteractive' ? '#ffffff' : '#e0e0e0')
      .attr('stroke-width', selectedProjection === 'orthographicInteractive' ? 0.3 : 0.5)
      .attr('opacity', selectedProjection === 'orthographicInteractive' ? 0.3 : 0.3);

  }, [worldData, countryData, maxCount, isLoading, dimensions, selectedProjection, rotation, countryRanking]);

  // Auto-rotation effect for 3D globe
  useEffect(() => {
    if (selectedProjection !== 'orthographicInteractive' || countriesWithServers.length === 0) {
      return;
    }

    // Initialize position to first country (highest servers)
    if (!isAutoRotating && countriesWithServers.length > 0) {
      const firstCountry = countriesWithServers[0];
      const coords = countryCoordinates[firstCountry.name];
      if (coords) {
        // Start with a smooth transition to the first country
        setTimeout(() => {
          smoothRotateTo(coords, 1500); // Initial smooth transition
          setIsAutoRotating(true);
        }, 500); // Small delay to ensure everything is loaded
      }
    }

    // Set up auto-rotation timer - only if auto-rotation is active and user hasn't interacted
    if (!isAutoRotating || userHasInteracted) {
      return;
    }

    const interval = setInterval(() => {
      if (isDragging || isTransitioning || userHasInteracted) return; // Don't auto-rotate while user is dragging, transitioning, or has interacted

      setAutoRotateIndex(prevIndex => {
        const nextIndex = (prevIndex + 1) % countriesWithServers.length;
        const nextCountry = countriesWithServers[nextIndex];
        const coords = countryCoordinates[nextCountry.name];
        
        if (coords) {
          // Smooth transition to next country
          smoothRotateTo(coords, 2000); // 2 second smooth transition
        }
        
        return nextIndex;
      });
    }, 4000); // Change every 4 seconds (2s transition + 2s pause)

    return () => clearInterval(interval);
  }, [selectedProjection, countriesWithServers, isDragging, isAutoRotating, isTransitioning, userHasInteracted, countryCoordinates, rotation]);

  // Reset auto-rotation when switching to 3D globe
  useEffect(() => {
    if (selectedProjection === 'orthographicInteractive') {
      setAutoRotateIndex(0);
      setIsAutoRotating(false);
      setUserHasInteracted(false);
      
      // Clear any existing resume timeout
      if (resumeTimeoutId) {
        clearTimeout(resumeTimeoutId);
        setResumeTimeoutId(null);
      }
    } else {
      // Clear timeout when switching away from 3D
      if (resumeTimeoutId) {
        clearTimeout(resumeTimeoutId);
        setResumeTimeoutId(null);
      }
    }
  }, [selectedProjection, resumeTimeoutId]);

  // Mouse event handlers for rotation (only used with interactive 3D globe)
  const handleMouseDown = (event: React.MouseEvent) => {
    if (selectedProjection !== 'orthographicInteractive') return;
    setIsDragging(true);
    setDragStart([event.clientX, event.clientY]);
    setIsAutoRotating(false); // Pause auto-rotation when user starts dragging
    setIsTransitioning(false); // Stop any ongoing transition
    setUserHasInteracted(true); // Mark that user has interacted
    
    // Clear any existing resume timeout
    if (resumeTimeoutId) {
      clearTimeout(resumeTimeoutId);
      setResumeTimeoutId(null);
    }
    
    event.preventDefault();
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isDragging || !dragStart || selectedProjection !== 'orthographicInteractive') return;

    const sensitivity = 0.5;
    const deltaX = (event.clientX - dragStart[0]) * sensitivity;
    const deltaY = (event.clientY - dragStart[1]) * sensitivity;

    setRotation(([lambda, phi]) => [
      lambda + deltaX, // Drag left = rotate left, drag right = rotate right
      phi - deltaY     // Drag up = rotate up, drag down = rotate down
    ]);

    setDragStart([event.clientX, event.clientY]);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragStart(null);
    
    // Clear any existing resume timeout
    if (resumeTimeoutId) {
      clearTimeout(resumeTimeoutId);
    }
    
    // Resume auto-rotation after 5 seconds of no interaction
    const timeoutId = setTimeout(() => {
      if (selectedProjection === 'orthographicInteractive') {
        setUserHasInteracted(false);
        setIsAutoRotating(true);
        setResumeTimeoutId(null);
      }
    }, 5000);
    
    setResumeTimeoutId(timeoutId);
  };

  // Add global mouse up listener for dragging
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        handleMouseUp(); // Use the same logic as the regular mouse up
      }
    };

    if (isDragging) {
      document.addEventListener('mouseup', handleGlobalMouseUp);
      document.addEventListener('mouseleave', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('mouseleave', handleGlobalMouseUp);
    };
  }, [isDragging, resumeTimeoutId]);

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
        <span className="server-count">{networkData?.length || 0} servidores</span>
      </div>
      <div className="content" ref={containerRef}>
        <div 
          className={`map-container ${selectedProjection === 'orthographicInteractive' ? 'interactive-globe' : ''}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          style={{ 
            cursor: selectedProjection === 'orthographicInteractive' 
              ? (isDragging ? 'grabbing' : 'grab') 
              : 'default' 
          }}
        >
          <svg ref={svgRef} className="world-map-svg"></svg>
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