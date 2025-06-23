import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface ScanData {
  id: number;
  m_nllm_issues_parsed: number;
}

interface ScansTrendChartProps {
  data: ScanData[];
}

export const ScansTrendChart = ({ data }: ScansTrendChartProps) => {
  const chartContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (data && chartContainer.current) {
      const container = chartContainer.current;
      const containerWidth = container.clientWidth;

      if (containerWidth === 0) return; 

      const svg = d3.select(container).select("svg");
      svg.selectAll("*").remove(); 

      const margin = { top: 20, right: 30, bottom: 40, left: 50 };
      const width = containerWidth - margin.left - margin.right;
      const height = 300 - margin.top - margin.bottom;

      svg
        .attr("width", containerWidth)
        .attr("height", height + margin.top + margin.bottom);
      
      const chart = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      const processedData = data
        .filter(d => d.id && d.m_nllm_issues_parsed != null)
        .sort((a, b) => a.id - b.id);

      if (processedData.length === 0) return;

      const x = d3.scaleLinear()
        .domain(d3.extent(processedData, d => d.id) as [number, number])
        .range([0, width]);

      const y = d3.scaleLinear()
        .domain([0, d3.max(processedData, d => d.m_nllm_issues_parsed) as number])
        .range([height, 0]);

      chart.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat(d3.format("d")));
        
      chart.append("g")
        .call(d3.axisLeft(y));

      chart.append("path")
        .datum(processedData)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2.5)
        .attr("d", d3.line<ScanData>()
          .x(d => x(d.id))
          .y(d => y(d.m_nllm_issues_parsed))
        );

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
  }, [data]);

  return (
    <div className="card" ref={chartContainer}>
        <svg className="d3-component" />
    </div>
  );
};