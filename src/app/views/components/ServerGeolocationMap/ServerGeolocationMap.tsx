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
  const [selectedProjection, setSelectedProjection] = useState('naturalEarth1');
  const [rotation, setRotation] = useState<[number, number]>([0, 0]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<[number, number] | null>(null);

  // Process data to count servers by country
  const countryData = useMemo(() => {
    const counts: Record<string, number> = {};
    
    // Safety check: ensure networkData exists and is an array
    if (!networkData || !Array.isArray(networkData)) {
      return counts;
    }
    
    networkData.forEach((device) => {
      let countryCode = device.server_pais_code?.toLowerCase();
      
      // Normalize common variations
      const codeMapping: Record<string, string> = {
        'argentina': 'ar',
        'arg': 'ar',
        'united states': 'us',
        'usa': 'us',
        'us': 'us',
        'canada': 'ca',
        'can': 'ca',
        'brazil': 'br',
        'bra': 'br',
        'br': 'br'
      };
      
      // Try to normalize the code
      if (countryCode && codeMapping[countryCode]) {
        countryCode = codeMapping[countryCode];
      }
      
      // Also try to map from country name if code is missing
      if (!countryCode || countryCode === 'unknown') {
        const countryName = device.server_pais?.toLowerCase();
        if (countryName && codeMapping[countryName]) {
          countryCode = codeMapping[countryName];
        }
      }
      
      if (countryCode && countryCode !== 'unknown') {
        counts[countryCode] = (counts[countryCode] || 0) + 1;
      }
    });
    
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
    sortedCountries.forEach(([countryCode], index) => {
      ranking[countryCode] = index + 1; // 1-based ranking
    });
    
    return ranking;
  }, [countryData]);

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

  // Get color for a country based on its ranking
  const getCountryColor = (countryCode: string) => {
    const count = countryData[countryCode] || 0;
    
    if (count === 0) {
      return '#f5f5f5'; // Very light grey for countries with no data
    }
    
    const rank = countryRanking[countryCode];
    if (!rank) return '#f5f5f5';
    
    const baseColor = '#ff3939'; // Base red color for #1 country
    const lightenPercentage = (rank - 1) * 20; // 0%, 20%, 40%, 60%, etc.
    
    return lightenColor(baseColor, lightenPercentage);
  };

  // Calculate location metrics for the table
  useEffect(() => {
    // Safety check: ensure networkData exists and is an array
    if (!networkData || !Array.isArray(networkData)) {
      setLocationMetrics([]);
      return;
    }
    
    const metrics = MetricsService.getCountryMetrics(networkData, resourceType);
    setLocationMetrics(metrics);
  }, [networkData, resourceType]);

  // Load world topology data
  useEffect(() => {
    const loadWorldData = async () => {
      try {
        // Use Natural Earth data for complete world coverage
        const response = await fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson');
        const geoData = await response.json();
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
        
        // For flat projections, use a more traditional aspect ratio
        const width = Math.min(Math.max(600, containerWidth), 900);
        const height = Math.round(width * 0.6); // 5:3 aspect ratio
        
        setDimensions({ width, height });
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
  }, []);

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
      // Interactive 3D globe with rotation
      const radius = Math.min(width, height) / 2 - 20;
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
        .attr('stop-color', '#ffffff')
        .attr('stop-opacity', 1);
      
      sphereGradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', '#f8f9fa')
        .attr('stop-opacity', 1);

      // Add sphere background
      const radius = Math.min(width, height) / 2 - 20;
      svg.append('circle')
        .attr('cx', width / 2)
        .attr('cy', height / 2)
        .attr('r', radius)
        .attr('fill', 'url(#sphere-gradient)')
        .attr('stroke', '#e5e7eb')
        .attr('stroke-width', 1);
    }

    // Draw countries
    svg.selectAll('path.country')
      .data(worldData.features)
      .enter()
      .append('path')
      .attr('class', 'country')
      .attr('d', path as any)
      .attr('fill', (d: any) => {
        // Try multiple property names for country code
        let countryCode = (d.properties.ISO_A2 || d.properties.iso_a2)?.toLowerCase() || '';
        
        // If we don't have ISO_A2, try to map from ISO_A3 or name
        if (!countryCode) {
          if (d.properties.ISO_A3) {
            const iso3to2: Record<string, string> = {
              'ARG': 'ar', 'USA': 'us', 'CAN': 'ca', 'BRA': 'br', 'GBR': 'gb',
              'FRA': 'fr', 'DEU': 'de', 'ESP': 'es', 'ITA': 'it', 'RUS': 'ru',
              'CHN': 'cn', 'IND': 'in', 'JPN': 'jp', 'AUS': 'au', 'ZAF': 'za',
              'EGY': 'eg', 'MEX': 'mx', 'NLD': 'nl', 'SWE': 'se', 'NOR': 'no'
            };
            countryCode = iso3to2[d.properties.ISO_A3] || '';
          }
          
          // Also try to map from country name
          if (!countryCode) {
            const countryName = (d.properties.NAME || d.properties.name || d.properties.NAME_EN || '').toLowerCase();
            const nameMapping: Record<string, string> = {
              'argentina': 'ar',
              'united states': 'us',
              'united states of america': 'us',
              'canada': 'ca',
              'brazil': 'br',
              'united kingdom': 'gb',
              'france': 'fr',
              'germany': 'de',
              'spain': 'es',
              'italy': 'it',
              'russia': 'ru',
              'china': 'cn',
              'india': 'in',
              'japan': 'jp',
              'australia': 'au',
              'south africa': 'za',
              'netherlands': 'nl',
              'belgium': 'be',
              'switzerland': 'ch',
              'austria': 'at',
              'portugal': 'pt',
              'poland': 'pl',
              'czech republic': 'cz',
              'hungary': 'hu',
              'romania': 'ro',
              'bulgaria': 'bg',
              'croatia': 'hr',
              'slovenia': 'si',
              'slovakia': 'sk',
              'estonia': 'ee',
              'latvia': 'lv',
              'lithuania': 'lt',
              'finland': 'fi',
              'denmark': 'dk',
              'iceland': 'is',
              'ireland': 'ie',
              'greece': 'gr',
              'turkey': 'tr',
              'israel': 'il',
              'singapore': 'sg',
              'south korea': 'kr',
              'thailand': 'th',
              'malaysia': 'my',
              'indonesia': 'id',
              'philippines': 'ph',
              'vietnam': 'vn',
              'new zealand': 'nz'
            };
            countryCode = nameMapping[countryName] || '';
          }
        }
        
        const count = countryData[countryCode] || 0;
        return getCountryColor(countryCode);
      })
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 0.5)
      .on('mouseover', function(event, d: any) {
        d3.select(this).attr('stroke-width', 1);
      })
      .on('mouseout', function(event, d: any) {
        d3.select(this).attr('stroke-width', 0.5);
      })
      .append('title')
      .text((d: any) => {
        let countryCode = (d.properties.ISO_A2 || d.properties.iso_a2)?.toLowerCase() || '';
        
        if (!countryCode) {
          if (d.properties.ISO_A3) {
            const iso3to2: Record<string, string> = {
              'ARG': 'ar', 'USA': 'us', 'CAN': 'ca', 'BRA': 'br', 'GBR': 'gb',
              'FRA': 'fr', 'DEU': 'de', 'ESP': 'es', 'ITA': 'it', 'RUS': 'ru',
              'CHN': 'cn', 'IND': 'in', 'JPN': 'jp', 'AUS': 'au', 'ZAF': 'za',
              'EGY': 'eg', 'MEX': 'mx', 'NLD': 'nl', 'SWE': 'se', 'NOR': 'no'
            };
            countryCode = iso3to2[d.properties.ISO_A3] || '';
          }
          
          if (!countryCode) {
            const countryName = (d.properties.NAME || d.properties.name || d.properties.NAME_EN || '').toLowerCase();
            const nameMapping: Record<string, string> = {
              'argentina': 'ar',
              'united states': 'us',
              'united states of america': 'us',
              'canada': 'ca',
              'brazil': 'br',
              'united kingdom': 'gb',
              'france': 'fr',
              'germany': 'de',
              'spain': 'es',
              'italy': 'it',
              'russia': 'ru',
              'china': 'cn',
              'india': 'in',
              'japan': 'jp',
              'australia': 'au',
              'south africa': 'za',
              'netherlands': 'nl',
              'belgium': 'be',
              'switzerland': 'ch',
              'austria': 'at',
              'portugal': 'pt',
              'poland': 'pl',
              'czech republic': 'cz',
              'hungary': 'hu',
              'romania': 'ro',
              'bulgaria': 'bg',
              'croatia': 'hr',
              'slovenia': 'si',
              'slovakia': 'sk',
              'estonia': 'ee',
              'latvia': 'lv',
              'lithuania': 'lt',
              'finland': 'fi',
              'denmark': 'dk',
              'iceland': 'is',
              'ireland': 'ie',
              'greece': 'gr',
              'turkey': 'tr',
              'israel': 'il',
              'singapore': 'sg',
              'south korea': 'kr',
              'thailand': 'th',
              'malaysia': 'my',
              'indonesia': 'id',
              'philippines': 'ph',
              'vietnam': 'vn',
              'new zealand': 'nz'
            };
            countryCode = nameMapping[countryName] || '';
          }
        }
        
        const count = countryData[countryCode] || 0;
        const countryName = d.properties.NAME || d.properties.name || d.properties.NAME_EN || 'Unknown';
        const rank = countryRanking[countryCode];
        
        if (count === 0) {
          return `${countryName}: 0 servidores`;
        }
        
        return `${countryName}: ${count} servidor${count !== 1 ? 'es' : ''} (Ranking #${rank})`;
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

  // Mouse event handlers for rotation (only used with interactive 3D globe)
  const handleMouseDown = (event: React.MouseEvent) => {
    if (selectedProjection !== 'orthographicInteractive') return;
    setIsDragging(true);
    setDragStart([event.clientX, event.clientY]);
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
  };

  // Add global mouse up listener for dragging
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
      setDragStart(null);
    };

    if (isDragging) {
      document.addEventListener('mouseup', handleGlobalMouseUp);
      document.addEventListener('mouseleave', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('mouseleave', handleGlobalMouseUp);
    };
  }, [isDragging]);

  if (isLoading) {
    return (
      <div className="card server-geolocation-map">
        <div className="header">
          <h3>{title}</h3>
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
    <div className="card server-geolocation-map">
      <div className="header">
        <h3>{title}</h3>
        <div className="map-controls">
          <select 
            value={selectedProjection} 
            onChange={(e) => setSelectedProjection(e.target.value)}
            className="projection-selector"
          >
            {PROJECTIONS.map(proj => (
              <option key={proj.id} value={proj.id}>
                {proj.name}
              </option>
            ))}
          </select>
          <span className="server-count">{networkData?.length || 0} servidores</span>
        </div>
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
            initialSort={Sort.asc}
          />
        </div>
      </div>
    </div>
  );
}; 