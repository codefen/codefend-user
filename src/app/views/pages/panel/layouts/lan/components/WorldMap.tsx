import { type FC, useEffect, useRef, useMemo, useState } from 'react';
import * as d3 from 'd3';
import type { Device } from '@interfaces/panel.ts';
import { Sort, type ColumnTableV3 } from '@interfaces/table.ts';
import { MetricsService } from '@utils/metric.service.ts';
import { LocationItem } from '@/app/views/components/utils/LocationItem';
import { TABLE_KEYS, RESOURCE_CLASS } from '@/app/constants/app-texts';
import Tablev3 from '@table/v3/Tablev3';

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

interface WorldMapProps {
  networkData: NetworkDevice[];
  resourceType?: string;
  title?: string;
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

export const WorldMap: FC<WorldMapProps> = ({ 
  networkData, 
  resourceType = RESOURCE_CLASS.NETWORK, 
  title = "Global server distribution" 
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [worldData, setWorldData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dimensions, setDimensions] = useState({ width: 400, height: 400 });
  const [locationMetrics, setLocationMetrics] = useState<any[]>([]);
  const [rotation, setRotation] = useState<[number, number]>([0, 0]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<[number, number] | null>(null);

  // Process data to count servers by country
  const countryData = useMemo(() => {
    const counts: Record<string, number> = {};
    
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

  // Calculate location metrics for the table
  useEffect(() => {
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
        
        // For globe, we want a square aspect ratio
        const size = Math.min(Math.max(350, containerWidth), 500);
        
        setDimensions({ width: size, height: size });
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

  // Mouse event handlers for rotation
  const handleMouseDown = (event: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart([event.clientX, event.clientY]);
    event.preventDefault();
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isDragging || !dragStart) return;

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

  // Add global mouse up listener
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

  useEffect(() => {
    if (!svgRef.current || !worldData || isLoading) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous render

    const { width, height } = dimensions;
    
    svg.attr('width', width).attr('height', height);

    // Create 3D orthographic projection for globe effect
    const radius = Math.min(width, height) / 2 - 20;
    const projection = d3.geoOrthographic()
      .scale(radius)
      .translate([width / 2, height / 2])
      .rotate(rotation)
      .clipAngle(90);

    const path = d3.geoPath().projection(projection);

    // Add gradient definitions for 3D effect
    const defs = svg.append('defs');
    
    // Sphere gradient for 3D effect - almost white water
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

    // Add sphere background first
    svg.append('circle')
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .attr('r', radius)
      .attr('fill', 'url(#sphere-gradient)')
      .attr('stroke', '#e5e7eb')
      .attr('stroke-width', 1);

    // Custom color scale with greys and reds
    const colorScale = d3.scaleSequential()
      .domain([0, maxCount])
      .interpolator((t) => {
        if (t === 0) return '#e8e8e8'; // Light grey for countries with no data
        // Interpolate from light grey through light red to #ff3939
        if (t < 0.3) {
          // Grey to light red transition
          const grey = d3.rgb(232, 232, 232); // #e8e8e8
          const lightRed = d3.rgb(255, 200, 200);
          return d3.interpolateRgb(grey, lightRed)(t / 0.3);
        } else {
          // Light red to dark red transition
          const lightRed = d3.rgb(255, 200, 200);
          const darkRed = d3.rgb(255, 57, 57); // #ff3939
          return d3.interpolateRgb(lightRed, darkRed)((t - 0.3) / 0.7);
        }
      });

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
        return colorScale(count);
      })
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 0.5)
      .style('cursor', isDragging ? 'grabbing' : 'grab')
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
        return `${countryName}: ${count} server${count !== 1 ? 's' : ''}`;
      });

    // Add graticules (grid lines) for better 3D effect
    const graticule = d3.geoGraticule()
      .step([15, 15]);

    svg.append('path')
      .datum(graticule)
      .attr('class', 'graticule')
      .attr('d', path as any)
      .attr('fill', 'none')
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 0.3)
      .attr('opacity', 0.3);

  }, [worldData, countryData, maxCount, isLoading, dimensions, rotation, isDragging]);

  if (isLoading) {
    return (
      <div className="card world-map-card">
        <div className="header">
          <h3>{title}</h3>
        </div>
        <div className="content" ref={containerRef}>
          <div className="world-map-loading">
            <div className="loading-spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card world-map-card">
      <div className="header">
        <h3>{title}</h3>
        <span className="server-count">{networkData.length} servers</span>
      </div>
      <div className="content" ref={containerRef}>
        <div 
          className="globe-container"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
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