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
import { useTheme } from '../../views/ThemeContext';

interface DoughnutCharProps {
	data: any;
	type: ChartValueType;
}

export const useDoughnutChart = (value: DoughnutCharProps) => {
	let metrics: any = null;
	const metricsFunctions: { [key: string]: Function } = {
		[ChartValueType.SOURCE_CODE]: MetricsService.computeSourceCodeMetrics,
		[ChartValueType.NETWORK_OS]: MetricsService.computeInternalNetworkOSAndCount
	};

	const selectedMetricsFunction = metricsFunctions[value.type];
	if (selectedMetricsFunction) {
		metrics = selectedMetricsFunction(value.data);
	} else {
		metrics = value.data;
	}
	const { total, ...otherMetrics } = metrics;
	const { theme } = useTheme();

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
						theme === "light" ? '#e85050' : '#e85050', //critical
						theme === "light" ? '#e25365' : '#e25365', //elevated
						theme === "light" ? '#e97e8b' : '#e97e8b', //medium
						theme === "light" ? '#f1a7b1' : '#f1a7b1', //low
						theme === "light" ? '#f8d7db' : '#f8d7db', //intel
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
