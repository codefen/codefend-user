import React, { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
	EmptyCard,
	BugIcon,
	Show,
	SimpleSection,
	TableItem,
	TableWithoutActions,
} from '../../..';
import {
	IssuesShare,
	isEmptyData,
	useDoughnutChart,
	MetricsService,
	ChartValueType,
	vulnerabilityRiskColumns,
} from '../../../../../data';

interface VulnerabilityRiskProps {
	vulnerabilityByRisk: IssuesShare;
	isLoading: boolean;
}

export const RiskWithoutAction: React.FC<VulnerabilityRiskProps> = ({
	vulnerabilityByRisk,
	isLoading,
}) => {
	const { chartData, otherMetrics, total, chartOptions } = useDoughnutChart({
		data: vulnerabilityByRisk,
		type: ChartValueType.PLAIN,
	});

	const dataEmptyState = () => {
		const { total, ...otherMetrics } = vulnerabilityByRisk;
		return isEmptyData(otherMetrics);
	};

	const { renderPercentage } = MetricsService;

	const tableRows = () =>
		Object.keys(otherMetrics).map(
			(metric: string | number) =>
				({
					ID: { value: '', style: '' },
					risk: { value: metric, style: 'risk' },
					count: {
						value: otherMetrics[metric as keyof typeof otherMetrics],
						style: 'count',
					},
					percent: {
						value: renderPercentage(
							String(otherMetrics[metric as keyof typeof otherMetrics]),
							String(total),
						),
						style: 'percent',
					},
				}) as Record<string, TableItem>,
		);

	return (
		<div className="card risk-chart">
			<SimpleSection header="Vulnerabilities by risk" icon={<BugIcon />}>
				<div className="content">
					<Show when={!dataEmptyState} fallback={<EmptyCard />}>
						<>
							<div className="chart">
								<Doughnut data={chartData} options={chartOptions} />
							</div>

							<TableWithoutActions
								columns={vulnerabilityRiskColumns}
								resources={tableRows()}
								id={5}
								isLoading={!isLoading}
							/>
						</>
					</Show>
				</div>
			</SimpleSection>
		</div>
	);
};
