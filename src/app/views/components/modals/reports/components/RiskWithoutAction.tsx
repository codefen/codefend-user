import { type FC } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { TableWithoutActions } from '@table/TableWithoutActions';
import Show from '@/app/views/components/Show/Show';
import EmptyCard from '@/app/views/components/EmptyCard/EmptyCard';
import { BugIcon } from '@icons';
import {
  type IssuesShare,
  type TableItem,
  useDoughnutChart,
  MetricsService,
  ChartValueType,
  vulnerabilityRiskColumns,
  isEmptyShares,
} from '../../../../../data';
import { SimpleSection } from '@/app/views/components/SimpleSection/SimpleSection';

interface VulnerabilityRiskProps {
  vulnerabilityByRisk: IssuesShare;
  isLoading: boolean;
}

export const RiskWithoutAction: FC<VulnerabilityRiskProps> = ({
  vulnerabilityByRisk,
  isLoading,
}) => {
  const { renderPercentage } = MetricsService;

  const { chartData, otherMetrics, total, chartOptions } = useDoughnutChart({
    data: vulnerabilityByRisk,
    type: ChartValueType.PLAIN,
  });

  const dataEmptyState = () => {
    return isEmptyShares(vulnerabilityByRisk);
  };
  const tableRows = Object.keys(otherMetrics).map(
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
            String(total)
          ),
          style: 'percent',
        },
      }) as Record<string, TableItem>
  );

  return (
    <div className="card risk-chart">
      <SimpleSection header="Vulnerabilities by risk" icon={<BugIcon />}>
        <div className="content">
          <Show when={!dataEmptyState()} fallback={<EmptyCard />}>
            <>
              <div className="chart">
                <Doughnut data={chartData} options={chartOptions} />
              </div>

              <TableWithoutActions
                columns={vulnerabilityRiskColumns}
                resources={tableRows}
                id={5}
                isLoading={isLoading}
              />
            </>
          </Show>
        </div>
      </SimpleSection>
    </div>
  );
};
