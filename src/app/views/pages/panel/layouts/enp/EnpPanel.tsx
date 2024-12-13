import { type FC, useEffect } from 'react';
import { useNavigate } from 'react-router';

import { ScanButton } from './components/ScanButton.tsx';
import { ReportButton } from './components/ReportButton.tsx';
import { ScanNetworkGraph } from './components/ScanNetworkGraph.tsx';
import { ModalOS } from './components/ModalOS.tsx';
import { EndpointAppProvider } from './EndpointContext.tsx';

import {
  formatDate,
  formatKeyName,
  isScanComplianceValid,
  processCompliance,
} from '@utils/helper.ts';
import { useScanLocal } from '@moduleHooks/enp/useScanLocal.ts';
import { useShowScreen } from '#commonHooks/useShowScreen.ts';
import { useEnpGetScans } from '@moduleHooks/enp/useEnpGetScans.ts';

import { ButtonLoader, MiniTriangleIcon, ShieldIcon, Show } from '../../../../components';
import './endpoints.scss';
import { useUserData } from '#commonUserHooks/useUserData.ts';

export const EnpPanel: FC = () => {
  const { getAccessToken } = useUserData();
  const [showScreen, control] = useShowScreen();
  const { refetch, scans, scansFiltered } = useEnpGetScans();
  const { scanLoading, scanLocal } = useScanLocal(getAccessToken());
  const navigate = useNavigate();

  useEffect(() => {
    refetch();
  }, [control]);

  return (
    <EndpointAppProvider>
      <main className={`enp ${showScreen && 'actived'}`}>
        <header className="enp-header">
          <h2>ENDPOINT</h2>
          <h3>DEVICE INVENTORY</h3>
        </header>

        <div className="buttons-bar">
          <div className="buttons-bar-wrapper ">
            <section>
              <ScanButton
                onClick={() => scanLocal()}
                scanLoading={scanLoading}
                scanLocal={scanLocal}
              />
            </section>
          </div>

          <div className="buttons-bar-wrapper">
            <section>
              <ReportButton
                onClick={() => {
                  true;
                }}
              />
            </section>
          </div>
        </div>

        <ModalOS />
        <div className="enp-graphics">
          <ScanNetworkGraph data={scans} filteredData={scansFiltered} />
        </div>

        <div>
          <div className="enp-table-header">
            <div className="enp-table-title">
              <h3>Scanned devices</h3>
            </div>

            <div className="enp-table-columns">
              <div className="enp-table-column">device name</div>
              <div className="enp-table-column">operating system</div>
              <div className="enp-table-column">latest scan</div>
              <div className="enp-table-column">apps found</div>
              <div className="enp-table-column">compliance ready</div>
              <div className="enp-table-column">status</div>
              <div className="enp-table-column">scans</div>
            </div>
          </div>
          <Show when={scansFiltered.length > 0}>
            <div className="enp-table-content">
              {scansFiltered.map(scan => (
                <div
                  key={`device-${scan.id}`}
                  className="enp-content-row"
                  onClick={() => {
                    navigate('/enp/' + scan.id);
                  }}>
                  <div className="enp-content-item">{scan.device_os_name}</div>
                  <div className="enp-content-item">{scan.device_os_release}</div>
                  <div className="enp-content-item">{formatDate(scan.creacion)}</div>
                  <div className="enp-content-item">{scan.apps_found}</div>
                  <div className="enp-content-item enp-compliance">
                    <Show when={processCompliance(scan) === 1}>
                      <button className="enp-btn enp-scan-btn">
                        <span>compliant</span>
                      </button>
                    </Show>
                    <Show when={!processCompliance(scan)}>
                      <button className="enp-btn enp-report-btn">
                        <span>non compliant</span>
                      </button>
                    </Show>

                    <div className="enp-compliance-details">
                      {isScanComplianceValid(scan)
                        ? Object.entries(JSON.parse(scan.report_data)).map(
                            ([key, value]: [string, any]) => (
                              <div
                                key={`scan-enp-${key}`}
                                className={
                                  (!value ? 'enp-compliance-failed' : 'enp-compliance-success') +
                                  ' flex'
                                }>
                                <Show when={!value}>
                                  <MiniTriangleIcon />
                                </Show>
                                <Show when={value}>
                                  <ShieldIcon />
                                </Show>

                                <p className="margin-start">{formatKeyName(key)}:</p>

                                <Show when={value === false || value.length === 0}>
                                  <p className="margin-start"> Not detected</p>
                                </Show>
                                <Show when={value === true}>
                                  <p className="margin-start"> Detected</p>
                                </Show>
                                <Show when={value.length != 0}>
                                  <p className="margin-start"> {value}</p>
                                </Show>
                              </div>
                            )
                          )
                        : ''}
                    </div>
                  </div>
                  <div className="enp-content-item small">
                    {Number(scan.scanned) == 1 ? (
                      <p className="p-default">Finished</p>
                    ) : (
                      <div className="enp-table-progres">
                        <ButtonLoader left="-20%" />
                        <p>In progress</p>
                      </div>
                    )}
                  </div>
                  <div className="enp-content-item small">{scan.additionalScans + 1}</div>
                </div>
              ))}
            </div>
          </Show>
          <Show when={scansFiltered.length === 0}>
            <div className="enp-empty-contaianer">
              <div className="enp-empty-message-content">
                No scans found yet, you can perform your first one by clicking on request scan.
              </div>
            </div>
          </Show>
        </div>
      </main>
    </EndpointAppProvider>
  );
};

export default EnpPanel;
