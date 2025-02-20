import { type FC, useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { ChartValueType } from '@interfaces/panel';
import useDoughnutChart from '@hooks/common/useChart';
import { MetricsService } from '@utils/metric.service';
import { sourceCodeChartColumns, languageTypes } from '@mocks/defaultData';
import { isEmptyData } from '@utils/helper';
import type { TableItem } from '@interfaces/table';
import { PageLoader } from '@defaults/loaders/Loader.tsx';
import Show from '@/app/components/Show/Show';
import EmptyCard from '@defaults/EmptyCard.tsx';
import { SimpleSection } from '@/app/components/SimpleSection/SimpleSection';
import { ChartIcon } from '@icons';
import { TableV2 } from '@table/tablev2.tsx';

interface Props {
  isLoading: boolean;
  sourceCode: any[];
}

export const SourceCodeChart: FC<Props> = props => {
  const fixedSourceCode = props.sourceCode.map(sourceCode => ({
    ...sourceCode,
    source_code: String(sourceCode.source_code).replace(' ', '').toLowerCase(),
  }));
  const { chartData, otherMetrics, total, chartOptions } = useDoughnutChart({
    data: fixedSourceCode,
    type: ChartValueType.SOURCE_CODE,
  });

  const dataEmptyState = useMemo(() => {
    return isEmptyData(otherMetrics);
  }, [otherMetrics]);

  const { renderPercentage } = MetricsService;

  const dataTable = Object.keys(otherMetrics).map(
    (sourceCode: any) =>
      ({
        ID: { value: '', style: '' },
        code: {
          value: languageTypes.has(sourceCode.toLowerCase().trim()) ? sourceCode : 'Unknown',
          style: 'os',
        },
        count: {
          value: otherMetrics[sourceCode as keyof typeof otherMetrics],
          style: 'count',
        },
        percent: {
          value: renderPercentage(
            String(otherMetrics[sourceCode as keyof typeof otherMetrics]),
            String(total)
          ),
          style: 'percent',
        },
      }) as Record<string, TableItem>
  );

  return (
    <div className="card risk-chart">
      <Show when={!props.isLoading} fallback={<PageLoader />}>
        <SimpleSection header="source code by programming language" icon={<ChartIcon />}>
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
                isSmall
              />
            </div>
          </Show>
        </SimpleSection>
      </Show>
    </div>
  );
};
