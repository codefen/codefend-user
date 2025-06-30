import { type FC, useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import type { Device } from '@interfaces/panel.ts';
import './NetworkVisualization.scss';

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

// Coordenadas geográficas para países (longitud, latitud)
const countryCoordinates: Record<string, [number, number]> = {
  'Argentina': [-64.0, -34.0],
  'USA': [-95.0, 39.0],
  'United States': [-95.0, 39.0],
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

interface ServerLocation {
  id: number;
  ip: string;
  country: string;
  location: string;
  coordinates: [number, number];
  domains: string[];
  neuroscan_id?: string;
}

export const WorldMapView: FC<WorldMapViewProps> = ({
  networkData,
  width = 800,
  height = 600,
  title = "Global Server Locations"
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [worldData, setWorldData] = useState<any>(null);

  // Load world data
  useEffect(() => {
    const loadWorldData = async () => {
      try {
        const response = await fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson');
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
      const coordinates = countryCoordinates[country] || [0, 0];
      const ip = device.device_ex_address || device.device_in_address;
      
      let domains: string[] = [];
      try {
        domains = JSON.parse(device.all_found_domains || '[]');
      } catch {
        domains = [];
      }

      const location = [
        device.server_pais,
        device.server_pais_provincia,
        device.server_pais_ciudad,
      ].filter(Boolean).join(', ') || 'Unknown location';

      return {
        id: device.id,
        ip: ip || 'N/A',
        country,
        location,
        coordinates,
        domains,
        neuroscan_id: device.neuroscan_id,
      };
    });
  }, [networkData]);

  // Render world map with server locations
  useEffect(() => {
    if (!svgRef.current || !worldData || serverLocations.length === 0) {
      setIsLoading(false);
      return;
    }

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Set up dimensions
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const container = svg
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Set up projection
    const projection = d3.geoNaturalEarth1()
      .scale(innerWidth / 6.5)
      .translate([innerWidth / 2, innerHeight / 2]);

    const path = d3.geoPath().projection(projection);

    // Set up zoom
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 8])
      .on('zoom', (event) => {
        container.attr('transform', `translate(${margin.left + event.transform.x},${margin.top + event.transform.y}) scale(${event.transform.k})`);
      });

    svg.call(zoom);

    // Draw countries
    container.selectAll('path.country')
      .data(worldData.features)
      .enter()
      .append('path')
      .attr('class', 'country')
      .attr('d', path as any)
      .attr('fill', '#f8f9fa')
      .attr('stroke', '#dee2e6')
      .attr('stroke-width', 0.5);

    // Group servers by location to avoid overlapping
    const locationCounts = new Map<string, any>();
    serverLocations.forEach(server => {
      const key = `${server.coordinates[0]},${server.coordinates[1]}`;
      if (!locationCounts.has(key)) {
        locationCounts.set(key, {
          coordinates: server.coordinates,
          servers: [],
          country: server.country,
          location: server.location
        });
      }
      locationCounts.get(key)!.servers.push(server);
    });

    // Draw server points
    const serverPoints = container.selectAll('circle.server-point')
      .data(Array.from(locationCounts.values()))
      .enter()
      .append('circle')
      .attr('class', 'server-point')
      .attr('cx', d => projection(d.coordinates)![0])
      .attr('cy', d => projection(d.coordinates)![1])
      .attr('r', d => Math.min(Math.max(3 + d.servers.length * 2, 5), 15))
      .attr('fill', '#dc2626')
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        setSelectedLocation(d);
      })
      .on('mouseover', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', Math.min(Math.max(3 + d.servers.length * 2, 5), 15) * 1.3);
      })
      .on('mouseout', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', Math.min(Math.max(3 + d.servers.length * 2, 5), 15));
      });

    // Add tooltips
    serverPoints.append('title')
      .text(d => `${d.location}: ${d.servers.length} servidor${d.servers.length !== 1 ? 'es' : ''}`);

    setIsLoading(false);
  }, [worldData, serverLocations, width, height]);

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
            <span>Ubicación de Servidores</span>
          </div>
          <div className="legend-item">
            <span>Tamaño del punto = cantidad de servidores</span>
          </div>
        </div>
      </div>
      
      <div className="visualization-content">
        <div className="network-canvas">
          <svg ref={svgRef}></svg>
        </div>
        
        {selectedLocation && (
          <div className="node-details">
            <button 
              className="close-details"
              onClick={() => setSelectedLocation(null)}
            >
              ×
            </button>
            <h4>Detalles de Ubicación</h4>
            
            <div className="server-node-info">
              <p><strong>Ubicación:</strong> {selectedLocation.location}</p>
              <p><strong>País:</strong> {selectedLocation.country}</p>
              <p><strong>Servidores:</strong> {selectedLocation.servers.length}</p>
              
              <div>
                <strong>Servidores en esta ubicación:</strong>
                <ul className="domains-list">
                  {selectedLocation.servers.map((server: any, index: number) => (
                    <li key={index}>
                      🖥️ {server.ip} 
                      {server.neuroscan_id && <span> (NS-{server.neuroscan_id})</span>}
                      {server.domains.length > 0 && (
                        <span> - {server.domains.length} dominio{server.domains.length !== 1 ? 's' : ''}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 