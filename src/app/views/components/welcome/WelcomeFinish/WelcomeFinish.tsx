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
  // const scanStep = (currentScan.get?.phase as ScanStepType) || ScanStepType.NonScan;

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
              <div className="card-process-header">
                <div className="card-process-header-title">
                  <GlobeWebIcon />
                  <h3>Target: {currentScan?.resource_address}</h3>
                </div>
                <div className="progress-container">
                  <ProgressCircle
                    size={40}
                    strokeWidth={4}
                    containerSize="6rem"
                    fontSize="0.9rem"
                    progress={currentScan?.scanProgress}
                  />
                  <span>Overall Progress</span>
                </div>
              </div>
              <div>
                <div>
                  <p>Started: {formatTimeFormat(currentScan?.launched)}</p>
                  <p>User: {currentScan?.user_email}</p>
                </div>
              </div>
            </div>
          </div>

          <div className={'card-process-container'}>
            <div className={`card card-process`}>
              <div className="over">
                <div className={'card-process-header'}>
                  <div className={'card-process-header-title'}>
                    <SparklesIcon className="codefend-text-red" />
                    <h3>Automatatic Web Scanner</h3>
                  </div>
                  <div className={'process-badge'}>
                    {getStatusBadge(currentScan?.m_nllm_phase, currentScan?.m_nllm_finished, '')}
                  </div>
                </div>

                <div className={'card-process-content'}>
                  <div className={'card-process-content-info'}>
                    <div className={'card-process-content-info-container'}>
                      <div className={'card-process-content-info-container-column'}>
                        <div>
                          <span>Started:</span>
                          <b>{formatTimeFormat(currentScan.get?.m_nllm_launched)}</b>
                        </div>
                      </div>
                      <div className={'card-process-content-info-container-column'}>
                        <div>
                          <span>Issues found:</span>
                          <b>{currentScan.get?.m_nllm_issues_found}</b>
                        </div>
                        <div>
                          <span>Subdomains found:</span>
                          <b>{currentScan.get?.m_nllm_issues_parsed}</b>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={'card-process-content-progress'}>
                    <ProgressCircle
                      size={60}
                      strokeWidth={6}
                      containerSize="8rem"
                      fontSize="1.125rem"
                      progress={currentScan?.webScanProgress}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className={`card card-process`}>
              <div className="over">
                <div className={'card-process-header'}>
                  <div className={'card-process-header-title'}>
                    <LanIcon className="codefend-text-red" />
                    <h3>Subdomain Discovery</h3>
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
                        <b>{currentScan.get?.m_subdomains_finished ? 'Completed' : 'Running'}</b>
                      </div>
                    </div>
                  </div>
                  <div className={'card-process-content-progress'}>
                    <ProgressCircle
                      size={60}
                      strokeWidth={6}
                      containerSize="8rem"
                      fontSize="1.125rem"
                      progress={currentScan?.subdomainScanProgress}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className={`card card-process`}>
              <div className="over">
                <div className={'card-process-header'}>
                  <div className={'card-process-header-title'}>
                    <img
                      src="public/codefend/gota.png"
                      alt="Globe Icon"
                      style={{ width: '0.9em' }}
                    />
                    <h3>Darkweb dataleaks analyzer</h3>
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
                      <div className={'card-process-content-info-container-column'}>
                        <div>
                          <span>Started:</span>
                          <b>{formatTimeFormat(currentScan.get?.m_leaks_launched)}</b>
                        </div>
                      </div>
                      <div className={'card-process-content-info-container-column'}>
                        <div>
                          <span>Breaches found:</span>
                          <b>{currentScan.get?.m_leaks_found}</b>
                        </div>
                        <div>
                          <span>User detected:</span>
                          <b>{currentScan.get?.m_leaks_social_found}</b>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={'card-process-content-progress'}>
                    <ProgressCircle
                      size={60}
                      strokeWidth={6}
                      containerSize="8rem"
                      fontSize="1.125rem"
                      progress={currentScan?.leaksScanProgress}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <div>
            {isScanning.get ? (
              <ProgressCircle progress={globalStore.scanProgress.get} />
            ) : (
              <div
                className={`${css['completion-container']} ${!isScanning.get ? css['active'] : ''}`}>
                <div className={`${css['check-circle']} ${!isScanning.get ? css['active'] : ''}`}>
                  <div className={`${css['check-icon']} ${!isScanning.get ? css['active'] : ''}`}>
                    <CheckSimpleIcon />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className={css['finish-issues-found']}>
            <div className={css['finish-vuln-box']}>
              <div className={`${css['value']} ${css['stat-complete']}`}>
                {globalStore.currentScan.get?.m_nllm_issues_found}
              </div>
              <span style={{ color: '#e84f4f' }}>Total findings</span>
            </div>
            <div
              className={`${css['finish-vuln-box']} ${!isScanning.get ? css['vul-box-complete'] : ''}`}>
              <div className={`${css['value']} ${css['stat-complete']}`}>
                {globalStore.currentScan.get?.m_nllm_issues_parsed}
              </div>
              <span>Analyzed findings</span>
            </div>
          </div>
          <div className={css['finish-text']}>
            <p>
              <b className={`${css['text-box']} ${css['svg-green']}`}>
                Current phase: {scanStepnumber[scanStep]}/{Object.keys(scanStepnumber)?.length - 2}{' '}
                - {scanStepText[scanStep]}
              </b>
            </p>
          </div> */}

          <PrimaryButton
            text={currentScan?.phase === 'launched' ? 'Close assistant' : 'Go to issues'}
            buttonStyle={currentScan?.phase === 'launched' ? 'red' : 'black'}
            click={closeModal}
          />
        </Show>
      </div>
    </ModalWrapper>
  );
};
