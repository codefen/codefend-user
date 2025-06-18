import { ModalWrapper } from '@modals/index';
import { ScanStepType } from '@/app/constants/welcome-steps';
import { ProgressCircle } from '@/app/views/components/ProgressCircle/ProgressCircle';
import { PrimaryButton } from '@buttons/index';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { useNavigate } from 'react-router';
import { GlobeWebIcon, LanIcon, SparklesIcon } from '@icons';
import { PageLoader } from '@/app/views/components/loaders/Loader';
import Show from '@/app/views/components/Show/Show';
import { useWelcomeStore } from '@stores/useWelcomeStore';
import { APP_EVENT_TYPE, AUTO_SCAN_STATE } from '@interfaces/panel';
import { formatTimeFormat } from '@utils/helper';

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
  const { isScanning, currentScan, ...globalStore } = useGlobalFastFields([
    'scanProgress',
    'isScanning',
    'currentScan',
    'autoScanState',
    'webScanProgress',
    'subdomainProgress',
    'leaksScanProgress',
  ]);
  const { initialDomain } = useWelcomeStore();
  const navigate = useNavigate();

  const closeModal = () => {
    solved();
    if (!isScanning.get) {
      navigate('/issues');
    }
  };
  const scanStep = (currentScan.get?.phase as ScanStepType) || ScanStepType.NonScan;

  return (
    <ModalWrapper showCloseBtn={true} type="welcome-modal-container" action={solved}>
      <div className="welcome-content welcome-content-finish">
        <img className="logose" src="/codefend/logo-color.png" width={220} />
        <Show
          when={
            isScanning.get ||
            globalStore.autoScanState.get == AUTO_SCAN_STATE.SCAN_LAUNCHED ||
            globalStore.autoScanState.get == AUTO_SCAN_STATE.SCAN_FINISHED
          }
          fallback={<PageLoader />}>
          {/* <p className={css['welcome-text']}>
            <b>
              The domain{' '}
              <span style={{ color: '#ff3939' }}>{currentScan.get?.resource_address}</span> is being
              analyzed.
            </b>{' '}
            Detected vulnerabilities and potential threats will be displayed on the dashboard and
            communicated via email. <b>You can now close this window.</b>
          </p> */}
          <div className={`card card-process card-process-target`}>
            <div className="over">
              <div className="card-process-header">
                <div className="card-process-header-title">
                  <GlobeWebIcon />
                  <h3>Target: {currentScan.get?.resource_address}</h3>
                </div>
                <div className="progress-container">
                  <ProgressCircle
                    size={40}
                    strokeWidth={4}
                    containerSize="6rem"
                    fontSize="0.9rem"
                    progress={globalStore.scanProgress.get}
                  />
                  <span>Overall Progress</span>
                </div>
              </div>
              <div>
                <div>
                  <p>Started: {formatTimeFormat(currentScan.get?.creacion)}</p>
                  <p>User: {currentScan.get?.user_email}</p>
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
                    {getStatusBadge(
                      currentScan.get?.m_nllm_phase,
                      currentScan.get?.m_nllm_finished,
                      ''
                    )}
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
                      progress={globalStore.webScanProgress.get}
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
                      currentScan.get?.m_subdomains_finished,
                      currentScan.get?.m_subdomains_launched
                    )}
                  </div>
                </div>

                <div className={'card-process-content'}>
                  <div className={'card-process-content-info'}>
                    <div className={'card-process-content-info-container'}>
                      <div>
                        <span>Started:</span>
                        <b>{formatTimeFormat(currentScan.get?.m_subdomains_launched)}</b>
                      </div>
                      <div>
                        <span>Subdomains found:</span>
                        <b>{currentScan.get?.m_subdomains_found}</b>
                      </div>
                    </div>
                  </div>
                  <div className={'card-process-content-progress'}>
                    <ProgressCircle
                      size={60}
                      strokeWidth={6}
                      containerSize="8rem"
                      fontSize="1.125rem"
                      progress={globalStore.subdomainProgress.get}
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
                    <h3>Data Data Breach Hunter</h3>
                  </div>
                  <div className={'process-badge'}>
                    {getStatusBadge(
                      '',
                      currentScan.get?.m_subdomains_finished,
                      currentScan.get?.m_subdomains_launched
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
                      progress={globalStore.leaksScanProgress.get}
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
            text={isScanning.get ? 'Close assistant' : 'Go to issues'}
            buttonStyle={isScanning.get ? 'red' : 'black'}
            click={closeModal}
          />
        </Show>
      </div>
    </ModalWrapper>
  );
};
