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

interface NetworkNode {
  id: string;
  type: 'central' | 'server';
  label: string;
  neuroscan_id?: string;
  ip?: string;
  domains?: string[];
  domains_count?: number;
  country?: string;
  country_code?: string;
  location?: string;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

interface NetworkLink {
  source: string;
  target: string;
}

interface NetworkVisualizationProps {
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

export const NetworkVisualization: FC<NetworkVisualizationProps> = ({
  networkData,
  width = 800,
  height = 600,
  title = "Network Groups Visualization"
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  const [isLoading, setIsLoading] = useState(true);



  // Process data to create nodes and links
  const { nodes, links } = useMemo(() => {
    const nodeMap = new Map<string, NetworkNode>();
    const linkArray: NetworkLink[] = [];

    // Group servers by neuroscan_id
    const groupedByNeuroscan = new Map<string, NetworkDevice[]>();
    
    networkData.forEach(device => {
      const neuroscanId = device.neuroscan_id || 'ungrouped';
      if (!groupedByNeuroscan.has(neuroscanId)) {
        groupedByNeuroscan.set(neuroscanId, []);
      }
      groupedByNeuroscan.get(neuroscanId)!.push(device);
    });

    // Create central nodes and server nodes
    groupedByNeuroscan.forEach((devices, neuroscanId) => {
      // Create central node
      const centralNodeId = `central-${neuroscanId}`;
      const mainDomain = devices[0]?.neuroscan_main_domain || devices[0]?.all_found_domains;
      let parsedDomains: string[] = [];
      
      try {
        if (mainDomain) {
          parsedDomains = JSON.parse(mainDomain);
        }
      } catch {
        parsedDomains = mainDomain ? [mainDomain] : [];
      }

      nodeMap.set(centralNodeId, {
        id: centralNodeId,
        type: 'central',
        label: neuroscanId === 'ungrouped' ? 'Ungrouped Servers' : `Neuroscan ${neuroscanId}`,
        neuroscan_id: neuroscanId === 'ungrouped' ? undefined : neuroscanId,
        domains: parsedDomains,
        domains_count: devices.reduce((acc, device) => {
          try {
            const domains = JSON.parse(device.all_found_domains || '[]');
            return acc + domains.length;
          } catch {
            return acc;
          }
        }, 0)
      });

      // Create server nodes and links
      devices.forEach((device, index) => {
        const serverNodeId = `server-${device.id}`;
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

        nodeMap.set(serverNodeId, {
          id: serverNodeId,
          type: 'server',
          label: `Server ${device.id}`,
          ip: ip || 'N/A',
          domains,
          domains_count: domains.length,
          country: device.server_pais,
          country_code: device.server_pais_code,
          location,
          neuroscan_id: device.neuroscan_id
        });

        // Create link between central node and server
        linkArray.push({
          source: centralNodeId,
          target: serverNodeId
        });
      });
    });

    return {
      nodes: Array.from(nodeMap.values()),
      links: linkArray
    };
  }, [networkData]);

  // Render network graph
  const renderNetworkGraph = () => {
    if (!svgRef.current || nodes.length === 0) {
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

    // Set up zoom
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        container.attr('transform', `translate(${margin.left + event.transform.x},${margin.top + event.transform.y}) scale(${event.transform.k})`);
      });

    svg.call(zoom);

    // Create force simulation
    const simulation = d3.forceSimulation(nodes as any)
      .force('link', d3.forceLink(links)
        .id((d: any) => d.id)
        .distance(150)
        .strength(0.8)
      )
      .force('charge', d3.forceManyBody()
        .strength((d: any) => d.type === 'central' ? -800 : -400)
      )
      .force('center', d3.forceCenter(innerWidth / 2, innerHeight / 2))
      .force('collision', d3.forceCollide()
        .radius((d: any) => d.type === 'central' ? 40 : 25)
      );

    // Create links
    const link = container.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(links)
      .enter().append('line')
      .attr('class', 'network-link')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 2);

    // Create nodes
    const node = container.append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(nodes)
      .enter().append('g')
      .attr('class', 'network-node')
      .call(d3.drag<SVGGElement, NetworkNode>()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        })
      );

