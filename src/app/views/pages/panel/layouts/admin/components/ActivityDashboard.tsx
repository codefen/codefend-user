import { type FC, useRef, useEffect, useState } from 'react';
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

type TimePeriod = 'today' | 'week';

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
  const getPeriodText = (period: TimePeriod) => {
    return period === 'today' ? 'hoy' : 'últimos 7 días';
  };

  return (
    <div className="card standard metrics-card">
      <div className="over">
        <div className="body">
          <div className="activity-summary">
            <div className="metrics-header">
              <h3>Actividad ({getPeriodText(currentPeriod)})</h3>
              <PeriodSelector 
                currentPeriod={currentPeriod}
                onPeriodChange={onPeriodChange}
                isLoading={isLoading}
              />
            </div>
            <div className="metrics-grid">
              <div className="metric-item">
                <span className="metric-label">leads</span>
                <span className="metric-value">{totals.leads}</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">usuarios</span>
                <span className="metric-value">{totals.usuarios}</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">órdenes</span>
                <span className="metric-value">{totals.orders}</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">issues vistos</span>
                <span className="metric-value">{totals.issues_vistos}</span>
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
export const DataTableSection: FC = () => {
  const { getCompany } = useUserData();
  const [rawData, setRawData] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPeriod, setCurrentPeriod] = useState<TimePeriod>('today');
  const [isLoading, setIsLoading] = useState(false);

  // Función para obtener datos raw de landers
  const fetchRawData = async (page: number = 1, period: TimePeriod = currentPeriod) => {
    setIsLoading(true);
    try {
      const response = await AxiosHttpService.getInstance().post<any>({
        path: 'admin/raw-landers',
        body: { 
          company_id: getCompany(),
          page: page.toString(),
          limit: '1000',
          period: period
        },
        requireSession: true,
      });
      
      const data = response.data;
      
      if (data.error === '0') {
        setRawData(data.landers || []);
        setPagination(data.pagination || {});
        setCurrentPage(page);
        setCurrentPeriod(period);
      } else {
        setRawData([]);
        alert(`Error loading data: ${data.info}`);
      }
    } catch (error) {
      setRawData([]);
      alert('Network error loading data. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRawData(1, 'today'); // Por defecto cargar solo el día de hoy
  }, []);

  // Manejar cambio de período
  const handlePeriodChange = (period: TimePeriod) => {
    fetchRawData(1, period);
  };

  const getPeriodText = (period: TimePeriod) => {
    const today = new Date().toLocaleDateString('es-ES');
    return period === 'today' ? `hoy (${today})` : 'últimos 7 días';
  };

  // Funciones de navegación
  const handlePageChange = (page: number) => {
    fetchRawData(page, currentPeriod);
  };

  const handleNextPage = () => {
    if (pagination.has_next) {
      handlePageChange(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (pagination.has_prev) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleFirstPage = () => {
    handlePageChange(1);
  };

  const handleLastPage = () => {
    handlePageChange(pagination.total_pages);
  };

  const handlePageJump = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const target = e.target as HTMLInputElement;
      const page = parseInt(target.value);
      if (page >= 1 && page <= pagination.total_pages) {
        handlePageChange(page);
        target.value = '';
      }
    }
  };

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
                  <h3>Datos de visitas / landers</h3>
                  <p>
                    {rawData.length} registros correspondientes a {getPeriodText(currentPeriod)} de un total de {pagination.total_records || 0} registros
                  </p>
                </div>
                <PeriodSelector 
                  currentPeriod={currentPeriod}
                  onPeriodChange={handlePeriodChange}
                  isLoading={isLoading}
                />
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
                  onClick={() => fetchRawData(currentPage, currentPeriod)}
                  disabled={isLoading}>
                  🔄 Actualizar datos
                </button>
                <span className="total-records">
                  Página {currentPage} de {pagination.total_pages}
                </span>
              </div>
              <div className="pagination-controls">
                <button className="pagination-btn" onClick={handleFirstPage} disabled={!pagination.has_prev || isLoading}>⏮️ Primera</button>
                <button className="pagination-btn" onClick={handlePrevPage} disabled={!pagination.has_prev || isLoading}>◀️ Anterior</button>
                <span className="page-indicator">
                  {currentPage} / {pagination.total_pages}
                </span>
                <input
                  type="number"
                  className="page-jump-input"
                  placeholder={`Ir a página (1-${pagination.total_pages})`}
                  min="1"
                  max={pagination.total_pages}
                  onKeyDown={handlePageJump}
                  disabled={isLoading}
                />
                <button className="pagination-btn" onClick={handleNextPage} disabled={!pagination.has_next || isLoading}>Siguiente ▶️</button>
                <button className="pagination-btn" onClick={handleLastPage} disabled={!pagination.has_next || isLoading}>Última ⏭️</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 