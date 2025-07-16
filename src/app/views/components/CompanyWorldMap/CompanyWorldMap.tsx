import { type FC, useEffect, useRef, useMemo, useState } from 'react';
import * as d3 from 'd3';
import { Sort, type ColumnTableV3 } from '@interfaces/table.ts';
import { LocationItem } from '@/app/views/components/utils/LocationItem';
import { TABLE_KEYS } from '@/app/constants/app-texts';
import Tablev3 from '@table/v3/Tablev3';
import './CompanyWorldMap.scss';

// Interface para los datos de compañías
interface Company {
  id: string;
  name: string;
  pais?: string;
  pais_code?: string;
  mercado?: string;
  web?: string;
  owner_email?: string;
  creacion?: string;
}

interface CompanyWorldMapProps {
  companies: Company[];
  title?: string;
  isLoading?: boolean;
}

// Mapeo de códigos de país a nombres completos
const codeToName: Record<string, string> = {
  AR: 'Argentina',
  US: 'United States',
  CA: 'Canada',
  NL: 'Netherlands',
  AU: 'Australia',
  BR: 'Brazil',
  GB: 'United Kingdom',
  FR: 'France',
  DE: 'Germany',
  ES: 'Spain',
  IT: 'Italy',
  RU: 'Russia',
  CN: 'China',
  IN: 'India',
  JP: 'Japan',
  ZA: 'South Africa',
  MX: 'Mexico',
  BE: 'Belgium',
  CH: 'Switzerland',
  AT: 'Austria',
  PT: 'Portugal',
  PL: 'Poland',
  CZ: 'Czech Republic',
  HU: 'Hungary',
  RO: 'Romania',
  BG: 'Bulgaria',
  HR: 'Croatia',
  SI: 'Slovenia',
  SK: 'Slovakia',
  EE: 'Estonia',
  LV: 'Latvia',
  LT: 'Lithuania',
  FI: 'Finland',
  DK: 'Denmark',
  IS: 'Iceland',
  IE: 'Ireland',
  GR: 'Greece',
  TR: 'Turkey',
  IL: 'Israel',
  SG: 'Singapore',
  KR: 'South Korea',
  TH: 'Thailand',
  MY: 'Malaysia',
  ID: 'Indonesia',
  PH: 'Philippines',
  VN: 'Vietnam',
  NZ: 'New Zealand',
  CL: 'Chile',
};