    // Add circles for nodes
    node.append('circle')
      .attr('r', (d: NetworkNode) => d.type === 'central' ? 30 : 20)
      .attr('fill', (d: NetworkNode) => {
        if (d.type === 'central') {
          return d.neuroscan_id ? '#4f46e5' : '#64748b'; // Blue for neuroscan groups, gray for ungrouped
        }
        return '#06b6d4'; // Cyan for servers
      })
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        setSelectedNode(d);
      })
      .on('mouseover', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', (d.type === 'central' ? 30 : 20) * 1.2)
          .attr('stroke-width', 3);
      })
      .on('mouseout', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', d.type === 'central' ? 30 : 20)
          .attr('stroke-width', 2);
      });

    // Add icons to nodes
    node.append('text')
      .text((d: NetworkNode) => {
        if (d.type === 'central') {
          return d.neuroscan_id ? '🧠' : '📊';
        }
        return '🖥️';
      })
      .attr('text-anchor', 'middle')
      .attr('dy', '0.3em')
      .attr('font-size', d => d.type === 'central' ? '20px' : '16px')
      .style('pointer-events', 'none');

    // Add labels
    const labels = container.append('g')
      .attr('class', 'labels')
      .selectAll('text')
      .data(nodes)
      .enter().append('text')
      .text((d: NetworkNode) => {
        if (d.type === 'central') {
          return d.neuroscan_id ? `NS-${d.neuroscan_id}` : 'Ungrouped';
        }
        return d.ip || 'Server';
      })
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .attr('text-anchor', 'middle')
      .attr('dy', (d: NetworkNode) => d.type === 'central' ? 45 : 35)
      .attr('fill', '#374151')
      .style('pointer-events', 'none');

    // Update positions on tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node
        .attr('transform', (d: NetworkNode) => `translate(${d.x},${d.y})`);

      labels
        .attr('x', (d: NetworkNode) => d.x || 0)
        .attr('y', (d: NetworkNode) => d.y || 0);
    });

    setIsLoading(false);

    return () => {
      simulation.stop();
    };
  };



  useEffect(() => {
    renderNetworkGraph();
  }, [nodes, links, width, height]);

  if (isLoading && nodes.length === 0) {
    return (
      <div className="network-visualization-container">
        <div className="header">
          <h3>{title}</h3>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading network data...</p>
        </div>
      </div>
    );
  }

  if (nodes.length === 0) {
    return (
      <div className="network-visualization-container">
        <div className="header">
          <h3>{title}</h3>
        </div>
        <div className="empty-state">
          <p>No network data available to visualize</p>
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
            <div className="legend-color" style={{ backgroundColor: '#4f46e5' }}></div>
            <span>Neuroscan Groups</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#06b6d4' }}></div>
            <span>Servers</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#64748b' }}></div>
            <span>Ungrouped</span>
          </div>
        </div>
      </div>
      
      <div className="visualization-content">
        <div className="network-canvas">
          <svg ref={svgRef}></svg>
        </div>
        
        {selectedNode && (
          <div className="node-details">
            <button 
              className="close-details"
              onClick={() => setSelectedNode(null)}
            >
              ×
            </button>
            <h4>{selectedNode.type === 'central' ? 'Group Details' : 'Server Details'}</h4>
            
            {selectedNode.type === 'central' ? (
              <div className="central-node-info">
                <p><strong>Group ID:</strong> {selectedNode.neuroscan_id || 'Ungrouped'}</p>
                <p><strong>Total Domains:</strong> {selectedNode.domains_count}</p>
                {selectedNode.domains && selectedNode.domains.length > 0 && (
                  <div>
                    <strong>Domains:</strong>
                    <ul className="domains-list">
                      {selectedNode.domains.slice(0, 10).map((domain, index) => (
                        <li key={index}>|- {domain}</li>
                      ))}
                      {selectedNode.domains!.length > 10 && (
                        <li>... and {selectedNode.domains!.length - 10} more</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="server-node-info">
                <p><strong>Server IP:</strong> {selectedNode.ip}</p>
                <p><strong>Location:</strong> {selectedNode.location}</p>
                <p><strong>Country:</strong> {selectedNode.country_code ? `${selectedNode.country} (${selectedNode.country_code})` : selectedNode.country || 'Unknown'}</p>
                <p><strong>Domains:</strong> {selectedNode.domains_count}</p>
                {selectedNode.domains && selectedNode.domains.length > 0 && (
                  <div>
                    <strong>Found domains:</strong>
                    <ul className="domains-list">
                      {selectedNode.domains.slice(0, 10).map((domain, index) => (
                        <li key={index}>|- {domain}</li>
                      ))}
                      {selectedNode.domains!.length > 10 && (
                        <li>... and {selectedNode.domains!.length - 10} more</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}; 