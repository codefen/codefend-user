import { useRef, useEffect, useMemo, memo } from 'react';
import * as d3 from 'd3';

interface MapProjectionViewProps {
  worldData: any;
  countryData: Record<string, number>;
  countryRanking: Record<string, number>;
  dimensions: { width: number; height: number };
  selectedProjection: string;
  createProjection: (worldData: any) => any;
  mapStyle: any;
  theme: string;
  onCountryTooltip?: (countryName: string, count: number, rank?: number) => string;
}

// Función para obtener color de país basado en ranking
const lightenColor = (color: string, percentage: number, theme: string) => {
  const color_rgb = d3.rgb(color);
  const white = theme === 'light' ? d3.rgb(255, 255, 255) : d3.rgb(0, 0, 0);
  return d3.interpolateRgb(color_rgb, white)(percentage / 100);
};

const MapProjectionView = memo<MapProjectionViewProps>(
  ({
    worldData,
    countryData,
    countryRanking,
    dimensions,
    selectedProjection,
    createProjection,
    mapStyle,
    theme,
    onCountryTooltip,
  }) => {
    const svgRef = useRef<SVGSVGElement>(null);

    // Memoizar función de color para evitar recálculos
    const getCountryColor = useMemo(() => {
      return (countryName: string) => {
        const count = countryData[countryName] || 0;

        if (count === 0) {
          return theme === 'dark' ? mapStyle.darkCountryNoData : mapStyle.countryNoData;
        }

        const rank = countryRanking[countryName];
        if (!rank) {
          return theme === 'dark' ? mapStyle.darkCountryNoData : mapStyle.countryNoData;
        }

        if (rank === 1) {
          return theme === 'dark' ? mapStyle.darkCountryTop : mapStyle.countryTop;
        }

        // Calculate lightening percentage based on rank
        const lightenPercentage = (rank - 1) * 10;
        const baseColor = theme === 'dark' ? mapStyle.darkCountryBase : mapStyle.countryBase;
        return lightenColor(baseColor, lightenPercentage, theme);
      };
    }, [countryData, countryRanking, mapStyle, theme]);

    // Renderizado del mapa optimizado
    useEffect(() => {
      if (!svgRef.current || !worldData) return;

      const svg = d3.select(svgRef.current);
      svg.selectAll('*').remove(); // Clear previous render

      const { width, height } = dimensions;
      svg.attr('width', width).attr('height', height);

      const projection = createProjection(worldData);
      if (!projection) return;

      const path = d3.geoPath().projection(projection);
      const isDark = theme === 'dark';

      // Add special 3D effects for interactive globe
      if (selectedProjection === 'orthographicInteractive') {
        // Add gradient definitions for 3D effect
        const defs = svg.append('defs');

        // Sphere gradient for 3D effect
        const sphereGradient = defs
          .append('radialGradient')
          .attr('id', 'sphere-gradient')
          .attr('cx', '30%')
          .attr('cy', '30%');

        sphereGradient
          .append('stop')
          .attr('offset', '0%')
          .attr('stop-color', isDark ? mapStyle.darkOceanCenter : mapStyle.oceanCenter)
          .attr('stop-opacity', 1);

        sphereGradient
          .append('stop')
          .attr('offset', '100%')
          .attr('stop-color', isDark ? mapStyle.darkOceanEdge : mapStyle.oceanEdge)
          .attr('stop-opacity', 1);

        // Add sphere background
        const baseRadius = Math.min(width, height) / 2;
        const radius = baseRadius * 1.98; // Match the projection scale
        svg
          .append('circle')
          .attr('cx', width / 2)
          .attr('cy', height / 2)
          .attr('r', radius)
          .attr('fill', 'url(#sphere-gradient)')
          .attr('stroke', isDark ? mapStyle.darkGlobeBorder : mapStyle.globeBorder)
          .attr('stroke-width', mapStyle.globeBorderWidth);
      }

      // Draw countries
      svg
        .selectAll('path.country')
        .data(worldData.features)
        .enter()
        .append('path')
        .attr('class', 'country')
        .attr('d', path as any)
        .attr('fill', (d: any) => {
          // Try multiple property names for country name
          const countryName = (
            d.properties.NAME ||
            d.properties.name ||
            d.properties.NAME_EN ||
            ''
          ).trim();
          return getCountryColor(countryName);
        })
        .attr('stroke', isDark ? mapStyle.darkCountryBorder : mapStyle.countryBorder)
        .attr('stroke-width', mapStyle.countryBorderWidth)
        .append('title')
        .text((d: any) => {
          const countryName = (
            d.properties.NAME ||
            d.properties.name ||
            d.properties.NAME_EN ||
            ''
          ).trim();
          const count = countryData[countryName] || 0;
          const countryFullName =
            d.properties.NAME || d.properties.name || d.properties.NAME_EN || 'Unknown';
          const rank = countryRanking[countryName];

          if (onCountryTooltip) {
            return onCountryTooltip(countryFullName, count, rank);
          }

          if (count === 0) {
            return `${countryFullName}: 0 servidores`;
          }

          return `${countryFullName}: ${count} servidor${count !== 1 ? 'es' : ''} (Ranking #${rank})`;
        });

      // Add graticules (grid lines) for better visual reference
      const graticule = d3
        .geoGraticule()
        .step(selectedProjection === 'orthographicInteractive' ? [15, 15] : [30, 30]);

      svg
        .append('path')
        .datum(graticule)
        .attr('class', 'graticule')
        .attr('d', path as any)
        .attr('fill', 'none')
        .attr(
          'stroke',
          selectedProjection === 'orthographicInteractive'
            ? mapStyle.graticule3D
            : mapStyle.graticule2D
        )
        .attr(
          'stroke-width',
          selectedProjection === 'orthographicInteractive'
            ? mapStyle.graticuleWidth3D
            : mapStyle.graticuleWidth2D
        )
        .attr('opacity', mapStyle.graticuleOpacity);
    }, [
      worldData,
      countryData,
      countryRanking,
      dimensions,
      selectedProjection,
      createProjection,
      mapStyle,
      theme,
      getCountryColor,
      onCountryTooltip,
    ]);

    return <svg ref={svgRef} className="world-map-svg" style={{ display: 'block' }} />;
  }
);

MapProjectionView.displayName = 'MapProjectionView';

export default MapProjectionView;