// Coordenadas de países para centrar el mapa
const countryCoordinates: Record<string, [number, number]> = {
  Argentina: [-64.0, -34.0],
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

// Configuración visual del mapa
const MAP_STYLE = {
  countryNoData: '#f8f9fa',
  countryWithData: '#dc2626',
  countryBorder: '#dee2e6',
  countryBorderWidth: 0.5,
  oceanColor: '#f0f9ff',
};

// Columnas para la tabla de ubicaciones
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

export const CompanyWorldMap: FC<CompanyWorldMapProps> = ({
  companies,
  title = 'Global companies distribution',
  isLoading = false,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [worldData, setWorldData] = useState<any>(null);
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });
  const [selectedView, setSelectedView] = useState<'2D' | '3D'>('2D');

  // Procesar datos de compañías por país
  const countryData = useMemo(() => {
    const counts: Record<string, number> = {};
    
    companies.forEach(company => {
      let countryName = company.pais || company.mercado;
      
      // Si tenemos código de país, convertir a nombre
      if (company.pais_code && codeToName[company.pais_code.toUpperCase()]) {
        countryName = codeToName[company.pais_code.toUpperCase()];
      }
      
      if (countryName && countryName !== 'unknown') {
        counts[countryName] = (counts[countryName] || 0) + 1;
      }
    });

    return counts;
  }, [companies]);

  // Obtener el máximo para escala de colores
  const maxCount = useMemo(() => {
    return Math.max(...Object.values(countryData), 1);
  }, [countryData]);

  // Crear métricas para la tabla
  const locationMetrics = useMemo(() => {
    const total = Object.values(countryData).reduce((sum, count) => sum + count, 0);
    
    return Object.entries(countryData)
      .map(([countryName, count]) => {
        // Buscar código de país
        const countryCode = Object.entries(codeToName)
          .find(([code, name]) => name === countryName)?.[0]?.toLowerCase() || 'xx';
        
        return {
          country: countryName,
          countryCode,
          count,
          percentage: Math.round((count / total) * 100 * 10) / 10,
        };
      })
      .sort((a, b) => b.count - a.count);
  }, [countryData]);

  // Función para obtener color del país
  const getCountryColor = (countryName: string) => {
    const count = countryData[countryName] || 0;
    if (count === 0) return MAP_STYLE.countryNoData;
    
    // Escala de intensidad basada en el conteo
    const intensity = count / maxCount;
    const baseColor = d3.rgb(MAP_STYLE.countryWithData);
    const lightColor = d3.rgb(255, 255, 255);
    
    // Interpolar entre color base y blanco según la intensidad
    return d3.interpolateRgb(lightColor, baseColor)(0.3 + intensity * 0.7);
  };

  // Cargar datos del mundo
  useEffect(() => {
    const loadWorldData = async () => {
      try {
        const response = await fetch(
          'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson'
        );
        const geoData = await response.json();
        setWorldData(geoData);
        setIsMapLoading(false);
      } catch (error) {
        console.error('Error loading world data:', error);
        setIsMapLoading(false);
      }
    };
    loadWorldData();
  }, []);

  // Configurar dimensiones responsivas
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        const height = Math.min(width * 0.6, 500);
        setDimensions({ width: width - 40, height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Renderizar el mapa
  useEffect(() => {
    if (!worldData || !svgRef.current || isMapLoading) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const { width, height } = dimensions;

    // Configurar proyección
    const projection = d3
      .geoNaturalEarth1()
      .scale(width / 6.5)
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    // Dibujar países
    svg
      .selectAll('path.country')
      .data(worldData.features)
      .enter()
      .append('path')
      .attr('class', 'country')
      .attr('d', path as any)
      .attr('fill', (d: any) => {
        const countryName = d.properties.NAME || d.properties.name || '';
        return getCountryColor(countryName);
      })
      .attr('stroke', MAP_STYLE.countryBorder)
      .attr('stroke-width', MAP_STYLE.countryBorderWidth)
      .on('mouseover', function(event, d: any) {
        const countryName = d.properties.NAME || d.properties.name || '';
        const count = countryData[countryName] || 0;
        
        // Crear tooltip
        const tooltip = d3.select('body')
          .append('div')
          .attr('class', 'map-tooltip')
          .style('position', 'absolute')
          .style('background', 'rgba(0, 0, 0, 0.8)')
          .style('color', 'white')
          .style('padding', '8px')
          .style('border-radius', '4px')
          .style('font-size', '12px')
          .style('pointer-events', 'none')
          .style('z-index', '1000');

        tooltip.html(`
          <strong>${countryName}</strong><br/>
          ${count} empresa${count !== 1 ? 's' : ''}
        `);

        tooltip
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px');

        // Resaltar país
        d3.select(this)
          .attr('stroke-width', 1)
          .attr('stroke', '#333');
      })
      .on('mouseout', function() {
        // Remover tooltip
        d3.selectAll('.map-tooltip').remove();
        
        // Restaurar estilo
        d3.select(this)
          .attr('stroke-width', MAP_STYLE.countryBorderWidth)
          .attr('stroke', MAP_STYLE.countryBorder);
      });

    // Agregar líneas de grilla
    const graticule = d3.geoGraticule().step([30, 30]);
    svg
      .append('path')
      .datum(graticule)
      .attr('class', 'graticule')
      .attr('d', path as any)
      .attr('fill', 'none')
      .attr('stroke', '#e0e0e0')
      .attr('stroke-width', 0.5)
      .attr('opacity', 0.3);

  }, [worldData, countryData, maxCount, dimensions, isMapLoading]);

  if (isLoading || isMapLoading) {
    return (
      <div className="card company-world-map">
        <div className="header">
          <span>{title}</span>
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

  const totalCompanies = companies.length;
  const companiesWithLocation = Object.values(countryData).reduce((sum, count) => sum + count, 0);

  return (
    <div className="card company-world-map">
      <div className="header">
        <div className="title-section">
          <span>{title}</span>
          <div className="view-tabs">
            <button
              className={selectedView === '2D' ? 'active' : ''}
              onClick={() => setSelectedView('2D')}>
              2D
            </button>
            <button
              className={selectedView === '3D' ? 'active' : ''}
              onClick={() => setSelectedView('3D')}>
              3D
            </button>
          </div>
        </div>
      </div>
      <div className="content" ref={containerRef}>
        <div className="map-container">
          <svg ref={svgRef} width={dimensions.width} height={dimensions.height} />
          
          {/* Información de resumen */}
          <div className="map-summary">
            <div className="summary-item">
              <span className="summary-label">Total de empresas:</span>
              <span className="summary-value">{totalCompanies}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Con ubicación:</span>
              <span className="summary-value">{companiesWithLocation}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Países:</span>
              <span className="summary-value">{Object.keys(countryData).length}</span>
            </div>
          </div>
        </div>

        {/* Tabla de ubicaciones */}
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