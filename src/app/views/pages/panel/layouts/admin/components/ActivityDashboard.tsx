import { type FC, useRef, useEffect, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { useGetUserRegistrations } from '@userHooks/admins/useGetUserRegistrations';
import { useUserData } from '#commonUserHooks/useUserData';
import { AxiosHttpService } from '@/app/data/services/axiosHTTP.service';
import { Sort, type ColumnTableV3 } from '@interfaces/table';
import { TABLE_KEYS } from '@/app/constants/app-texts';
import Tablev3 from '@/app/views/components/Table/v3/Tablev3';
import './ActivityLineChart.scss';
import { DesktopIcon } from '@/app/views/components/icons/DesktopIcon';
import { MobileIcon } from '@/app/views/components/icons/MobileIcon';
import { AppleIcon } from '@/app/views/components/icons/AppleIcon';
import { AndroidIcon } from '@/app/views/components/icons/AndroidIcon';
import { WindowsIcon } from '@/app/views/components/icons/WindowsIcon';
import { LinuxIcon } from '@/app/views/components/icons/LinuxIcon';
import { naturalTimeSpanish } from '@/app/data/utils/helper';

// Interfaces
interface DailyData {
  fecha: string;
  leads: string;
  usuarios: string;
  companias: string;
  neuroscans: string;
  visitas_unicas: string;
  orders: string;
  issues_vistos: string;
}

type TimePeriod = 'today' | 'week' | '14days' | '21days';

// Componente de selector de período
const PeriodSelector: FC<{
  currentPeriod: TimePeriod;
  onPeriodChange: (period: TimePeriod) => void;
  isLoading: boolean;
}> = ({ currentPeriod, onPeriodChange, isLoading }) => {
  return (
    <div className="period-selector">
      <div className="period-buttons">
        <button
          className={`period-btn ${currentPeriod === 'today' ? 'active' : ''}`}
          onClick={() => onPeriodChange('today')}
          disabled={isLoading}
        >
          📅 Hoy
        </button>
        <button
          className={`period-btn ${currentPeriod === 'week' ? 'active' : ''}`}
          onClick={() => onPeriodChange('week')}
          disabled={isLoading}
        >
          📊 Últimos 7 días
        </button>
      </div>
    </div>
  );
};

// 1. COMPONENTE DE MÉTRICAS
export const ActivityMetrics: FC<{ totals: any; currentPeriod: TimePeriod; onPeriodChange: (period: TimePeriod) => void; isLoading: boolean }> = ({ 
  totals, 
  currentPeriod, 
  onPeriodChange, 
  isLoading 
}) => {
  // Función para calcular porcentajes
  const calculatePercentage = (value: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  };

  // Función para calcular porcentaje de conversión entre leads y usuarios
  const calculateConversionPercentage = (converted: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((converted / total) * 100);
  };

  const uniqueViews = totals.visitas_unicas || 0;
  const leads = totals.leads || 0;
  const users = totals.usuarios || 0;

  const leadsPercentage = calculatePercentage(leads, uniqueViews);
  const usersPercentage = calculatePercentage(users, uniqueViews);
  const usersFromLeadsPercentage = calculateConversionPercentage(users, leads);
  const abandonedLeadsPercentage = 100 - usersFromLeadsPercentage;
  const abandonedViewsPercentage = 100 - leadsPercentage;

  return (
    <div className="card standard metrics-card">
      <div className="over">
        <div className="body">
          <div className="activity-summary">
            <div className="metrics-list">
              {/* Landers / Unique Views */}
              <div className="metric-row">
                <div className="metric-header">
                  <span className="metric-name">Landers o unique views</span>
                  <span className="metric-value">{uniqueViews.toLocaleString()} (100%)</span>
                </div>
                <ul className="metric-details">
                  <li>Personas que accedieron o vieron la app únicas por día</li>
                </ul>
              </div>

              {/* Leads */}
              <div className="metric-row">
                <div className="metric-header">
                  <span className="metric-name">Leads</span>
                  <span className="metric-value">{leads.toLocaleString()} ({leadsPercentage}%)</span>
                </div>
                <ul className="metric-details">
                  <li>{leadsPercentage}% de los que acceden comenzaron a crear un usuario</li>
                  <li>{abandonedViewsPercentage}% se fueron al ver que debían crear un usuario</li>
                </ul>
              </div>

              {/* Users */}
              <div className="metric-row">
                <div className="metric-header">
                  <span className="metric-name">Users</span>
                  <span className="metric-value">{users.toLocaleString()} ({usersPercentage}%)</span>
                </div>

                <ul className="metric-details">
                  <li>{usersPercentage}% de los que accedieron finalizaron la creación usuario</li>
                  <li>{usersFromLeadsPercentage}% de los que comenzaron a crear el usuario finalizaron</li>
                  <li>{abandonedLeadsPercentage}% abandonó el proceso de creación de usuario</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 2. COMPONENTE DEL GRÁFICO
export const ActivityChart: FC = () => {
  const { data: registrations, isLoading, fetchRegistrations, currentPeriod } = useGetUserRegistrations();
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Cargar datos automáticamente al montar el componente
  useEffect(() => {
    fetchRegistrations('today'); // Por defecto cargar solo el día de hoy
  }, []);

  // Manejar cambio de período
  const handlePeriodChange = (period: TimePeriod) => {
    fetchRegistrations(period);
  };

  // Renderizar gráfico
  useEffect(() => {
    if (!registrations.length || !svgRef.current || !containerRef.current) return;

    // Obtener dimensiones reales del contenedor
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;
    
    // Calcular dimensiones del gráfico
    const newWidth = Math.max(containerWidth - 40, 300);
    const newHeight = Math.max(Math.min(newWidth * 0.6, 500), 350);

    if (newWidth <= 0 || newHeight <= 0) return;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3
      .select(svgRef.current)
      .attr('width', newWidth)
      .attr('height', newHeight);

    const margin = { top: 20, right: 30, bottom: 80, left: 80 };
    const width = newWidth - margin.left - margin.right;
    const height = newHeight - margin.top - margin.bottom;

    // Procesar datos con fechas convertidas
    const processedData = registrations.map(d => ({
      ...d,
      fecha: new Date(d.fecha),
      leads: parseInt(d.leads) || 0,
      usuarios: parseInt(d.usuarios) || 0,
      visitas_unicas: parseInt(d.visitas_unicas) || 0,
      orders: parseInt(d.orders) || 0
    }));

    // Configurar escalas
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(processedData, (d) => d.fecha) as [Date, Date])
      .range([0, width]);

    const maxValue = d3.max(processedData, (d) => Math.max(d.leads, d.usuarios, d.visitas_unicas, d.orders)) || 10;
    const yScale = d3
      .scaleLinear()
      .domain([0, maxValue * 1.1])
      .range([height, 0]);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Colores fijos que funcionan
    const colors = {
      leads: '#168cb5',
      usuarios: '#4ecdc4', 
      visitas_unicas: '#45b7d1',
      orders: '#96ceb4'
    };

    // Crear líneas
    const line = d3
      .line<any>()
      .x((d) => xScale(d.fecha))
      .y((d) => yScale(d.value))
      .curve(d3.curveMonotoneX);

    // Grid lines
    g.append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale)
        .tickSize(-height)
        .tickFormat(() => ''))
      .selectAll('line')
      .style('stroke', '#e9ecef')
      .style('stroke-width', 1)
      .style('opacity', 0.7);

    g.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft(yScale)
        .tickSize(-width)
        .tickFormat(() => ''))
      .selectAll('line')
      .style('stroke', '#e9ecef')
      .style('stroke-width', 1)
      .style('opacity', 0.7);

    // Ejes
    const timeFormat = currentPeriod === 'today' ? d3.timeFormat('%H:%M') : d3.timeFormat('%m/%d');
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale)
        .tickFormat((domainValue) => timeFormat(domainValue as Date)))
      .selectAll('text')
      .style('font-size', '11px')
      .style('fill', '#6c757d');

    g.append('g')
      .call(d3.axisLeft(yScale))
      .selectAll('text')
      .style('font-size', '11px')
      .style('fill', '#6c757d');

    // Métricas a graficar
    const metrics = [
      { key: 'leads', name: 'Leads', color: colors.leads },
      { key: 'usuarios', name: 'Usuarios', color: colors.usuarios },
      { key: 'visitas_unicas', name: 'Unique Views', color: colors.visitas_unicas },
      { key: 'orders', name: 'Orders', color: colors.orders }
    ];

    // Dibujar líneas para cada métrica
    metrics.forEach(metric => {
      const lineData = processedData.map(d => ({
        fecha: d.fecha,
        value: d[metric.key as keyof typeof d] as number
      }));

      // Línea
      g.append('path')
        .datum(lineData)
        .attr('fill', 'none')
        .attr('stroke', metric.color)
        .attr('stroke-width', 2.5)
        .attr('opacity', 0.8)
        .attr('d', line);

      // Puntos
      g.selectAll(`.dot-${metric.key}`)
        .data(lineData)
        .enter()
        .append('circle')
        .attr('class', `dot-${metric.key}`)
        .attr('cx', (d) => xScale(d.fecha))
        .attr('cy', (d) => yScale(d.value))
        .attr('r', (d) => d.value > 0 ? 4 : 2)
        .attr('fill', metric.color)
        .attr('stroke', '#fff')
        .attr('stroke-width', 2)
        .style('opacity', (d) => d.value > 0 ? 0.9 : 0.3);
    });

    // Leyenda
    const legend = g.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${width - 180}, 20)`);

    metrics.forEach((metric, i) => {
      const legendRow = legend.append('g')
        .attr('transform', `translate(0, ${i * 18})`);

      legendRow.append('circle')
        .attr('r', 4)
        .attr('fill', metric.color);

      legendRow.append('text')
        .attr('x', 12)
        .attr('y', 0)
        .attr('dy', '0.35em')
        .style('font-size', '11px')
        .style('fill', '#495057')
        .text(metric.name);
    });

  }, [registrations, currentPeriod]);

  if (isLoading) {
    return (
      <div className="card standard">
        <div className="over">
          <div className="body">
            <div className="chart-header">
              <PeriodSelector 
                currentPeriod={currentPeriod}
                onPeriodChange={handlePeriodChange}
                isLoading={isLoading}
              />
            </div>
            <div className="activity-chart-container" ref={containerRef}>
              <div className="loading">
                <p>Cargando datos...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!registrations.length) {
    return (
      <div className="card standard">
        <div className="over">
          <div className="body">
            <div className="chart-header">
              <PeriodSelector 
                currentPeriod={currentPeriod}
                onPeriodChange={handlePeriodChange}
                isLoading={isLoading}
              />
            </div>
            <div className="activity-chart-container" ref={containerRef}>
              <div className="chart-placeholder">
                <p>No hay datos para mostrar en el gráfico</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card standard">
      <div className="over">
        <div className="body">
          <div className="chart-header">
            <PeriodSelector 
              currentPeriod={currentPeriod}
              onPeriodChange={handlePeriodChange}
              isLoading={isLoading}
            />
          </div>
          
          <div className="activity-chart-container" ref={containerRef}>
            <svg ref={svgRef}></svg>
          </div>
        </div>
      </div>
    </div>
  );
};

// 3. COMPONENTE DE LA TABLA DE DATOS
interface DataTableSectionProps {
  currentPeriod: TimePeriod;
  isLoading: boolean;
}

export const DataTableSection: FC<DataTableSectionProps> = ({ 
  currentPeriod: externalPeriod, 
  isLoading: externalLoading 
}) => {
  const { getCompany } = useUserData();
  const [rawData, setRawData] = useState<any[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [internalLoading, setInternalLoading] = useState(false);

  // Función para obtener TODOS los datos raw de landers del período
  const fetchRawData = useCallback(async (period: TimePeriod = externalPeriod) => {
    setInternalLoading(true);
    try {
      const response = await AxiosHttpService.getInstance().post<any>({
        path: 'admin/raw-landers',
        body: { 
          company_id: getCompany(),
          period: period
        },
        requireSession: true,
      });
      
      const data = response.data;
      
      if (data.error === '0') {
        setRawData(data.landers || []);
        setTotalRecords(data.total_records || 0);
      } else {
        setRawData([]);
        setTotalRecords(0);
        alert(`Error loading data: ${data.info}`);
      }
    } catch (error) {
      setRawData([]);
      setTotalRecords(0);
      alert('Network error loading data. Please check your connection.');
    } finally {
      setInternalLoading(false);
    }
  }, [getCompany, externalPeriod]);

  // Reaccionar a cambios en el período externo y cargar datos inicial
  useEffect(() => {
    fetchRawData(externalPeriod);
  }, [fetchRawData, externalPeriod]);

  const getPeriodText = (period: TimePeriod) => {
    const today = new Date().toLocaleDateString('es-ES');
    switch (period) {
      case 'today': return `hoy (${today})`;
      case 'week': return 'últimos 7 días';
      case '14days': return 'últimos 14 días';
      case '21days': return 'últimos 21 días';
      default: return `hoy (${today})`;
    }
  };

  // Sin paginación - mostrar todos los registros del período

  // Función auxiliar para obtener información del dispositivo
  const getDeviceInfo = (userAgent: string) => {
    const ua = userAgent.toLowerCase();
    
    // Detectar dispositivo móvil
    const mobileKeywords = ['mobile', 'android', 'iphone', 'ipad', 'blackberry', 'windows phone', 'webos', 'phone'];
    const isMobile = mobileKeywords.some(keyword => ua.includes(keyword));
    
    // Detectar sistema operativo con mayor precisión
    let deviceOs = 'unknown';
    if (ua.includes('android')) deviceOs = 'android';
    else if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ios')) deviceOs = 'ios';
    else if (ua.includes('windows')) deviceOs = 'windows';
    else if (ua.includes('macintosh') || ua.includes('mac os')) deviceOs = 'macos';
    else if (ua.includes('linux') && !ua.includes('android')) deviceOs = 'linux';
    
    return {
      deviceClass: isMobile ? 'phone' : 'desk',
      deviceOs: deviceOs,
      deviceIcon: isMobile ? '📱' : '💻',
      osIcon: deviceOs
    };
  };

  // Configuración de columnas para Tablev3
  const landersColumns: ColumnTableV3[] = [
    {
      header: 'ID',
      key: 'id',
      styles: 'item-cell-landers-id',
      weight: '4%',
      render: (value: string) => value,
    },
    {
      header: 'IP Address',
      key: 'ip_address',
      styles: 'item-cell-landers-ip',
      weight: '8%',
      render: (value: string) => (
        <span 
          title={value} 
          style={{ 
            display: 'block',
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            whiteSpace: 'nowrap',
            maxWidth: '100%'
          }}
        >
          {value}
        </span>
      ),
    },
    {
      header: 'Type',
      key: 'page_type',
      styles: 'item-cell-landers-type',
      weight: '6%',
      render: (value: string) => (
        <span className={`page-type ${value}`}>
          {value}
        </span>
      ),
    },
    {
      header: 'Lead',
      key: 'became_lead',
      type: TABLE_KEYS.FULL_ROW,
      styles: 'item-cell-landers-lead',
      weight: '5%',
      sortFunction: (a: any, b: any) => {
        // Calcular prioridad de ordenamiento para cada item
        const getPriority = (item: any) => {
          const becameLead = item.became_lead == 1;
          const becameUser = item.became_user == 1;
          
          // Score: 2 → Lead + User, 1 → Solo Lead, 0 → Ninguno
          if (becameLead && becameUser) return 2;
          if (becameLead) return 1;
          return 0;
        };
        
        const priorityA = getPriority(a);
        const priorityB = getPriority(b);
        
        // Ordenar de mayor a menor prioridad (descendente)
        return priorityB - priorityA;
      },
      render: (item: any) => {
        const becameLead = item.became_lead == 1;
        const becameUser = item.became_user == 1;
        
        // Construir tooltip dinámico
        let tooltipText = '';
        if (becameLead && becameUser) {
          tooltipText = 'Convertido a lead y usuario';
        } else if (becameLead) {
          tooltipText = 'Convertido a lead';
        } else if (becameUser) {
          tooltipText = 'Convertido a usuario (sin lead)';
        } else {
          tooltipText = 'No convertido';
        }

        return (
          <div 
            style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              gap: '4px'
            }}
            title={tooltipText}
          >
            {/* Punto para Lead */}
            <span 
              style={{
                display: 'inline-block',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: becameLead ? '#4caf50' : '#999',
              }}
            />
            {/* Punto para User (solo si se convirtió en usuario) */}
            {becameUser && (
              <span 
                style={{
                  display: 'inline-block',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#2196f3',
                }}
              />
            )}
          </div>
        );
      },
    },
    {
      header: 'Email',
      key: 'lead_email',
      styles: 'item-cell-landers-email',
      weight: '10%',
      render: (value: string) => (
        <span 
          title={value || '-'} 
          style={{ 
            display: 'block',
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            whiteSpace: 'nowrap',
            maxWidth: '100%'
          }}
        >
          {value || '-'}
        </span>
      ),
    },
    {
      header: 'Ubicación',
      key: 'location_combined',
      type: TABLE_KEYS.FULL_ROW,
      styles: 'item-cell-landers-location',
      weight: '10%',
      render: (item: any) => {
        // Usar el mismo sistema de banderas CSS que Company Panel
        const countryCode = item.pais_code || '';
        const countryName = item.pais || 'Unknown';
        const hasValidCode = countryCode && countryCode.length >= 2;
        
        // Solo mostrar la ciudad, sin el país
        const locationText = item.ciudad && item.ciudad !== 'unknown' 
          ? item.ciudad.charAt(0).toUpperCase() + item.ciudad.slice(1).toLowerCase()
          : 'unknown';
        
        return (
          <div className="location-info">
            {hasValidCode ? (
              <span
                className={`flag flag-${countryCode.toLowerCase()}`}
                title={`${countryName} (${countryCode})`}
                style={{ cursor: 'help' }}
              />
            ) : (
              <span title={countryName} style={{ cursor: 'help' }}>
                🌍
              </span>
            )}
            <span className="location-text">
              {locationText}
            </span>
          </div>
        );
      },
    },
    {
      header: 'Device & User Agent',
      key: 'device_info',
      type: TABLE_KEYS.FULL_ROW,
      styles: 'item-cell-landers-device',
      weight: '38%',
      render: (item: any) => {
        let deviceInfo;
        if (item.device_class && item.device_os) {
          deviceInfo = {
            deviceClass: item.device_class,
            deviceOs: item.device_os,
          };
        } else {
          deviceInfo = getDeviceInfo(item.ua || '');
        }

        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden', maxWidth: '100%' }}>
            {/* Iconos dispositivo y sistema */}
            <span title={`Dispositivo: ${deviceInfo.deviceClass}`} style={{ flex: '0 0 auto' }}>
              {deviceInfo.deviceClass === 'desk' ? '🖥️' : deviceInfo.deviceClass === 'phone' ? '📱' : '🖥️'}
            </span>
            <span title={`Sistema: ${deviceInfo.deviceOs}`} style={{ flex: '0 0 auto' }}>
              {deviceInfo.deviceOs === 'ios' && '🍎'}
              {deviceInfo.deviceOs === 'android' && '🤖'}
              {deviceInfo.deviceOs === 'windows' && '🪟'}
              {deviceInfo.deviceOs === 'macos' && '🍎'}
              {deviceInfo.deviceOs === 'linux' && '🐧'}
              {deviceInfo.deviceOs === 'unknown' && '❓'}
            </span>
            {/* User-Agent */}
            <span className="ua-text" title={item.ua} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: '1 1 auto' }}>
              {item.ua ? item.ua : '-'}
            </span>
          </div>
        );
      },
    },
    {
      header: 'Fecha',
      key: 'creacion',
      styles: 'item-cell-landers-date',
      weight: '8%',
      render: (value: string) => (
        <span style={{ float: 'right', display: 'block', width: '100%' }}>
          {naturalTimeSpanish(value)}
        </span>
      ),
    },
  ];

  return (
    <div className="card standard">
      <div className="over">
        <div className="body">
          <div className="raw-data-container">
            <div className="raw-data-header">
              <div className="simple-header">
                <div className="header-title">
                  <span className="metric-name">Datos {rawData.length} visitas únicas correspondientes a {getPeriodText(externalPeriod)}</span>
                </div>
              </div>
            </div>
            
            <div className="landers-table-container">
              <Tablev3
                columns={landersColumns}
                rows={rawData}
                showRows={!externalLoading && !internalLoading}
                showSkeleton={externalLoading || internalLoading}
                isNeedSort={true}
                initialSort={Sort.desc}
                initialOrder="id"
                emptyTitle="No hay datos para mostrar"
                emptyInfo="No se encontraron registros de landers para el período seleccionado"
                className="landers-table"
              />
            </div>
            
            <div className="raw-data-footer">
              <div className="footer-left">
                <button 
                  className="refresh-btn"
                  onClick={() => fetchRawData(externalPeriod)}
                  disabled={externalLoading || internalLoading}>
                  🔄 Actualizar datos
                </button>
                <span className="total-records">
                  Total: {rawData.length} visitas únicas
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 