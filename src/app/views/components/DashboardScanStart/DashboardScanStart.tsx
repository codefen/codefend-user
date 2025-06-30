import { useScanDashboardView } from '@/app/views/components/DashboardScanStart/useScanDashboardView';
import Tablev3 from '@table/v3/Tablev3';
import type { ColumnTableV3 } from '@interfaces/table';
import { PrimaryButton } from '@buttons/index';
import { useNavigate } from 'react-router';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { naturalTime } from '@utils/helper';
import { TABLE_KEYS } from '@/app/constants/app-texts';

const scanColumns: ColumnTableV3[] = [
  {
    header: 'date',
    key: 'creacion',
    render: val => naturalTime(val),
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
    type: TABLE_KEYS.FULL_ROW,
    key: 'm_nllm_issues_parsed',
    render: (value: any) => getTotalIssues(value),
    styles: 'item-cell-3',
    weight: '25%',
  },
];

const getTotalIssues = (scan: any) => {
  const webScanNumber = Number(scan?.m_nllm_issues_parsed);
  const leakScanNumber = Number(scan?.m_leaks_found);
  const notHaveWebScan = !webScanNumber || isNaN(webScanNumber);
  const notHaveLeakScan = !leakScanNumber || isNaN(leakScanNumber);
  if (notHaveWebScan && notHaveLeakScan) {
    return 0;
  }
  if (notHaveWebScan) {
    return leakScanNumber;
  }
  if (notHaveLeakScan) {
    return webScanNumber;
  }
  return webScanNumber + leakScanNumber;
};

export const DashboardScanStart = () => {
  const { scanDashboardView } = useScanDashboardView();
  const navigate = useNavigate();
  // const { isScanning, scanProgress, currentScan, scanNumber } = useGlobalFastFields([
  //   'isScanning',
  //   'scanProgress',
  //   'currentScan',
  //   'scanNumber',
  // ]);

  return (
    <div className="card stats">
      <div className="over">
        {/* <Show when={isScanning.get}>
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
                <StatAsset
                  value={currentScan.get?.m_nllm_issues_found}
                  valueTitle="Total Findings"
                />
                <StatAsset
                  value={`${currentScan.get?.m_nllm_issues_parsed}/${currentScan.get?.m_nllm_issues_found}`}
                  valueTitle="Analyzed findings"
                />
                <StatAsset value={`${Math.round(scanProgress.get)}%`} valueTitle="Progress" />
              </div>
            </>
          </Show> */}
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
      </div>
    </div>
  );
};
