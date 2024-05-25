import { useRef } from 'react';
import * as d3 from 'd3';

interface GraphData {
	week: number;
	resellers: number;
}

export const useBarsGraph = () => {
	//Grafico en Svg
	const svgRef = useRef<SVGSVGElement>(null);

	const generateData = (): GraphData[] => {
		const data: GraphData[] = [];
		for (let week = 1; week <= 52; week++) {
			const resellers = Math.floor(Math.random() * 21); // Generar número aleatorio entre 0 y 20
			data.push({ week, resellers });
		}
		return data;
	};

	//Creare grafico svg con d3
	const drawChart = (data: GraphData[]) => {
		//Margin that the graphic occupies with respect to the svg space
		const margin = { top: 10, right: 35, bottom: 0, left: 10 };
		//SVG Size
		const width = 550;
		const height = 225;

		const x = d3
			.scaleBand()
			.domain(data.map((d) => d.week.toString()))
			//Defines the size in X of the graph (svg size - graph margin = graph size)
			.range([margin.left, width - margin.right])
			.padding(0.1);

		//Defines the maximum height of the chart bars
		const maxResellers: number =
			data.length > 0 ? d3.max(data, (d: GraphData) => d.resellers) || 0 : 0;

		const y = d3
			.scaleLinear()
			.domain([0, maxResellers])
			.nice()
			//Define el tamaño en X del grafico (svg size - graph margin = graph size)
			.range([height - margin.bottom, margin.top]);

		const xAxis = (g: d3.Selection<SVGGElement, unknown, null, undefined>) =>
			g
			    //Position the graphic based on the height of the svg and bottom margin
				.attr('transform', `translate(0,${height - margin.bottom})`)
				.call(
					d3
						.axisBottom(x)
						.tickSize(0)
						//I say that the format for the ticks is void
						.tickFormat(() => ''),
				)
				//Completely remove the X ticks from the chart
				.call((g) => g.select('.domain').remove());

		const yAxis = (g: d3.Selection<SVGGElement, unknown, null, undefined>) =>
			g
				.attr('transform', `translate(${margin.left},0)`)

				.call(
					d3
						.axisLeft(y)
						.ticks(0)
						//I say that the format for the ticks is void
						.tickFormat(() => ''),
				)
				//Completely remove the X ticks from the chart
				.call((g) => g.select('.domain').remove());

		
		const svg = d3.select(svgRef.current);
		svg.selectAll('*').remove();
		//Define the default svg size
		svg.attr('width', width).attr('height', height);

		const gradient = svg
			.append('linearGradient')
			.attr('id', 'bar-gradient')//Name of gradient
			.attr('x1', '0%')
			.attr('y1', '0%')
			.attr('x2', '0%')
			//Defines that the gradient occupies 100% of the bar
			.attr('y2', '100%');

		//Gradient, 0% light color
		gradient
			.append('stop')
			.attr('offset', '0%')
			.attr('stop-color', '#fe4e4e');
		//Gradient, dark color goes to 100%
		gradient
			.append('stop')
			.attr('offset', '100%')
			.attr('stop-color', '#ffc5c5');

		svg.append('g')
			.selectAll('rect')
			.data(data)
			.join('rect')
			.attr('x', (d) => x(d.week.toString()) || 0)
			.attr('y', (d) => y(d.resellers))
			.attr('height', (d) => y(0) - y(d.resellers))
			.attr('width', x.bandwidth())
			//Define the color of the bar
			.attr("fill", "url(#bar-gradient)")
			.attr('stroke', 'none');

		svg.append('g').call(xAxis as any);
		svg.append('g').call(yAxis as any);
	};

	return [svgRef, drawChart, generateData] as const;
};
