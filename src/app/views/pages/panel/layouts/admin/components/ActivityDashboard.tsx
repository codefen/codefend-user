import React, { type FC, useEffect, useRef, useState, useMemo } from 'react';
import { useGetUserRegistrations } from '@userHooks/admins/useGetUserRegistrations';
import { useUserData } from '#commonUserHooks/useUserData';
import { AxiosHttpService } from '@services/axiosHTTP.service';
import { getDeviceInfo, getOSIcon, getDeviceIcon } from '@utils/deviceDetection';
import { AppleIcon } from '@/app/views/components/icons/AppleIcon';
import { WindowsIcon } from '@/app/views/components/icons/WindowsIcon';
import { AndroidIcon } from '@/app/views/components/icons/AndroidIcon';
import { LinuxIcon } from '@/app/views/components/icons/LinuxIcon';
import * as d3 from 'd3';
import './ActivityLineChart.scss';

interface DailyData {
  fecha: string;
  leads: string;
  usuarios: string;
  companias: string;
  neuroscans: string;
  visitas_unicas: string;
  orders: string;
}

type ChartType = 'line' | 'bar' | 'raw-data';

export const ActivityDashboard: FC = () => {
  const { data: registrations, isLoading, fetchRegistrations } = useGetUserRegistrations();
  const { getCompany } = useUserData();
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 450 });
  const [chartType, setChartType] = useState<ChartType>('raw-data');
  const [rawData, setRawData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<any>({
    total_records: 0,
    total_pages: 0,
    has_next: false,
    has_prev: false,
    limit: 1000,
  });

  // Estado para controlar qué líneas se muestran
  const [visibleMetrics, setVisibleMetrics] = useState({
    leads: true,
    usuarios: true,
    companias: false,
    neuroscans: false,
    visitas_unicas: true,
    orders: true,
  });

  // Colores para cada línea/barra (actualizados según especificación)
  const colors = {
    leads: '#666666', // Gris oscuro
    usuarios: '#ff6464', // Rojo claro
    companias: '#ff3939', // Rojo
    neuroscans: '#ffa502', // Naranja
    visitas_unicas: '#999999', // Gris claro
    orders: '#007bff', // Azul
  };

  // Configuración del gráfico con márgenes adaptativos
  const getMargins = (width: number) => {
    if (width < 500) {
      return { top: 15, right: 20, bottom: 70, left: 40 };
    } else if (width < 800) {
      return { top: 18, right: 30, bottom: 75, left: 50 };
    } else {
      return { top: 20, right: 40, bottom: 80, left: 60 };
    }
  };

  const margin = getMargins(dimensions.width);
  const width = dimensions.width - margin.left - margin.right;
  const height = dimensions.height - margin.top - margin.bottom;

  // Procesar los datos
  const rawProcessedData = registrations
    .map(d => {
      const fechaParts = d.fecha.split('-');
      const year = parseInt(fechaParts[0]);
      const month = parseInt(fechaParts[1]) - 1;
      const day = parseInt(fechaParts[2]);
      const fecha = new Date(year, month, day);

      return {
        fecha,
        leads: parseInt(d.leads) || 0,
        usuarios: parseInt(d.usuarios) || 0,
        companias: parseInt(d.companias) || 0,
        neuroscans: parseInt(d.neuroscans) || 0,
        visitas_unicas: parseInt(d.visitas_unicas) || 0,
        orders: parseInt(d.orders) || 0,
      };
    })
    .sort((a, b) => a.fecha.getTime() - b.fecha.getTime());

  // Función para rellenar fechas faltantes
  const fillMissingDates = (data: any[]) => {
    if (data.length === 0) return [];

    const minDate = new Date(data[0].fecha);
    const maxDate = new Date(data[data.length - 1].fecha);
    const filledData = [];

    const dataMap = new Map();
    data.forEach(d => {
      const dateKey = d.fecha.toISOString().split('T')[0];
      dataMap.set(dateKey, d);
    });

    for (let d = new Date(minDate); d <= maxDate; d.setDate(d.getDate() + 1)) {
      const dateKey = d.toISOString().split('T')[0];
      const existingData = dataMap.get(dateKey);

      if (existingData) {
        filledData.push(existingData);
      } else {
        filledData.push({
          fecha: new Date(d),
          leads: 0,
          usuarios: 0,
          companias: 0,
          neuroscans: 0,
          visitas_unicas: 0,
          orders: 0,
        });
      }
    }

    return filledData;
  };

  const processedData = useMemo(() => {
    return fillMissingDates(rawProcessedData);
  }, [JSON.stringify(rawProcessedData)]);

  // Función para obtener nombres amigables de las métricas
  const getMetricDisplayName = (metric: string) => {
    const displayNames: { [key: string]: string } = {
      visitas_unicas: 'unique views',
      leads: 'leads',
      usuarios: 'usuarios',
      orders: 'orders',
      companias: 'compañías',
      neuroscans: 'neuroscans',
    };
    return displayNames[metric] || metric;
  };

  // Función para toggle de visibilidad de métricas
  const toggleMetricVisibility = (metric: keyof typeof visibleMetrics) => {
    setVisibleMetrics(prev => ({
      ...prev,
      [metric]: !prev[metric],
    }));
  };

  // Función para renderizar gráfico de líneas
  const renderLineChart = () => {
    if (!registrations.length || !svgRef.current || width <= 0 || height <= 0) return;

    const svg = d3.select(svgRef.current);
    const g = svg.select('g.chart-container');

    // Escalas
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(processedData, (d: any) => d.fecha) as [Date, Date])
      .range([0, width]);

    const maxValue =
      d3.max(processedData, (d: any) => Math.max(d.leads, d.usuarios, d.companias, d.neuroscans, d.visitas_unicas, d.orders)) ||
      0;

    const effectiveMaxValue = maxValue === 0 ? 10 : maxValue;

    const yScale = d3
      .scaleLinear()
      .domain([0, effectiveMaxValue * 1.1])
      .range([height, 0]);

    // Definir generador de áreas
    const area = d3
      .area<any>()
      .x(d => xScale(d.fecha))
      .y0(height)
      .y1(d => yScale(Math.max(0, d.value))) // Asegurar que no vaya por debajo de 0
      .curve(d3.curveCardinal.tension(0.5))
      .defined(d => d.value !== null && d.value !== undefined);

    // Líneas
    const line = d3
      .line<any>()
      .x(d => xScale(d.fecha))
      .y(d => yScale(Math.max(0, d.value))) // Asegurar que no vaya por debajo de 0
      .curve(d3.curveCardinal.tension(0.5))
      .defined(d => d.value !== null && d.value !== undefined);

    // Crear las áreas y líneas para cada métrica
    // Orden: visitas_unicas (atrás) -> leads -> usuarios -> orders (adelante)
    // Variables adicionales: companias, neuroscans (no visibles por defecto)
    const metrics = ['visitas_unicas', 'leads', 'usuarios', 'orders', 'companias', 'neuroscans'];

    metrics.forEach(metric => {
      const isVisible = visibleMetrics[metric as keyof typeof visibleMetrics];

      if (!isVisible) return;

      const lineData = processedData.map((d: any) => ({
        fecha: d.fecha,
        value: d[metric as keyof typeof d],
      }));

      const hasData = lineData.some((d: any) => typeof d.value === 'number' && d.value > 0);
      const hasAnyData = lineData.some((d: any) => typeof d.value === 'number' && d.value >= 0);

      if (hasAnyData) {
        // Área bajo la línea con gradiente
        g.append('path')
          .datum(lineData)
          .attr('class', `area-${metric}`)
          .attr('fill', `url(#gradient-${metric})`)
          .attr('stroke', 'none')
          .attr('d', area);

        // Línea principal
        const strokeWidth = hasData ? 2.5 : 1.5;
        const opacity = hasData ? 0.9 : 0.4;

        g.append('path')
          .datum(lineData)
          .attr('class', `line-${metric}`)
          .attr('fill', 'none')
          .attr('stroke', colors[metric as keyof typeof colors])
          .attr('stroke-width', strokeWidth)
          .attr('opacity', opacity)
          .attr('stroke-dasharray', hasData ? 'none' : '5,5')
          .attr('d', line);

        // Puntos
        g.selectAll(`.dot-${metric}`)
          .data(processedData)
          .enter()
          .append('circle')
          .attr('class', `dot-${metric}`)
          .attr('cx', (d: any) => xScale(d.fecha))
          .attr('cy', (d: any) => yScale(Math.max(0, d[metric as keyof typeof d] as number)))
          .attr('r', (d: any) => {
            const value = d[metric as keyof typeof d];
            return typeof value === 'number' && value > 0 ? 5 : 2;
          })
          .attr('fill', colors[metric as keyof typeof colors])
          .attr('stroke', '#fff')
          .attr('stroke-width', (d: any) => {
            const value = d[metric as keyof typeof d];
            return typeof value === 'number' && value > 0 ? 2 : 1;
          })
          .style('opacity', (d: any) => {
            const value = d[metric as keyof typeof d];
            return typeof value === 'number' && value > 0 ? 0.9 : 0.3;
          })
          .on('mouseover', function (event, d: any) {
            showTooltip(event, d, metric);
            const fechaHover = d.fecha;
            const fechaStr = fechaHover.toISOString().split('T')[0];
            const allMetrics = ['visitas_unicas', 'leads', 'usuarios', 'orders', 'companias', 'neuroscans'];
            allMetrics.forEach(currentMetric => {
              const isMetricVisible = visibleMetrics[currentMetric as keyof typeof visibleMetrics];
              if (isMetricVisible) {
                g.selectAll(`.dot-${currentMetric}`)
                  .filter((dotData: any) => {
                    const dotFechaStr = dotData.fecha.toISOString().split('T')[0];
                    return dotFechaStr === fechaStr;
                  })
                  .transition()
                  .duration(100)
                  .attr('r', 8)
                  .style('opacity', 1);
              }
            });
          })
          .on('mouseout', function (event, d: any) {
            hideTooltip();
            const fechaHover = d.fecha;
            const fechaStr = fechaHover.toISOString().split('T')[0];
            const allMetrics = ['visitas_unicas', 'leads', 'usuarios', 'orders', 'companias', 'neuroscans'];
            allMetrics.forEach(currentMetric => {
              const isMetricVisible = visibleMetrics[currentMetric as keyof typeof visibleMetrics];
              if (isMetricVisible) {
                g.selectAll(`.dot-${currentMetric}`)
                  .filter((dotData: any) => {
                    const dotFechaStr = dotData.fecha.toISOString().split('T')[0];
                    return dotFechaStr === fechaStr;
                  })
                  .transition()
                  .duration(100)
                  .attr('r', (dotData: any) => {
                    const value = dotData[currentMetric as keyof typeof dotData];
                    return typeof value === 'number' && value > 0 ? 5 : 2;
                  })
                  .style('opacity', (dotData: any) => {
                    const value = dotData[currentMetric as keyof typeof dotData];
                    return typeof value === 'number' && value > 0 ? 0.9 : 0.3;
                  });
              }
            });
          });
      }
    });

    // Actualizar ejes
    updateAxes(xScale, yScale, g);
  };

  // Función para renderizar gráfico de barras
  const renderBarChart = () => {
    if (!registrations.length || !svgRef.current || width <= 0 || height <= 0) return;

    const svg = d3.select(svgRef.current);
    const g = svg.select('g.chart-container');

    const formattedData = processedData.map((d: any) => ({
      date: d.fecha,
      leads: d.leads,
      usuarios: d.usuarios,
      companias: d.companias,
      neuroscans: d.neuroscans,
      visitas_unicas: d.visitas_unicas,
      orders: d.orders,
    }));

    // Orden de barras: visitas_unicas -> leads -> usuarios -> orders -> companias -> neuroscans
    const metrics = ['visitas_unicas', 'leads', 'usuarios', 'orders', 'companias', 'neuroscans'];
    const visibleMetricsArray = metrics.filter(
      metric => visibleMetrics[metric as keyof typeof visibleMetrics]
    );

    const dateLabels = formattedData.map((d: any) => d3.timeFormat('%d')(d.date));

    const xScale = d3.scaleBand().domain(dateLabels).range([0, width]).padding(0.2);

    const maxValue =
      d3.max(formattedData, (d: any) => Math.max(d.leads, d.usuarios, d.companias, d.neuroscans, d.visitas_unicas, d.orders)) ||
      0;

    const effectiveMaxValue = maxValue === 0 ? 10 : maxValue;

    const yScale = d3
      .scaleLinear()
      .domain([0, effectiveMaxValue * 1.1])
      .range([height, 0]);

    const xSubgroup = d3
      .scaleBand()
      .domain(visibleMetricsArray)
      .range([0, xScale.bandwidth()])
      .padding(0.05);

    const groups = g
      .selectAll('.bar-group')
      .data(formattedData)
      .enter()
      .append('g')
      .attr('class', 'bar-group')
      .attr('transform', (d: any) => `translate(${xScale(d3.timeFormat('%d')(d.date)) || 0},0)`);

    visibleMetricsArray.forEach(metric => {
      groups
        .append('rect')
        .attr('class', `bar-${metric}`)
        .attr('x', xSubgroup(metric) || 0)
        .attr('y', (d: any) => yScale(d[metric as keyof typeof d] as number))
        .attr('width', xSubgroup.bandwidth())
        .attr('height', (d: any) => height - yScale(d[metric as keyof typeof d] as number))
        .attr('fill', colors[metric as keyof typeof colors])
        .attr('opacity', 0.8)
        .on('mouseover', function (event, d: any) {
          showTooltip(event, d, metric);
          d3.select(this).transition().duration(100).attr('opacity', 1);
        })
        .on('mouseout', function () {
          hideTooltip();
          d3.select(this).transition().duration(100).attr('opacity', 0.8);
        });
    });

    updateAxes(xScale, yScale, g);
  };

  // Función para mostrar tooltip
  const showTooltip = (event: any, d: any, metric: string) => {
    const tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'chart-tooltip')
      .style('position', 'absolute')
      .style('background', 'rgba(0, 0, 0, 0.8)')
      .style('color', 'white')
      .style('padding', '8px 12px')
      .style('border-radius', '4px')
      .style('font-size', '12px')
      .style('pointer-events', 'none')
      .style('z-index', '1000')
      .style('opacity', 0);

    tooltip.transition().duration(200).style('opacity', 1);

    const displayName = getMetricDisplayName(metric);
    const value = d[metric as keyof typeof d];
    const fechaRaw = d.fecha || d.date;

    const fechaOriginalBackend =
      registrations.find(originalData => {
        const fechaComparacion = new Date(originalData.fecha);
        const fechaActual = fechaRaw;
        return fechaComparacion.getTime() === fechaActual.getTime();
      })?.fecha || fechaRaw.toISOString().split('T')[0];

    tooltip
      .html(
        `
      <strong>${displayName}</strong><br/>
      Fecha: ${fechaOriginalBackend}<br/>
      Valor: ${value}
    `
      )
      .style('left', event.pageX + 10 + 'px')
      .style('top', event.pageY - 10 + 'px');
  };

  // Función para ocultar tooltip
  const hideTooltip = () => {
    d3.selectAll('.chart-tooltip').remove();
  };

  // Función para actualizar ejes
  const updateAxes = (xScale: any, yScale: any, g: any) => {
    g.selectAll('.axis').remove();
    g.selectAll('.grid').remove();

    // Grid lines
    const xGrid = g
      .append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(0,${height})`)
      .call(
        d3
          .axisBottom(xScale)
          .tickSize(-height)
          .tickFormat(() => '')
      );

    xGrid
      .selectAll('line')
      .style('stroke', '#e9ecef')
      .style('stroke-width', 1)
      .style('opacity', 0.7);

    const yGrid = g
      .append('g')
      .attr('class', 'grid')
      .call(
        d3
          .axisLeft(yScale)
          .tickSize(-width)
          .tickFormat(() => '')
      );

    yGrid
      .selectAll('line')
      .style('stroke', '#e9ecef')
      .style('stroke-width', 1)
      .style('opacity', 0.7);

    // Ejes
    const xAxis = g
      .append('g')
      .attr('class', 'axis x-axis')
      .attr('transform', `translate(0,${height})`)
      .call(
        d3
          .axisBottom(xScale)
          .tickFormat(
            chartType === 'line'
              ? (domainValue: any) => d3.timeFormat('%d')(domainValue)
              : (domainValue: any) => domainValue
          )
          .ticks(chartType === 'line' ? processedData.length : undefined)
      );

    xAxis
      .selectAll('text')
      .style('font-size', '12px')
      .style('fill', '#6c757d')
      .style('text-anchor', 'middle')
      .attr('transform', 'rotate(0)');

    g.append('g')
      .attr('class', 'axis y-axis')
      .call(d3.axisLeft(yScale))
      .selectAll('text')
      .style('font-size', '12px')
      .style('fill', '#6c757d');
  };

  // Función para obtener datos raw de landers
  const fetchRawData = async (page: number = 1) => {
    try {
      console.log('🔍 Fetching raw landers data...', { page, company: getCompany() });
      
      const response = await AxiosHttpService.getInstance().post<any>({
        path: 'admin/raw-landers',
        body: { 
          company_id: getCompany(),
          page: page.toString(),
          limit: '1000'
        },
        requireSession: true,
      });
      
      const data = response.data;
      console.log('📊 Raw Landers API Response:', data);
      
      if (data.error === '0') {
        setRawData(data.landers || []);
        setPagination(data.pagination || {});
        setCurrentPage(page);
        console.log('✅ Raw data loaded successfully:', data.landers?.length, 'records');
      } else {
        console.error('❌ API Error:', data.info);
        setRawData([]);
        alert(`Error loading data: ${data.info}`);
      }
    } catch (error) {
      console.error('❌ Network Error fetching raw data:', error);
      setRawData([]);
      alert('Network error loading data. Please check your connection.');
    }
  };

  // Cargar datos automáticamente al montar el componente
  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  // Cargar datos raw cuando se selecciona la pestaña
  useEffect(() => {
    if (chartType === 'raw-data') {
      fetchRawData(1); // Empezar en la página 1
    }
  }, [chartType]);

  // Funciones de navegación
  const handlePageChange = (page: number) => {
    fetchRawData(page);
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
        target.value = ''; // Limpiar input
      }
    }
  };

  // Renderizar gráfico
  useEffect(() => {
    if (!registrations.length || !svgRef.current || width <= 0 || height <= 0) return;
    if (chartType !== 'line' && chartType !== 'bar' && chartType !== 'raw-data') return;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3
      .select(svgRef.current)
      .attr('width', dimensions.width)
      .attr('height', dimensions.height);

    // Crear definiciones de gradientes para cada métrica
    const defs = svg.append('defs');
    
    // Crear gradientes para cada métrica
    const gradientMetrics = ['visitas_unicas', 'leads', 'usuarios', 'orders', 'companias', 'neuroscans'];
    gradientMetrics.forEach(metric => {
      const gradient = defs
        .append('linearGradient')
        .attr('id', `gradient-${metric}`)
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '0%')
        .attr('y2', '100%');

      // Color base de la métrica
      const baseColor = colors[metric as keyof typeof colors];
      
      // Crear color más claro para el gradiente
      const lighterColor = d3.color(baseColor)?.brighter(0.8)?.toString() || baseColor;
      
      // Agregar stops del gradiente para efecto suave
      gradient
        .append('stop')
        .attr('offset', '0%')
        .attr('stop-color', baseColor)
        .attr('stop-opacity', 0.4);

      gradient
        .append('stop')
        .attr('offset', '30%')
        .attr('stop-color', lighterColor)
        .attr('stop-opacity', 0.25);

      gradient
        .append('stop')
        .attr('offset', '70%')
        .attr('stop-color', lighterColor)
        .attr('stop-opacity', 0.15);

      gradient
        .append('stop')
        .attr('offset', '100%')
        .attr('stop-color', lighterColor)
        .attr('stop-opacity', 0.05);
    });

    const g = svg
      .append('g')
      .attr('class', 'chart-container')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    if (chartType === 'line' || chartType === 'raw-data') {
      renderLineChart();
    } else {
      renderBarChart();
    }

    // Leyenda clickeable con checkboxes
    const legend = g
      .append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(0, ${height + 50})`);

    // Orden de la leyenda: visitas_unicas -> leads -> usuarios -> orders -> companias -> neuroscans
    const metrics = ['visitas_unicas', 'leads', 'usuarios', 'orders', 'companias', 'neuroscans'];

    metrics.forEach((metric, index) => {
      const isVisible = visibleMetrics[metric as keyof typeof visibleMetrics];

      const legendItem = legend
        .append('g')
        .attr('class', 'legend-item')
        .attr('transform', `translate(${index * 120}, 0)`)
        .style('cursor', 'pointer')
        .on('click', () => toggleMetricVisibility(metric as keyof typeof visibleMetrics));

      const checkboxSize = 16;
      const checkbox = legendItem
        .append('rect')
        .attr('x', 0)
        .attr('y', -8)
        .attr('width', checkboxSize)
        .attr('height', checkboxSize)
        .attr('rx', 2)
        .attr('fill', isVisible ? colors[metric as keyof typeof colors] : 'transparent')
        .attr('stroke', colors[metric as keyof typeof colors])
        .attr('stroke-width', 2);

      if (isVisible) {
        legendItem
          .append('path')
          .attr('d', 'M3,8 L7,12 L13,4') // Ajustado para centrar mejor en el checkbox de 16x16
          .attr('stroke', '#fff')
          .attr('stroke-width', 2)
          .attr('fill', 'none')
          .attr('stroke-linecap', 'round')
          .attr('stroke-linejoin', 'round');
      }

      legendItem
        .append('text')
        .attr('x', checkboxSize + 8)
        .attr('y', 0)
        .attr('dy', '0.35em')
        .style('font-size', '12px')
        .style('fill', isVisible ? '#495057' : '#999')
        .style('font-weight', '500')
        .style('user-select', 'none')
        .text(getMetricDisplayName(metric));
    });
  }, [registrations, dimensions, chartType, visibleMetrics]);

  // Sistema de resize automático
  useEffect(() => {
    let resizeTimeout: ReturnType<typeof setTimeout>;

    const updateDimensions = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const newWidth = Math.max(containerWidth - 40, 300);
        const newHeight = Math.max(Math.min(newWidth * 0.6, 500), 350);

        setDimensions(prev => {
          if (Math.abs(prev.width - newWidth) > 10 || Math.abs(prev.height - newHeight) > 10) {
            return { width: newWidth, height: newHeight };
          }
          return prev;
        });
      }
    };

    const debouncedUpdate = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateDimensions, 100);
    };

    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        requestAnimationFrame(debouncedUpdate);
      }
    });

    const handleWindowResize = () => {
      requestAnimationFrame(debouncedUpdate);
    };

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener('resize', handleWindowResize);
    updateDimensions();

    return () => {
      clearTimeout(resizeTimeout);
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="card standard">
        <div className="over">
          <div className="body">
            <div className="chart-header">
              <h2 className="table-title">Actividad diaria</h2>
              <p>Actividad de leads, usuarios, compañías y scans (últimos 30 días)</p>
            </div>
            <div className="loading">
              <p>Cargando datos...</p>
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
              <h2 className="table-title">Actividad diaria</h2>
              <p>Actividad de leads, usuarios, compañías y scans (últimos 30 días)</p>
            </div>
            <div className="chart-placeholder">
              <p>No hay datos para mostrar en el gráfico</p>
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
            <h2 className="table-title">Actividad diaria</h2>
            <p>Actividad de unique views, leads, usuarios y orders (últimos 30 días)</p>
          </div>
          
          {/* Controles del gráfico */}
          <div className="chart-controls">
            <button
              className={`chart-toggle-btn ${chartType === 'line' ? 'active' : ''}`}
              onClick={() => setChartType('line')}>
              📈 Líneas
            </button>
            <button
              className={`chart-toggle-btn ${chartType === 'bar' ? 'active' : ''}`}
              onClick={() => setChartType('bar')}>
              📊 Barras
            </button>
            <button
              className={`chart-toggle-btn ${chartType === 'raw-data' ? 'active' : ''}`}
              onClick={() => setChartType('raw-data')}>
              📈📋 Análisis completo
            </button>
          </div>
          
          {/* Contenedor del gráfico o tabla */}
          {chartType === 'raw-data' ? (
            <div className="raw-data-container">
              {/* Gráfico de líneas integrado */}
              <div className="activity-chart-container" ref={containerRef} style={{ marginBottom: '2rem' }}>
                <svg ref={svgRef}></svg>
              </div>
              
              <div className="raw-data-header">
                <h3>Datos de visitas (tabla landers)</h3>
                <p>Registros de visitas a páginas de signup/signin - {pagination.total_records} total</p>
                <div className="pagination-info">
                  <span>Página {currentPage} de {pagination.total_pages} ({pagination.limit} registros por página)</span>
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
                          // 🔥 PRIORIDAD: Usar datos del backend si existen, sino detectar en frontend
                          let deviceInfo;
                          if (item.device_class && item.device_os) {
                            // Usar datos del backend
                            deviceInfo = {
                              deviceClass: item.device_class,
                              deviceOs: item.device_os,
                              deviceIcon: getDeviceIcon(item.device_class), // ✅ Función flexible
                              osIcon: getOSIcon(item.device_os)            // ✅ Función flexible
                            };
                          } else {
                            // Fallback: detectar en frontend
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
                                      {deviceInfo.deviceIcon}
                                    </span>
                                    {deviceInfo.deviceOs === 'ios' && (
                                      <AppleIcon size="14px" color="var(--text-color-secondary)" className="os-icon apple" title="iOS (Apple)" />
                                    )}
                                    {deviceInfo.deviceOs === 'android' && (
                                      <AndroidIcon size="14px" color="var(--text-color-secondary)" className="os-icon android" title="Android" />
                                    )}
                                    {deviceInfo.deviceOs === 'windows' && (
                                      <WindowsIcon size="14px" color="var(--text-color-secondary)" className="os-icon windows" title="Windows" />
                                    )}
                                    {deviceInfo.deviceOs === 'macos' && (
                                      <AppleIcon size="14px" color="var(--text-color-secondary)" className="os-icon macos" title="macOS" />
                                    )}
                                    {deviceInfo.deviceOs === 'linux' && (
                                      <LinuxIcon size="14px" color="var(--text-color-secondary)" className="os-icon linux" title="Linux" />
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
                    onClick={() => fetchRawData(currentPage)}>
                    🔄 Actualizar datos
                  </button>
                  <span className="total-records">
                    Mostrando: {rawData.length} de {pagination.total_records} registros
                  </span>
                </div>
                <div className="pagination-controls">
                  <button className="pagination-btn" onClick={handleFirstPage} disabled={!pagination.has_prev}>⏮️ Primera</button>
                  <button className="pagination-btn" onClick={handlePrevPage} disabled={!pagination.has_prev}>◀️ Anterior</button>
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
                  />
                  <button className="pagination-btn" onClick={handleNextPage} disabled={!pagination.has_next}>Siguiente ▶️</button>
                  <button className="pagination-btn" onClick={handleLastPage} disabled={!pagination.has_next}>Última ⏭️</button>
                </div>
              </div>
            </div>
          ) : (
          <div className="activity-chart-container" ref={containerRef}>
            <svg ref={svgRef}></svg>
          </div>
          )}
        </div>
      </div>
    </div>
  );
}; 