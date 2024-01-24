import { useMemo } from 'react';
import {
	MetricsService,
	ChartValueType,
	Device,
	generateIDArray,
	isEmptyData,
	osTypes,
	useDoughnutChart,
} from '../../../../../../data';
import { ChartIcon, EmptyCard, PageLoader } from '../../../../../components';
import { Doughnut } from 'react-chartjs-2';

interface LanNetworksChartProps {
	isLoading: boolean;
	internalNetwork: Device[];
}

export const LanNetworksChart: React.FC<LanNetworksChartProps> = (props) => {
	const { chartOptions, chartData, otherMetrics, total } = useDoughnutChart({
		data: props.internalNetwork,
		type: ChartValueType.NETWORK_OS,
	});

	const dataEmptyState = useMemo(() => {
		return isEmptyData(otherMetrics);
	}, [otherMetrics]);

	const { renderPercentage } = MetricsService;

	const lanKeys = useMemo(() => {
		return props.isLoading
			? []
			: generateIDArray(Object.keys(otherMetrics).length);
	}, [Object.keys(otherMetrics)]);

	return (
		<>
			<div className="card risk-chart">
				{!props.isLoading ? (
					<div className="header">
						<div className="title">
							<div className="icon">
								<ChartIcon />
							</div>
							<span>Network devices by technology</span>
						</div>
					</div>
				) : (
					<PageLoader />
				)}

				{dataEmptyState ? (
					<div className="content">
						<EmptyCard />
					</div>
				) : (
					<div className="content">
						<div className="chart">
							<Doughnut data={chartData} options={chartOptions} />
						</div>
						<div className="table small">
							<div className="columns-name">
								<div className="os">os</div>
								<div className="count">count</div>
								<div className="percent">percent</div>
							</div>

							<div className="row">
								{Object.keys(otherMetrics).map(
									(network: any, i: number) => (
										<div className="item" key={lanKeys[i]}>
											<div className="os">
												{osTypes.includes(network.toLowerCase())
													? network
													: 'Unknown'}
											</div>
											<div className="count">
												{otherMetrics[network]}
											</div>
											<div className="percent">
												{renderPercentage(
													otherMetrics[network],
													total,
												)}
											</div>
										</div>
									),
								)}
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	);
};
