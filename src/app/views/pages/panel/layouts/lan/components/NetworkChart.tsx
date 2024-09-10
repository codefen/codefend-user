import {
  MetricsService,
  ChartValueType,
  type Device,
  isEmptyData,
  osTypes,
  useDoughnutChart,
  osPercentCountColumns,
} from '../../../../../../data';
import { PageLoader } from '@defaults/loaders/Loader.tsx';
import EmptyCard from '@defaults/EmptyCard.tsx';
import SimpleSection from '@defaults/SimpleSection.tsx';
import Show from '@defaults/Show.tsx';
import { ChartIcon } from '@icons';
import { TableV2 } from '@table/tablev2.ts';
import { Doughnut } from 'react-chartjs-2';

interface LanNetworksChartProps {
  isLoading: boolean;
  internalNetwork: Device[];
}

export const LanNetworksChart: React.FC<LanNetworksChartProps> = props => {
  const { chartOptions, chartData, otherMetrics, total } = useDoughnutChart({
    data: props.internalNetwork,
    type: ChartValueType.NETWORK_OS,
  });

  const { renderPercentage } = MetricsService;

  const dataTable = Object.keys(otherMetrics).map((network: any) => ({
    ID: { value: '', style: '' },
    os: {
      value: osTypes.includes(network.toLowerCase()) ? network : 'Unknown',
      style: 'os',
    },
    count: { value: otherMetrics[network], style: 'count' },
    percent: {
      value: renderPercentage(otherMetrics[network], total),
      style: 'percent',
    },
  }));
  return (
    <>
      <div className="card risk-chart">
        <Show when={!props.isLoading} fallback={<PageLoader />}>
          <SimpleSection header="Network devices by technology" icon={<ChartIcon />}>
            <div className="content">
              <Show when={!isEmptyData(otherMetrics)} fallback={<EmptyCard />}>
                <>
                  <div className="chart">
                    <Doughnut data={chartData} options={chartOptions} />
                  </div>
                  <TableV2
                    columns={osPercentCountColumns}
                    rowsData={dataTable}
                    showEmpty={false}
                    showRows={true}
                  />
                </>
              </Show>
            </div>
          </SimpleSection>
        </Show>
      </div>
    </>
  );
};
