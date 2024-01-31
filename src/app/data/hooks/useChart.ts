import { useEffect, useMemo } from 'react';

import {
	Chart as ChartJS,
	Title,
	Tooltip,
	Legend,
	Colors,
	ChartData,
	ChartOptions,
	ArcElement,
} from 'chart.js/auto';
import { MetricsService, ChartValueType } from '..';

interface DoughnutCharProps {
	data: any;
	type: ChartValueType;
}

export const useDoughnutChart = (value: DoughnutCharProps) => {
	let metrics = null;
	if (value.type === ChartValueType.SOURCE_CODE) {
		metrics = MetricsService.computeSourceCodeMetrics(value.data);
	} else if (value.type === ChartValueType.NETWORK_OS) {
		metrics = MetricsService.computeInternalNetworkOSAndCount(value.data);
	} else {
		metrics = value.data;
	}
	const { total, ...otherMetrics } = metrics;

	useEffect(() => {
		ChartJS.register(Title, Tooltip, Legend, Colors, ArcElement);
	}, []);

	const chartData = useMemo(() => {
		const labels = Object.keys(otherMetrics).map((key: any)=> !key ? "Unknown" : key);
		return {
			labels,
			datasets: [
				{
					data: Object.values(otherMetrics),
					backgroundColor: [
						'#e85050', //critical
						'#e25365', //elevated
						'#e97e8b', //medium
						'#f1a7b1', //low
						'#f8d7db', //intel
					],
					borderWidth: 0,
				},
			],
		} as ChartData<'doughnut'>;
	}, [otherMetrics]);

	const chartOptions: ChartOptions<'doughnut'> = useMemo(
		() => ({
			plugins: {
				legend: {
					display: false,
				},
			},
		}),
		[],
	);

	return { chartOptions, chartData, otherMetrics, total };
};
