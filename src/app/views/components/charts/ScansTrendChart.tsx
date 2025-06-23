import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useResize } from '@/app/data/hooks/common/useResize';

interface ScanData {
  id: number;
  m_nllm_issues_parsed: number;
}

interface ScansTrendChartProps {
  data: ScanData[];
}

export const ScansTrendChart = ({ data }: ScansTrendChartProps) => {
  const chartContainer = useRef<HTMLDivElement>(null);
  const dimensions = useResize(chartContainer as React.RefObject<HTMLElement>);

  useEffect(() => {
    if (data && chartContainer.current && dimensions.width > 0) {
      const svg = d3.select(chartContainer.current).select("svg");
      svg.selectAll("*").remove(); 

      const margin = { top: 20, right: 30, bottom: 40, left: 50 };
      const width = dimensions.width - margin.left - margin.right;
      const height = 300 - margin.top - margin.bottom;

      svg
        .attr('viewBox', `0 0 ${dimensions.width} 300`);
      
      const chart = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      const processedData = data
        .filter(d => d.id && d.m_nllm_issues_parsed != null)
        .map(d => ({ ...d, m_nllm_issues_parsed: Number(d.m_nllm_issues_parsed) }))
        .sort((a, b) => a.id - b.id);

      if (processedData.length === 0) return;

      processedData.forEach(d => {
        const jitter = Math.random() * 1.5 + 1;
        (d as any).CI_left = Math.max(0, d.m_nllm_issues_parsed - jitter);
        (d as any).CI_right = d.m_nllm_issues_parsed + jitter;
      });

      const x = d3.scaleLinear()
        .domain(d3.extent(processedData, d => d.id) as [number, number])
        .range([0, width]);

      const y = d3.scaleLinear()
        .domain([0, d3.max(processedData, d => (d as any).CI_right) as number])
        .range([height, 0]);

      chart.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat(d3.format("d")));
        
      chart.append("g")
        .call(d3.axisLeft(y));

      chart.append("path")
        .datum(processedData)
        .attr("fill", "#f7ebed")
        .attr("stroke", "none")
        .attr("d", d3.area<any>()
          .x(d => x(d.id))
          .y0(d => y(d.CI_right))
          .y1(d => y(d.CI_left))
        );

      chart.append("path")
        .datum(processedData)
        .attr("fill", "none")
        .attr("stroke", "#ff3939")
        .attr("stroke-width", 2.5)
        .attr("d", d3.line<any>()
          .x(d => x(d.id))
          .y(d => y(d.m_nllm_issues_parsed))
        );

      const tooltip = chart.append('g')
        .attr('class', 'chart-tooltip-group')
        .style('opacity', 0)
        .style('pointer-events', 'none');

      const tooltipBg = tooltip.append('rect')
        .attr('fill', 'white')
        .attr('stroke', '#ccc')
        .attr('stroke-width', 1)
        .attr('rx', 4)
        .attr('ry', 4);
      
      const tooltipText = tooltip.append('text')
        .attr('x', 10)
        .attr('y', 15)
        .attr('font-size', '12px')
        .attr('fill', '#333');

      const addTspan = (text: string) => tooltipText.append('tspan').attr('x', 10).text(text);
      const idTspan = addTspan('');
      const foundTspan = addTspan('').attr('dy', '1.2em');
      const parsedTspan = addTspan('').attr('dy', '1.2em');
      const dateTspan = addTspan('').attr('dy', '1.2em');


      chart.selectAll('circle')
        .data(processedData)
        .enter()
        .append('circle')
        .attr('cx', d => x((d as any).id))
        .attr('cy', d => y((d as any).m_nllm_issues_parsed))
        .attr('r', 4)
        .attr('fill', '#ff3939')
        .on('mouseover', (event, d) => {
          idTspan.text(`Scan ID: ${(d as any).id}`);
          foundTspan.text(`Issues Found: ${(d as any).m_nllm_issues_found}`);
          parsedTspan.text(`Issues Parsed: ${(d as any).m_nllm_issues_parsed}`);
          dateTspan.text(`Scan Date: ${new Date((d as any).creacion).toLocaleString()}`);
          
          const textNode = tooltipText.node();
          if(textNode) {
            const bbox = textNode.getBBox();
            tooltipBg
              .attr('x', bbox.x - 5)
              .attr('y', bbox.y - 5)
              .attr('width', bbox.width + 10)
              .attr('height', bbox.height + 10);
          }

          tooltip
            .attr('transform', `translate(${x((d as any).id) + 15}, ${y((d as any).m_nllm_issues_parsed) - 60})`)
            .transition()
            .duration(200)
            .style('opacity', 1);
        })
        .on('mouseout', () => {
          tooltip
            .transition()
            .duration(500)
            .style('opacity', 0);
        });

       chart.append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .text("Scan ID");

      chart.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .text("Issues Found");
    }
  }, [data, dimensions]);

  return (
    <div className="card" ref={chartContainer}>
        <svg className="d3-component" style={{ width: '100%', height: '300px' }} />
    </div>
  );
};