import css from './dashscanstart.module.scss';
import { useScanDashboardView } from '@/app/views/components/DashboardScanStart/useScanDashboardView';
import Show from '@/app/views/components/Show/Show';
import Tablev3 from '@table/v3/Tablev3';
import type { ColumnTableV3 } from '@interfaces/table';
import { PrimaryButton } from '@buttons/index';
import { useNavigate } from 'react-router';
import { StatAsset } from '@/app/views/components/stat-asset/StatAsset';
import { useGlobalFastField, useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { useEffect } from 'react';
import { ScanProgressBar } from '@/app/views/components/ScanProgressBar/ScanProgressBar';

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
  const { isScanning, scanProgress, currentScan, scanNumber } = useGlobalFastFields([
    'isScanning',
    'scanProgress',
    'currentScan',
    'scanNumber',
  ]);

  return (
    <Show when={scanNumber.get > 0}>
      <div className="card stats">
        <div className="over">
          <Show when={isScanning.get}>
            <>
              <div className="header">
                <div className="table-title">
                  <h2>Scan in Progress</h2>
                </div>
              </div>
              <p>
                The automatic scanners are analyzing one of your web resources:{' '}
                {currentScan.get?.resource_address}
              </p>
              <ScanProgressBar progress={scanProgress.get} />

              <div className="content">
                <StatAsset value={currentScan.get?.issues_found} valueTitle="Total Findings" />
                <StatAsset
                  value={`${currentScan.get?.issues_found}/${currentScan.get?.issues_parsed}`}
                  valueTitle="Analisis completado"
                />
                <StatAsset value={`${Math.round(scanProgress.get)}%`} valueTitle="Progress" />
              </div>
            </>
          </Show>
          <Show when={!isScanning.get}>
            <>
              <div className="header">
                <div className="table-title">
                  <h2>Automatic scans</h2>
                </div>
              </div>
              <p>Currently there are no scans in progress</p>

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
            </>
          </Show>
        </div>
      </div>
    </Show>
  );
};
