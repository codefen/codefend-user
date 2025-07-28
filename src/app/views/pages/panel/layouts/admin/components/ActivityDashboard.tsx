import { type FC, useRef, useEffect, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { useGetUserRegistrations } from '@userHooks/admins/useGetUserRegistrations';
import { useUserData } from '#commonUserHooks/useUserData';
import { AxiosHttpService } from '@/app/data/services/axiosHTTP.service';
import './ActivityLineChart.scss';
import { DesktopIcon } from '@/app/views/components/icons/DesktopIcon';
import { MobileIcon } from '@/app/views/components/icons/MobileIcon';
import { AppleIcon } from '@/app/views/components/icons/AppleIcon';
import { AndroidIcon } from '@/app/views/components/icons/AndroidIcon';
import { WindowsIcon } from '@/app/views/components/icons/WindowsIcon';
import { LinuxIcon } from '@/app/views/components/icons/LinuxIcon';

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
                <div className="metric-bold-text">
                  <strong>Personas que finalizaron la creación de usuario!</strong>
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
      leads: '#ff6b6b',
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
    const mobileKeywords = ['Mobile', 'Android', 'iPhone', 'iPad', 'BlackBerry', 'Windows Phone'];
    const isMobile = mobileKeywords.some(keyword => userAgent.includes(keyword));
    
    let deviceOs = 'unknown';
    if (userAgent.includes('Windows')) deviceOs = 'windows';
    else if (userAgent.includes('Mac')) deviceOs = 'macos';
    else if (userAgent.includes('Linux')) deviceOs = 'linux';
    else if (userAgent.includes('Android')) deviceOs = 'android';
    else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) deviceOs = 'ios';
    
    return {
      deviceClass: isMobile ? 'phone' : 'desk',
      deviceOs: deviceOs,
      deviceIcon: isMobile ? '📱' : '💻',
      osIcon: deviceOs
    };
  };

  return (
    <div className="card standard">
      <div className="over">
        <div className="body">
          <div className="raw-data-container">
            <div className="raw-data-header">
              <div className="simple-header">
                <div className="header-title">
                  <h3>Datos de visitas únicas / landers</h3>
                  <p>
                    {rawData.length} visitas únicas correspondientes a {getPeriodText(externalPeriod)}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="raw-data-table-container">
              <table className="raw-data-table">
                <thead>
                  <tr>
                    <th style={{width: '60px'}}>ID</th>
                    <th style={{width: '130px'}}>IP Address</th>
                    <th style={{width: '80px'}}>Type</th>
                    <th style={{width: '80px'}}>Lead</th>
                    <th style={{width: '200px'}}>Lead Email</th>
                    <th style={{width: '180px'}}>Ubicación</th>
                    <th style={{width: '400px'}}>Device & User Agent</th>
                    <th style={{width: '140px'}}>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {rawData.length > 0 ? (
                    rawData.map((item: any) => {
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
                        <tr key={item.id}>
                          <td>{item.id}</td>
                          <td className="ip-address">{item.ip_address}</td>
                          <td>
                            <span className={`page-type ${item.page_type}`}>
                              {item.page_type}
                            </span>
                          </td>
                          <td>
                            <span className={`conversion-status ${item.became_lead == 1 ? 'converted' : 'not-converted'}`}>
                              {item.became_lead == 1 ? '✅' : '❌'}
                            </span>
                          </td>
                          <td className="lead-email">
                            {item.became_lead == 1 && item.lead_email ? (
                              <span title={`Convertido: ${new Date(item.lead_created_at).toLocaleString('es-ES')}`}>
                                {item.lead_email}
                              </span>
                            ) : '-'}
                          </td>
                          <td className="location-cell">
                            <div className="location-info">
                              <span 
                                className={`flag flag-${(item.pais_code || 'xx').toLowerCase()}`}
                                title={`${item.pais || 'Unknown country'} (${item.pais_code || 'XX'})`}>
                              </span>
                              <div className="location-text">
                                <div className="city">{item.ciudad || 'Unknown location'}</div>
                              </div>
                            </div>
                          </td>
                          <td className="user-agent-enhanced">
                            <div className="device-info">
                              <div className="device-icons">
                                <span className="device-icon" title={`Dispositivo: ${deviceInfo.deviceClass}`}>
                                  {deviceInfo.deviceClass === 'desk' ? (
                                    <DesktopIcon />
                                  ) : deviceInfo.deviceClass === 'phone' ? (
                                    <MobileIcon />
                                  ) : (
                                    deviceInfo.deviceIcon
                                  )}
                                </span>
                                {deviceInfo.deviceOs === 'ios' && (
                                  <AppleIcon />
                                )}
                                {deviceInfo.deviceOs === 'android' && (
                                  <AndroidIcon />
                                )}
                                {deviceInfo.deviceOs === 'windows' && (
                                  <WindowsIcon />
                                )}
                                {deviceInfo.deviceOs === 'macos' && (
                                  <AppleIcon />
                                )}
                                {deviceInfo.deviceOs === 'linux' && (
                                  <LinuxIcon />
                                )}
                              </div>
                              <div className="ua-text" title={item.ua}>
                                {item.ua ? item.ua.substring(0, 80) + '...' : '-'}
                              </div>
                            </div>
                          </td>
                          <td className="created-date">
                            {new Date(item.creacion).toLocaleString('es-ES', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={8} className="no-data">
                        No hay datos para mostrar
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
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