import { ModalWrapper } from '@modals/index';
import { ScanStepType } from '@/app/constants/welcome-steps';
import { PrimaryButton } from '@buttons/index';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { useNavigate } from 'react-router';
import { GlobeWebIcon, LanIcon, SparklesIcon } from '@icons';
import { PageLoader } from '@/app/views/components/loaders/Loader';
import Show from '@/app/views/components/Show/Show';
import { useWelcomeStore } from '@stores/useWelcomeStore';
import { APP_EVENT_TYPE, AUTO_SCAN_STATE } from '@interfaces/panel';
import { formatTimeFormat } from '@utils/helper';
import { useEffect, useMemo, useState } from 'react';
import { ScanProgressBar } from '@/app/views/components/ScanProgressBar/ScanProgressBar';
import { ProgressCircle } from '@/app/views/components/ProgressCircle/ProgressCircle';

function getStatusBadge(phase: string = '', finished: string | null, launched: string) {
  if (finished || phase === ScanStepType.Finished) {
    return <div data-status="completed">Completed</div>;
  }
  if (phase === ScanStepType.Parser) {
    return <div data-status="parser">Analyzing</div>;
  }
  return <div data-status="running">Running</div>;
}

export const WelcomeFinish = ({ solved }: { solved: () => void }) => {
  const { isScanning, ...globalStore } = useGlobalFastFields([
    'isScanning',
    'currentScan',
    'scaningProgress',
    'lastScanId',
  ]);
  const navigate = useNavigate();
  const [currentScan, setCurrentScan] = useState<any>({});

  useEffect(() => {
    const _scaningProgress: Map<string, any> = globalStore.scaningProgress.get;
    const _lastScanId = globalStore.lastScanId.get;
    const _currentScan = _scaningProgress?.get?.(_lastScanId) || null;
    console.log('currentScan', { _currentScan, _scaningProgress, _lastScanId });
    if (_currentScan) {
      setCurrentScan(_currentScan);
    }
    if (_currentScan && _currentScan.status === AUTO_SCAN_STATE.SCAN_FINISHED) {
      _scaningProgress.delete(_lastScanId);
      globalStore.scaningProgress.set(_scaningProgress);
    }
  }, [globalStore.scaningProgress.get.get(globalStore.lastScanId.get)]);

  const closeModal = () => {
    solved();
    if (!isScanning.get) {
      navigate('/issues');
    }
  };
  // const scanStep = (currentScan?.phase as ScanStepType) || ScanStepType.NonScan;

  return (
    <ModalWrapper showCloseBtn={true} type="welcome-modal-container" action={solved}>
      <div className="welcome-content welcome-content-finish">
        <img className="logose" src="/codefend/logo-color.png" width={220} />
        <Show
          when={
            currentScan?.status === AUTO_SCAN_STATE.SCAN_LAUNCHED ||
            currentScan?.status === AUTO_SCAN_STATE.SCAN_FINISHED
          }
          fallback={<PageLoader />}>
          <div className={`card card-process card-process-target`}>
            <div className="over">
              <div className="target-info-container">
                <ul className="target-info-list">
                  <li><strong>Target:</strong> {currentScan?.resource_address}</li>
                  <li><strong>Started:</strong> {formatTimeFormat(currentScan?.launched)}</li>
                  <li><strong>User:</strong> {currentScan?.user_email}</li>
                </ul>
                <div className="progress-mini">
                                    <ProgressCircle 
                    progress={currentScan?.scanProgress} 
                    size={75} 
                    strokeWidth={6}
                    containerSize="5.5rem"
                    fontSize="1.1rem"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={`card card-process`}>
            <div className="over">
              <div className={'card-process-header'}>
                <div className={'card-process-header-title'}>
                                      <SparklesIcon className="codefend-text-red" />
                  <h3>AI based web scan</h3>
                </div>
                <div className={'process-badge'}>
                  {getStatusBadge(
                    currentScan?.phase,
                    currentScan?.m_nllm_finished,
                    currentScan?.m_nllm_launched
                  )}
                </div>
              </div>

              <div className={'card-process-content'}>
                <div className={'card-process-content-info'}>
                  <div className={'card-process-content-info-container'}>
                    <div className="info-item">
                      <span>Started:</span>
                      <b>{formatTimeFormat(currentScan?.m_nllm_launched)}</b>
                    </div>
                    <div className="info-item">
                      <span>Issues found:</span>
                      <b>{currentScan?.m_nllm_issues_found}</b>
                    </div>
                    <div className="info-item">
                      <span>Issues parsed:</span>
                      <b>{currentScan?.m_nllm_issues_parsed}</b>
                    </div>
                    <div className="info-item">
                      <span>Status:</span>
                      <b>{currentScan?.m_nllm_finished ? 'Completed' : 'Running'}</b>
                    </div>
                  </div>
                </div>
                <div className={'card-process-content-progress'}>
                  <div className="progress-info">
                    <ScanProgressBar progress={currentScan?.webScanProgress} />
                    <span>{Math.round(currentScan?.webScanProgress)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={`card card-process`}>
            <div className="over">
              <div className={'card-process-header'}>
                <div className={'card-process-header-title'}>
                  <LanIcon className="codefend-text-red" />
                  <h3>Attack surface discovery</h3>
                </div>
                <div className={'process-badge'}>
                  {getStatusBadge(
                    '',
                    currentScan?.m_subdomains_finished,
                    currentScan?.m_subdomains_launched
                  )}
                </div>
              </div>

              <div className={'card-process-content'}>
                <div className={'card-process-content-info'}>
                  <div className={'card-process-content-info-container'}>
                    <div className="info-item">
                      <span>Started:</span>
                      <b>{formatTimeFormat(currentScan?.m_subdomains_launched)}</b>
                    </div>
                    <div className="info-item">
                      <span>Subdomains found:</span>
                      <b>{currentScan?.m_subdomains_found}</b>
                    </div>
                    <div className="info-item">
                      <span>Status:</span>
                      <b>{currentScan?.m_subdomains_finished ? 'Completed' : 'Running'}</b>
                    </div>
                  </div>
                </div>
                <div className={'card-process-content-progress'}>
                  <div className="progress-info">
                    <ScanProgressBar progress={currentScan?.subdomainScanProgress} />
                    <span>{Math.round(currentScan?.subdomainScanProgress)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={`card card-process`}>
            <div className="over">
              <div className={'card-process-header'}>
                <div className={'card-process-header-title'}>
                                      <img src="/codefend/gota.png" alt="Drop Icon" className="codefend-text-red" style={{ width: '0.8em', height: 'auto', objectFit: 'contain', marginRight: '0.2em' }} />
                  <h3>Darkweb leaks research</h3>
                </div>
                <div className={'process-badge'}>
                  {getStatusBadge(
                    '',
                    currentScan?.m_leaks_finished,
                    currentScan?.m_leaks_launched
                  )}
                </div>
              </div>

              <div className={'card-process-content'}>
                <div className={'card-process-content-info'}>
                  <div className={'card-process-content-info-container'}>
                    <div className="info-item">
                      <span>Started:</span>
                      <b>{formatTimeFormat(currentScan?.m_leaks_launched)}</b>
                    </div>
                    <div className="info-item">
                      <span>Leaks found:</span>
                      <b>{currentScan?.m_leaks_found}</b>
                    </div>
                    <div className="info-item">
                      <span>Status:</span>
                      <b>{currentScan?.m_leaks_finished ? 'Completed' : 'Running'}</b>
                    </div>
                  </div>
                </div>
                <div className={'card-process-content-progress'}>
                  <div className="progress-info">
                    <ScanProgressBar progress={currentScan?.leaksScanProgress} />
                    <span>{Math.round(currentScan?.leaksScanProgress)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Show>

        <PrimaryButton
          text={currentScan?.phase === 'launched' ? 'Close assistant' : 'Go to issues'}
          buttonStyle={currentScan?.phase === 'launched' ? 'red' : 'black'}
          click={closeModal}
        />
      </div>
    </ModalWrapper>
  );
};
