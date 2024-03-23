import { type FC, useMemo } from 'react';
import {
	MetricsService,
	ChartValueType,
	type SourceCode,
	generateIDArray,
	isEmptyData,
	languageTypes,
	useDoughnutChart,
	sourceCodeChartColumns,
	type TableItem,
} from '../../../../../../data';
import {
	ChartIcon,
	EmptyCard,
	PageLoader,
	Show,
	SimpleSection,
	TableV2,
} from '../../../../../components';
import { Doughnut } from 'react-chartjs-2';

interface Props {
	isLoading: boolean;
	sourceCode: SourceCode[];
}

export const SourceCodeChart: FC<Props> = (props) => {
	const { chartData, otherMetrics, total, chartOptions } = useDoughnutChart({
		data: props.sourceCode,
		type: ChartValueType.SOURCE_CODE,
	});

	const dataEmptyState = useMemo(() => {
		return isEmptyData(otherMetrics);
	}, [otherMetrics]);

	const sourceKeys = useMemo(() => {
		return props.isLoading ? [] : generateIDArray(props.sourceCode.length);
	}, [props.sourceCode]);

	const { renderPercentage } = MetricsService;

	const dataTable = Object.keys(otherMetrics).map(
		(network: any) =>
			({
				ID: { value: '', style: '' },
				code: {
					value: languageTypes.has(network.toLowerCase())
						? network
						: 'Unknown',
					style: 'os',
				},
				count: {
					value: otherMetrics[network as keyof typeof otherMetrics],
					style: 'count',
				},
				percent: {
					value: renderPercentage(
						String(otherMetrics[network as keyof typeof otherMetrics]),
						String(total),
					),
					style: 'percent',
				},
			}) as Record<string, TableItem>,
	);

	return (
		<div className="card risk-chart">
			<Show when={!props.isLoading} fallback={<PageLoader />}>
				<SimpleSection
					header="source code by programming language"
					icon={<ChartIcon />}>
					<Show
						when={!dataEmptyState}
						fallback={
							<div className="content">
								<EmptyCard />
							</div>
						}>
						<div className="content">
							<div className="chart">
								<Doughnut data={chartData} options={chartOptions} />
							</div>
							<TableV2
								columns={sourceCodeChartColumns}
								rowsData={dataTable}
								showRows={dataTable.length !== 0}
								showEmpty={dataTable.length === 0}
								sizeY={25}
								isSmall
							/>
						</div>
					</Show>
				</SimpleSection>
			</Show>
		</div>
	);
};
