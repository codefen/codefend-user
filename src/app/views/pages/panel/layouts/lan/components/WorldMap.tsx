import { type FC, useEffect, useRef, useMemo, useState } from 'react';
import * as d3 from 'd3';
import type { Device } from '@interfaces/panel.ts';

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
}

export const WorldMap: FC<WorldMapProps> = ({ networkData }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [worldData, setWorldData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dimensions, setDimensions] = useState({ width: 400, height: 280 });

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
        const containerRect = containerRef.current.getBoundingClientRect();
        const containerWidth = containerRect.width;
        const containerHeight = containerRect.height;
        
        // Use actual container dimensions, with minimum values for safety
        const width = Math.max(300, containerWidth);
        const height = Math.max(200, containerHeight);
        
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

    // Custom color scale with specific red for maximum
    const colorScale = d3.scaleSequential()
      .domain([0, maxCount])
      .interpolator((t) => {
        if (t === 0) return '#d4d4d4'; // Darker gray for better contrast
        // Interpolate from light red to #ff3939
        const lightRed = d3.rgb(255, 200, 200);
        const darkRed = d3.rgb(255, 57, 57); // #ff3939
        return d3.interpolateRgb(lightRed, darkRed)(t);
      });

    // Create projection - scale based on container dimensions
    const scale = Math.min(width / 5.5, height / 3.5); // Optimized scaling for better fit
    const projection = d3.geoNaturalEarth1()
      .scale(scale)
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    // Draw countries directly from GeoJSON
    svg.selectAll('path')
      .data(worldData.features)
      .enter()
      .append('path')
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
              'south africa': 'za'
            };
            countryCode = nameMapping[countryName] || '';
          }
        }
        
        const count = countryData[countryCode] || 0;
        return count > 0 ? colorScale(count) : '#d4d4d4';
      })
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 0.3)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d: any) {
        d3.select(this).attr('stroke-width', 1);
      })
      .on('mouseout', function(event, d: any) {
        d3.select(this).attr('stroke-width', 0.3);
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
              'south africa': 'za'
            };
            countryCode = nameMapping[countryName] || '';
          }
        }
        
        const count = countryData[countryCode] || 0;
        const countryName = d.properties.NAME || d.properties.name || d.properties.NAME_EN || 'Unknown';
        return `${countryName}: ${count} server${count !== 1 ? 's' : ''}`;
      });

    // No legend needed - just the map

  }, [worldData, countryData, maxCount, isLoading, dimensions]);

  if (isLoading) {
    return (
      <div className="card world-map-card">
        <div className="header">
          <h3>Server Distribution</h3>
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
        <h3>Server Distribution</h3>
        <span className="server-count">{networkData.length} servers</span>
      </div>
          <div className="content" ref={containerRef}>
      <svg ref={svgRef} className="world-map-svg"></svg>
    </div>
    </div>
  );
}; 