import { useEffect, useRef, useState, useMemo } from 'react';
import type { FC } from 'react';
import * as d3 from 'd3';
import './ActivityLineChart.scss';

interface DailyData {
  fecha: string;
  leads: string;
  usuarios: string;
  companias: string;
  neuroscans: string;
  visitas_unicas: string;
}

interface ActivityLineChartProps {
  data: DailyData[];
  currentPeriod?: 'today' | 'week';
  onPeriodChange?: (period: 'today' | 'week') => void;
  isLoading?: boolean;
  chartType?: ChartType;
  visibleMetrics?: {
    visitas_unicas: boolean;
    leads: boolean;
    usuarios: boolean;
  };
}

type ChartType = 'line' | 'bar';
type TimePeriod = 'today' | 'week';

export const ActivityLineChart: FC<ActivityLineChartProps> = ({ 
  data, 
  currentPeriod = 'today', 
  onPeriodChange,
  isLoading = false,
  chartType = 'line',
  visibleMetrics = {
    visitas_unicas: true,
    leads: true,
    usuarios: true,
  }
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 280 });

      // Configuración del gráfico con márgenes mínimos - elementos flotantes no ocupan espacio
  const getMargins = (width: number) => {
    if (width < 500) {
      // Móvil: márgenes ultra mínimos
      return { top: 5, right: 5, bottom: 25, left: 30 };
    } else if (width < 800) {
      // Tablet: márgenes mínimos
      return { top: 5, right: 10, bottom: 30, left: 35 };
    } else {
      // Desktop: márgenes mínimos - elementos completamente flotantes
      return { top: 5, right: 15, bottom: 35, left: 45 };
    }
  };

  const margin = getMargins(dimensions.width);
  const width = dimensions.width - margin.left - margin.right;
  const height = dimensions.height - margin.top - margin.bottom;

  // Colores para cada línea/barra (actualizados según especificación)
  const colors = {
    visitas_unicas: '#999999', // Gris claro
    leads: '#666666', // Gris oscuro
    usuarios: '#ff6464', // Rojo claro
  };

  // Procesar los datos - FIX: crear fecha sin zona horaria para evitar desfase
  const rawProcessedData = data
    .map(d => {
      // Crear fecha directamente sin zona horaria
      const fechaParts = d.fecha.split('-');
      const year = parseInt(fechaParts[0]);
      const month = parseInt(fechaParts[1]) - 1; // Los meses en JS van de 0-11
      const day = parseInt(fechaParts[2]);
      const fecha = new Date(year, month, day);

      return {
        fecha,
        leads: parseInt(d.leads) || 0,
        usuarios: parseInt(d.usuarios) || 0,
        companias: parseInt(d.companias) || 0,
        neuroscans: parseInt(d.neuroscans) || 0,
        visitas_unicas: parseInt(d.visitas_unicas) || 0,
      };
    })
    .sort((a, b) => a.fecha.getTime() - b.fecha.getTime());

  // Función para rellenar fechas faltantes (para que ambos gráficos tengan las mismas fechas)
  const fillMissingDates = (data: any[]) => {
    if (data.length === 0) return [];

    const minDate = new Date(data[0].fecha);
    const maxDate = new Date(data[data.length - 1].fecha);
    const filledData = [];

    // Crear un mapa para acceso rápido a los datos existentes
    const dataMap = new Map();
    data.forEach(d => {
      const dateKey = d.fecha.toISOString().split('T')[0];
      dataMap.set(dateKey, d);
    });

    // Rellenar todas las fechas en el rango
    for (let d = new Date(minDate); d <= maxDate; d.setDate(d.getDate() + 1)) {
      const dateKey = d.toISOString().split('T')[0];
      const existingData = dataMap.get(dateKey);

      if (existingData) {
        filledData.push(existingData);
      } else {
        // Crear entrada con ceros para fechas faltantes
        filledData.push({
          fecha: new Date(d),
          leads: 0,
          usuarios: 0,
          companias: 0,
          neuroscans: 0,
          visitas_unicas: 0,
        });
      }
    }

    return filledData;
  };

  // AMBOS gráficos usan fechas rellenadas para mostrar todos los días del rango
  const processedData = useMemo(() => {
    const filled = fillMissingDates(rawProcessedData);
    // console.log('🔄 Datos rellenados para AMBOS gráficos:', filled.length, 'puntos');
    // console.log('🔄 Datos originales:', rawProcessedData.length, 'puntos');
    // console.log(
    //   '🔄 Fechas agregadas:',
    //   filled.length - rawProcessedData.length,
    //   'fechas faltantes'
    // );
    return filled;
  }, [JSON.stringify(rawProcessedData)]);

  // 🐛 DEBUG: Verificar el procesamiento inicial de datos
  // console.log('🔍 PROCESAMIENTO INICIAL DE DATOS:');
  // console.log('📋 Datos RAW del backend:', data.slice(0, 3));
  // console.log('📋 Datos RAW procesados:', rawProcessedData.slice(0, 3));
  // console.log('📋 Datos PROCESADOS finales:', processedData.slice(0, 3));
  // console.log('📋 Total de puntos RAW:', rawProcessedData.length);
  // console.log('📋 Total de puntos FINALES:', processedData.length);
  // console.log('📋 Tipo de gráfico:', chartType);

  // 🐛 DEBUG: Verificar fechas específicas para entender el problema
  // console.log('🔍 FECHAS ESPECÍFICAS:');
  processedData.slice(0, 10).forEach((d: any, index: number) => {
    console.log(
      `📅 Índice ${index}: ${d.fecha.toLocaleDateString()} → Día ${d3.timeFormat('%d')(d.fecha)}`
    );
  });

  // Función para renderizar gráfico de líneas
  const renderLineChart = () => {
    if (!data.length || !svgRef.current || width <= 0 || height <= 0) return;

    const svg = d3.select(svgRef.current);
    const g = svg.select('g.chart-container');

    // 🐛 DEBUGGING EXTENSO - Datos completos
    // console.log('🔍 DEBUGGING EXTENSO - GRÁFICO DE LÍNEAS:');
    // console.log('📋 Datos RAW recibidos del backend:', data);
    // console.log('📋 Datos PROCESADOS:', processedData);
    // console.log('📋 Métricas visibles:', visibleMetrics);

    // 🐛 DEBUG: Verificar fechas del gráfico de líneas
    console.log(
      '📋 Fechas procesadas LÍNEAS:',
      processedData.map((d: any) => ({
        original: d.fecha,
        formatted: d3.timeFormat('%d')(d.fecha),
        dateString: d.fecha.toLocaleDateString(),
      }))
    );

    // Logs detallados por cada punto de datos
    processedData.forEach((d: any, index: number) => {
      console.log(`📅 Día ${index + 1} (${d.fecha.toLocaleDateString()}):`, {
        leads: d.leads,
        usuarios: d.usuarios,
        companias: d.companias,
        neuroscans: d.neuroscans,
      });
    });

    // Escalas
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(processedData, (d: any) => d.fecha) as [Date, Date])
      .range([0, width]);

    // Calcular maxValue solo considerando métricas visibles
    const maxValue = d3.max(processedData, (d: any) => {
      const visibleValues = [];
      if (visibleMetrics.visitas_unicas) visibleValues.push(d.visitas_unicas);
      if (visibleMetrics.leads) visibleValues.push(d.leads);
      if (visibleMetrics.usuarios) visibleValues.push(d.usuarios);
      
      return visibleValues.length > 0 ? Math.max(...visibleValues) : 0;
    }) || 0;

    // console.log('📊 ESCALAS:');
    // console.log('  - Valor máximo encontrado:', maxValue);
    // console.log('  - Dominio X (fechas):', d3.extent(processedData, d => d.fecha));
    // console.log('  - Rango X (pixels):', [0, width]);

    const valuesPerMetric = {
      leads: processedData.map((d: any) => d.leads),
      usuarios: processedData.map((d: any) => d.usuarios),
      companias: processedData.map((d: any) => d.companias),
      neuroscans: processedData.map((d: any) => d.neuroscans),
      visitas_unicas: processedData.map((d: any) => d.visitas_unicas),
    };

    Object.entries(valuesPerMetric).forEach(([metric, values]) => {
      const max = Math.max(...values);
      const min = Math.min(...values);
      const total = values.reduce((sum, val) => sum + val, 0);
      const nonZero = values.filter(val => val > 0).length;
      const average = total / values.length;
      // console.log(`  📈 ${metric}:`, {
      //   max,
      //   min,
      //   total,
      //   nonZero,
      //   average: average.toFixed(2),
      //   values: values.slice(0, 5), // Primeros 5 valores
      //   isVisible: visibleMetrics[metric as keyof typeof visibleMetrics],
      // });
    });

    const effectiveMaxValue = maxValue === 0 ? 10 : maxValue;

    const yScale = d3
      .scaleLinear()
      .domain([0, effectiveMaxValue * 1.1])
      .range([height, 0]);

    // console.log('  - yScale domain:', yScale.domain());
    // console.log('  - yScale range:', yScale.range());
    // console.log('  - Ejemplos de conversión Y:');
    // console.log('    · 0 → Y=', yScale(0));
    // console.log('    · 5 → Y=', yScale(5));
    // console.log('    · 10 → Y=', yScale(10));
    // console.log('    · maxValue → Y=', yScale(maxValue));

    // Definir generador de áreas
    const area = d3
      .area<any>()
      .x(d => xScale(d.fecha))
      .y0(height) // Línea base (parte inferior)
      .y1(d => yScale(d.value)) // Línea superior (valor)
      .curve(d3.curveCardinal.tension(0.5))
      .defined(d => d.value !== null && d.value !== undefined);

    // Líneas con definido personalizado para manejar valores 0
    const line = d3
      .line<any>()
      .x(d => xScale(d.fecha))
      .y(d => yScale(d.value))
      .curve(d3.curveCardinal.tension(0.5))
      .defined(d => d.value !== null && d.value !== undefined); // Solo dibujar donde hay datos válidos

    // Crear las áreas y líneas para cada métrica
    // Orden: visitas_unicas (atrás) -> leads -> companias -> usuarios -> neuroscans (adelante)
    const metrics = ['visitas_unicas', 'leads', 'companias', 'usuarios', 'neuroscans'];

    metrics.forEach(metric => {
      const isVisible = visibleMetrics[metric as keyof typeof visibleMetrics];

      if (!isVisible) {
        // console.log(`🙈 Saltando ${metric} - no visible`);
        return;
      }

      const lineData = processedData.map((d: any) => ({
        fecha: d.fecha,
        value: d[metric as keyof typeof d],
      }));

      const hasData = lineData.some((d: any) => typeof d.value === 'number' && d.value > 0);
      const hasAnyData = lineData.some((d: any) => typeof d.value === 'number' && d.value >= 0);

      // console.log(`🎨 RENDERIZANDO ${metric.toUpperCase()}:`);
      // console.log('  - hasData (>0):', hasData);
      // console.log('  - hasAnyData (>=0):', hasAnyData);
      // console.log('  - isVisible:', isVisible);

      // Solo renderizar si tiene algún dato (incluso 0s)
      if (hasAnyData) {
        // 🎨 ÁREA BAJO LA LÍNEA - Renderizar PRIMERO para que esté en el fondo
        const areaElement = g
          .append('path')
          .datum(lineData)
          .attr('class', `area-${metric}`)
          .attr('fill', `url(#gradient-${metric})`)
          .attr('stroke', 'none')
          .attr('d', area);

        // console.log(`  - Área creada: ${metric} con opacidad ${hasData ? 0.3 : 0.1}`);

        // Línea principal - hacer más gruesa si tiene pocos datos no-cero
        const strokeWidth = hasData ? 2.5 : 1.5;
        const opacity = hasData ? 0.9 : 0.4;

        const pathElement = g
          .append('path')
          .datum(lineData)
          .attr('class', `line-${metric}`)
          .attr('fill', 'none')
          .attr('stroke', colors[metric as keyof typeof colors])
          .attr('stroke-width', strokeWidth)
          .attr('opacity', opacity)
          .attr('stroke-dasharray', hasData ? 'none' : '5,5') // Línea discontinua para métricas principalmente en 0
          .attr('d', line);

        // 🐛 DEBUG: Verificar renderizado básico
        // console.log(`  - Renderizado: ${metric} con ${strokeWidth}px, opacidad ${opacity}`);

        // Puntos más prominentes para valores > 0, puntos pequeños para valores = 0
        const circles = g
          .selectAll(`.dot-${metric}`)
          .data(processedData)
          .enter()
          .append('circle')
          .attr('class', `dot-${metric}`)
          .attr('cx', (d: any) => xScale(d.fecha))
          .attr('cy', (d: any) => yScale(d[metric as keyof typeof d] as number))
          .attr('r', (d: any) => {
            const value = d[metric as keyof typeof d];
            if (typeof value === 'number') {
              // Puntos más grandes para valores > 0, pequeños para valores = 0
              return value > 0 ? 5 : 2;
            }
            return 1;
          })
          .attr('fill', colors[metric as keyof typeof colors])
          .attr('stroke', '#fff')
          .attr('stroke-width', (d: any) => {
            const value = d[metric as keyof typeof d];
            return typeof value === 'number' && value > 0 ? 2 : 1;
          })
          .style('opacity', (d: any) => {
            const value = d[metric as keyof typeof d];
            if (typeof value === 'number') {
              // Más opacidad para valores > 0, menos para valores = 0
              return value > 0 ? 0.9 : 0.3;
            }
            return 0.1;
          })
          .on('mouseover', function (event, d: any) {
            // 🐛 DEBUG: Verificar datos del hover en líneas
            // console.log('🔍 HOVER LÍNEAS DETALLADO:', {
            //   metric,
            //   data: d,
            //   fecha: d.fecha,
            //   fechaRawString: d.fecha.toLocaleDateString(),
            //   fechaFormatted: d3.timeFormat('%d')(d.fecha),
            //   fechaCompleta: d3.timeFormat('%d/%m/%Y')(d.fecha),
            //   value: d[metric as keyof typeof d],
            //   mouseX: event.offsetX,
            //   mouseY: event.offsetY,
            // });

            showTooltip(event, d, metric);

            // 🎯 HOVER CRUZADO: Agregar todos los puntos de la misma fecha
            const fechaHover = d.fecha;
            const fechaStr = fechaHover.toISOString().split('T')[0]; // Formato YYYY-MM-DD

            // Seleccionar todos los puntos de todas las métricas en esa fecha
            const allMetrics = ['visitas_unicas', 'leads', 'companias', 'usuarios', 'neuroscans'];
            allMetrics.forEach(currentMetric => {
              const isMetricVisible = visibleMetrics[currentMetric as keyof typeof visibleMetrics];
              if (isMetricVisible) {
                // Seleccionar todos los puntos de esta métrica y filtrar por fecha
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

            // 🎯 HOVER CRUZADO: Restaurar todos los puntos de la misma fecha
            const fechaHover = d.fecha;
            const fechaStr = fechaHover.toISOString().split('T')[0]; // Formato YYYY-MM-DD

            // Restaurar todos los puntos de todas las métricas en esa fecha
            const allMetrics = ['visitas_unicas', 'leads', 'companias', 'usuarios', 'neuroscans'];
            allMetrics.forEach(currentMetric => {
              const isMetricVisible = visibleMetrics[currentMetric as keyof typeof visibleMetrics];
              if (isMetricVisible) {
                // Seleccionar todos los puntos de esta métrica y filtrar por fecha
                g.selectAll(`.dot-${currentMetric}`)
                  .filter((dotData: any) => {
                    const dotFechaStr = dotData.fecha.toISOString().split('T')[0];
                    return dotFechaStr === fechaStr;
                  })
                  .transition()
                  .duration(100)
                  .attr('r', (dotData: any) => {
                    // Restaurar tamaño original basado en el valor
                    const value = dotData[currentMetric as keyof typeof dotData];
                    return typeof value === 'number' && value > 0 ? 5 : 2;
                  })
                  .style('opacity', (dotData: any) => {
                    // Restaurar opacidad original basada en el valor
                    const value = dotData[currentMetric as keyof typeof dotData];
                    if (typeof value === 'number') {
                      return value > 0 ? 0.9 : 0.3;
                    }
                    return 0.1;
                  });
              }
            });
          });

        // console.log(`  - Círculos creados: ${circles.size()}`);
      }
    });

    // Actualizar ejes
    updateAxes(xScale, yScale, g);
  };

  // Función para renderizar gráfico de barras agrupadas
  const renderBarChart = () => {
    if (!data.length || !svgRef.current || width <= 0 || height <= 0) return;

    const svg = d3.select(svgRef.current);
    const g = svg.select('g.chart-container');

    // 🐛 DEBUG: Verificar fechas del gráfico de barras
    // console.log('🔍 DEBUGGING GRÁFICO DE BARRAS:');
    // console.log('📋 Datos RAW recibidos del backend:', data);
    // console.log('📋 Datos PROCESADOS:', processedData);
    // console.log('📋 Total de puntos de datos:', processedData.length);

    // Preparar datos para barras agrupadas - USAR MISMOS DATOS QUE LÍNEAS
    const formattedData = processedData.map((d: any) => ({
      date: d.fecha,
      leads: d.leads,
      usuarios: d.usuarios,
      companias: d.companias,
      neuroscans: d.neuroscans,
      visitas_unicas: d.visitas_unicas,
    }));

    // console.log(
    //   '📋 Fechas procesadas BARRAS:',
    //   formattedData.map((d: any) => ({
    //     original: d.date,
    //     formatted: d3.timeFormat('%d')(d.date),
    //     dateString: d.date.toLocaleDateString(),
    //   }))
    // );

    // Orden de barras: visitas_unicas -> leads -> companias -> usuarios -> neuroscans
    const metrics = ['visitas_unicas', 'leads', 'companias', 'usuarios', 'neuroscans'];
    const visibleMetricsArray = metrics.filter(
      metric => visibleMetrics[metric as keyof typeof visibleMetrics]
    );

    // Preparar dominio de fechas formateadas - EXACTAMENTE IGUAL QUE LÍNEAS
    const dateLabels = formattedData.map((d: any) => d3.timeFormat('%d')(d.date));
    // console.log('📋 Etiquetas de fechas para barras:', dateLabels);
    // console.log('📋 Fechas únicas:', [...new Set(dateLabels)]);

    // Escalas
    const xScale = d3.scaleBand().domain(dateLabels).range([0, width]).padding(0.2);

    // Calcular maxValue solo considerando métricas visibles
    const maxValue = d3.max(formattedData, (d: any) => {
      const visibleValues = [];
      if (visibleMetrics.visitas_unicas) visibleValues.push(d.visitas_unicas);
      if (visibleMetrics.leads) visibleValues.push(d.leads);
      if (visibleMetrics.usuarios) visibleValues.push(d.usuarios);
      
      return visibleValues.length > 0 ? Math.max(...visibleValues) : 0;
    }) || 0;

    const effectiveMaxValue = maxValue === 0 ? 10 : maxValue;

    const yScale = d3
      .scaleLinear()
      .domain([0, effectiveMaxValue * 1.1])
      .range([height, 0]);

    // Escala para subgrupos (barras dentro de cada fecha)
    const xSubgroup = d3
      .scaleBand()
      .domain(visibleMetricsArray)
      .range([0, xScale.bandwidth()])
      .padding(0.05);

    // Crear grupos por fecha
    const groups = g
      .selectAll('.bar-group')
      .data(formattedData)
      .enter()
      .append('g')
      .attr('class', 'bar-group')
      .attr('transform', (d: any) => `translate(${xScale(d3.timeFormat('%d')(d.date)) || 0},0)`);

    // Crear barras solo para métricas visibles
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
          // 🐛 DEBUG: Verificar datos del hover en barras
          // console.log('🔍 HOVER BARRAS:', {
          //   metric,
          //   data: d,
          //   fecha: d.date,
          //   fechaFormatted: d3.timeFormat('%d')(d.date),
          //   value: d[metric as keyof typeof d],
          // });
          showTooltip(event, d, metric);
          d3.select(this).transition().duration(100).attr('opacity', 1);
        })
        .on('mouseout', function () {
          hideTooltip();
          d3.select(this).transition().duration(100).attr('opacity', 0.8);
        });
    });

    // Actualizar ejes
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

    const displayName = metric;
    const value = d[metric as keyof typeof d];

    // 🔧 FIX: Buscar fecha original del backend (formato YYYY-MM-DD)
    const fechaRaw = d.fecha || d.date;

    // Buscar la fecha original en los datos RAW del backend que coincida con esta fecha procesada
    const fechaOriginalBackend =
      data.find(originalData => {
        const fechaComparacion = new Date(originalData.fecha);
        const fechaActual = fechaRaw;
        return fechaComparacion.getTime() === fechaActual.getTime();
      })?.fecha || fechaRaw.toISOString().split('T')[0]; // Fallback si no encuentra

    // 🐛 DEBUG: Verificar datos del tooltip
    // console.log('🔍 TOOLTIP DEBUG DETALLADO:', {
    //   metric,
    //   value,
    //   fechaOriginalBackend,
    //   fechaRaw,
    //   fechaRawString: fechaRaw.toLocaleDateString(),
    //   chartType,
    //   allData: d,
    //   isBarChart: chartType === 'bar',
    //   isLineChart: chartType === 'line',
    // });

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
    // Limpiar ejes existentes
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
          // Mostrar todos los ticks para ambos tipos de gráfico
          .ticks(chartType === 'line' ? processedData.length : undefined)
      );

    xAxis
      .selectAll('text')
      .style('font-size', '12px')
      .style('fill', '#6c757d')
      .style('text-anchor', 'middle') // Siempre centrado para ambos tipos
      .attr('transform', 'rotate(0)'); // Siempre horizontal para ambos tipos

    g.append('g')
      .attr('class', 'axis y-axis')
      .call(d3.axisLeft(yScale)
        .tickFormat((d) => {
          const num = d as number;
          if (num === 0) return '0';
          
          // Solo usar notación "k" cuando sea >= 1000
          if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
          }
          
          // Para valores < 1000, mostrar número normal
          if (num >= 100) return Math.round(num).toString();
          if (num >= 10) return num.toFixed(1);
          return num.toFixed(2);
        }))
      .selectAll('text')
      .style('font-size', '12px')
      .style('fill', '#6c757d');
  };

  useEffect(() => {
    // console.log('📊 ActivityLineChart - Datos recibidos:', data);
    // console.log('📊 ActivityLineChart - Datos procesados:', processedData);
    // console.log('📊 ActivityLineChart - Tipo de gráfico:', chartType);
    // console.log('📊 ActivityLineChart - Métricas visibles:', visibleMetrics);

    if (!data.length || !svgRef.current || width <= 0 || height <= 0) return;

    // Limpiar el SVG anterior
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3
      .select(svgRef.current)
      .attr('width', dimensions.width)
      .attr('height', dimensions.height);

    // Crear definiciones para gradientes
    const defs = svg.append('defs');
    
    // Crear gradientes lineales para cada métrica
    Object.entries(colors).forEach(([metric, color]) => {
      const gradient = defs
        .append('linearGradient')
        .attr('id', `gradient-${metric}`)
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '0%')
        .attr('y2', '100%');

      gradient
        .append('stop')
        .attr('offset', '0%')
        .attr('stop-color', color)
        .attr('stop-opacity', 0.4);

      gradient
        .append('stop')
        .attr('offset', '100%')
        .attr('stop-color', color)
        .attr('stop-opacity', 0.05);
    });

    const g = svg
      .append('g')
      .attr('class', 'chart-container')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Renderizar según el tipo de gráfico
    // console.log('🎯 RENDERIZANDO GRÁFICO:', chartType);
    if (chartType === 'line') {
      // console.log('🔧 Ejecutando renderLineChart()');
      renderLineChart();
    } else {
      // console.log('🔧 Ejecutando renderBarChart()');
      renderBarChart();
    }

    // LEYENDA COMENTADA - Ahora se maneja como componente React
    /*
    // Leyenda clickeable con checkboxes - posición flotante arriba
    const legend = svg
      .append('g')
      .attr('class', 'legend floating-legend')
      .attr('transform', `translate(12, 12)`);

    // Orden de la leyenda: visitas_unicas -> leads -> companias -> usuarios -> neuroscans
    const metrics = ['visitas_unicas', 'leads', 'companias', 'usuarios', 'neuroscans'];
    
    // Agregar fondo general mejorado para toda la leyenda
    legend
      .append('rect')
      .attr('x', -12)
      .attr('y', -20)
      .attr('width', metrics.length * 80 + 16)
      .attr('height', 40)
      .attr('rx', 20)
      .attr('fill', 'rgba(255, 255, 255, 0.85)')
      .attr('stroke', 'rgba(255, 255, 255, 0.3)')
      .attr('stroke-width', 1)
      .style('filter', 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.1))');

    metrics.forEach((metric, index) => {
      const isVisible = visibleMetrics[metric as keyof typeof visibleMetrics];

      const legendItem = legend
        .append('g')
        .attr('class', 'legend-item')
        .attr('transform', `translate(${index * 80}, 0)`) // Espacio compacto para flotante
        .style('cursor', 'pointer')
        .on('click', () => toggleMetric(metric as keyof typeof visibleMetrics));

      // Swatch circular (más pequeño para flotante)
      const radius = 4;
      const swatch = legendItem
        .append('circle')
        .attr('cx', radius + 3)
        .attr('cy', 0)
        .attr('r', radius)
        .attr('fill', isVisible ? colors[metric as keyof typeof colors] : 'transparent')
        .attr('stroke', colors[metric as keyof typeof colors])
        .attr('stroke-width', 1.5);

      // Texto descriptivo al lado del swatch circular (más compacto)
      const textMap: { [key: string]: string } = {
        'visitas_unicas': 'visitas',
        'leads': 'leads',
        'companias': 'comp',
        'usuarios': 'users',
        'neuroscans': 'neuro'
      };
      
      legendItem
        .append('text')
        .attr('x', radius * 2 + 8)
        .attr('y', 0)
        .attr('dy', '0.35em')
        .style('font-size', '10px')
        .style('fill', isVisible ? '#495057' : '#999')
        .style('font-weight', '500')
        .style('user-select', 'none')
        .text(textMap[metric] || metric.substring(0, 6));
    });
    */
  }, [data, dimensions, chartType, visibleMetrics]);

  // Asegurar re-renderizado cuando cambia el tipo de gráfico
  useEffect(() => {
    if (data.length > 0) {
      // Forzar re-renderizado cuando cambia el tipo de gráfico
      console.log('🔄 Cambio de tipo de gráfico detectado:', chartType);
    }
  }, [chartType, data.length]);

  // Sistema de resize automático robusto
  useEffect(() => {
    let resizeTimeout: ReturnType<typeof setTimeout>;

    const updateDimensions = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = containerRef.current.clientHeight;
        
        // Usar todo el espacio disponible del contenedor (sin padding)
        const newWidth = Math.max(containerWidth, 300);
        const newHeight = Math.max(containerHeight, 280);

        setDimensions(prev => {
          if (Math.abs(prev.width - newWidth) > 10 || Math.abs(prev.height - newHeight) > 10) {
            console.log(`📊 Chart resize: ${newWidth}x${newHeight} (container: ${containerWidth}x${containerHeight})`);
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
    // Forzar actualización inicial
    setTimeout(updateDimensions, 100);

    return () => {
      clearTimeout(resizeTimeout);
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  if (!data.length) {
    return (
      <div className="chart-placeholder">
        <p>No hay datos para mostrar en el gráfico</p>
      </div>
    );
  }

  return (
    <div className="activity-chart-container" ref={containerRef}>
      <svg ref={svgRef}></svg>
    </div>
  );
};
