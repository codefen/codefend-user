import css from './dashscanstart.module.scss';
import { useScanDashboardView } from '@/app/views/pages/panel/layouts/dashboard/components/DashboardScanStart/useScanDashboardView';
import Show from '@/app/views/components/Show/Show';
import Tablev3 from '@table/v3/Tablev3';
import type { ColumnTableV3 } from '@interfaces/table';
import { PrimaryButton } from '@buttons/index';
import { useNavigate } from 'react-router';
import { StatAsset } from '@/app/views/components/stat-asset/StatAsset';
import { useGlobalFastField } from '@/app/views/context/AppContextProvider';
import { useEffect } from 'react';

const scanColumns: ColumnTableV3[] = [
  {
    header: 'date',
    key: 'creacion',
    render: val => (val ? val.split(' ')[0] : '--/--/--'),
    styles: 'item-cell-1',
    weight: '35%',
  },
  {
    header: 'domain',
    key: 'resource_address',
    render: (value: any) => value,
    styles: 'item-cell-2',
    weight: '40%',
  },
  {
    header: 'total issues',
    key: 'issues_parsed',
    render: (value: any) => value,
    styles: 'item-cell-3',
    weight: '25%',
  },
];

export const DashboardScanStart = () => {
  const { scanDashboardView } = useScanDashboardView();
  const navigate = useNavigate();
  const isScanning = useGlobalFastField('isScanning');
  const scanProgress = useGlobalFastField('scanProgress');
  const currentScan = useGlobalFastField('currentScan');

  useEffect(() => {
    if (currentScan.get && !isScanning.get) {
      isScanning.set(true);
    }
  }, [currentScan.get]);

  return (
    <div className="card">
      <Show when={isScanning.get}>
        <div className={css['scan-start']}>
          <h2>Scan in Progress</h2>
          <p>
            The automatic scanners are analyzing one of your web resources:{' '}
            {currentScan.get?.resource_address}
          </p>

          <div className={css['scan-start-progress']}>
            <div
              className={css[`scan-start-progress-bar`]}
              style={{ width: `${scanProgress.get}%` }}></div>
          </div>
        </div>
        <div className={css['scan-start-actions']}>
          <StatAsset value={currentScan.get?.issues_found} valueTitle="Total Findings" />
          <StatAsset
            value={`${currentScan.get?.issues_found}/${currentScan.get?.issues_parsed}`}
            valueTitle="Analisis completado"
          />
          <StatAsset value={`${Math.round(scanProgress.get)}%`} valueTitle="Progress" />
        </div>
      </Show>
      <Show when={!isScanning.get}>
        <div className={css['scan-start']}>
          <h2>Scan in Progress</h2>
          <p>
            The automatic scanners are analyzing one of your web resources:{' '}
            {currentScan.get?.resource_address}
          </p>

          <Tablev3
            columns={scanColumns}
            rows={scanDashboardView}
            showRows={scanDashboardView.length >= 0}
          />
          <PrimaryButton
            text="View all scans"
            buttonStyle="dark-black"
            click={() => navigate('/scans')}
          />
        </div>
      </Show>
    </div>
  );
};
