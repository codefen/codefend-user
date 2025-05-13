import { useEffect, useMemo } from 'react';

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  Colors,
  type ChartData,
  type ChartOptions,
  ArcElement,
} from 'chart.js/auto';
import { MetricsService, ChartValueType } from '../..';
import { useTheme } from '@/app/views/context/ThemeContext';

interface DoughnutCharProps {
  data: any;
  type: ChartValueType;
}

const useDoughnutChart = (value: DoughnutCharProps) => {
  const { theme } = useTheme();
  const metricsFunctions: { [key: string]: Function } = {
    [ChartValueType.SOURCE_CODE]: MetricsService.computeSourceCodeMetrics,
    [ChartValueType.NETWORK_OS]: MetricsService.computeInternalNetworkOSAndCount,
  };
  const selectedMetricsFunction = metricsFunctions[value.type];
  const metric = selectedMetricsFunction
    ? selectedMetricsFunction(value.data) || {}
    : value.data || {};
  const { total, ...otherMetrics } = metric;

  useEffect(() => {
    ChartJS.register(Title, Tooltip, Legend, Colors, ArcElement);
  }, []);
  const chartData = useMemo(() => {
    // Si todos los valores son "0"
    const allZeros = Object.values(otherMetrics).every(value => value == 0);
    if (allZeros) {
      return {
        labels: ['No data'],
        datasets: [
          {
            data: [1],
            backgroundColor: [theme === 'light' ? '#dbdbdb' : '#3a3a3a'],
            borderWidth: 0,
          },
        ],
      } as ChartData<'doughnut'>;
    }

    // Comportamiento normal cuando hay datos
    const labels = Object.keys(otherMetrics).map((key: any) => (!key ? 'Unknown' : key));
    return {
      labels,
      datasets: [
        {
          data: Object.values(otherMetrics),
          backgroundColor: [
            theme === 'light' ? '#e85050' : '#491C21', //critical
            theme === 'light' ? '#e25365' : '#671830', //elevated
            theme === 'light' ? '#e97e8b' : '#961933', //medium
            theme === 'light' ? '#f1a7b1' : '#C9183B', //low
            theme === 'light' ? '#dbdbdb' : '#CF1118', //intel
          ],
          borderWidth: 0,
        },
      ],
    } as ChartData<'doughnut'>;
  }, [otherMetrics, theme]);

  const chartOptions: ChartOptions<'doughnut'> = useMemo(
    () => ({
      plugins: {
        legend: {
          display: false,
        },
      },
    }),
    []
  );

  return { chartOptions, chartData, otherMetrics, total };
};

export default useDoughnutChart;
