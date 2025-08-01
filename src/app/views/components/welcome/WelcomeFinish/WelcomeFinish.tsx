import { ModalWrapper } from '@modals/index';
import { ScanStepType } from '@/app/constants/welcome-steps';
import { PrimaryButton } from '@buttons/index';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { Link, useNavigate } from 'react-router';
import { GlobeWebIcon, LanIcon, SparklesIcon } from '@icons';
import { PageLoader } from '@/app/views/components/loaders/Loader';
import Show from '@/app/views/components/Show/Show';
import { useWelcomeStore } from '@stores/useWelcomeStore';
import { APP_EVENT_TYPE, AUTO_SCAN_STATE } from '@interfaces/panel';
import { formatTimeFormat } from '@utils/helper';
import { useEffect, useMemo, useState } from 'react';
import { ScanProgressBar } from '@/app/views/components/ScanProgressBar/ScanProgressBar';
import { ProgressCircle } from '@/app/views/components/ProgressCircle/ProgressCircle';
import { useValueFlash } from '@/app/data/hooks/common/useValueFlash';
import { mapScanObjToScanFinishedObj } from '@utils/mapper';
import { useNewVerifyScanList } from '@moduleHooks/newscanner/useNewVerifyScanList';
import { useVerifyScanListv3 } from '@moduleHooks/newscanner/useVerifyScanListv3';
import { useInitialDomainStore } from '@stores/initialDomain.store';
import useModalStore from '@stores/modal.store';
import { useTheme } from '@/app/views/context/ThemeContext';

function getStatusBadge(phase: string = '', finished: string | null, launched: string) {
  if (finished || phase === ScanStepType.Finished) {
    return <div data-status="completed">Finished</div>;
  }
  if (phase === ScanStepType.Parser) {
    return <div data-status="parser">Analyzing</div>;
  }
  return <div data-status="running">Operational</div>;
}

export const WelcomeFinish = ({
  solved,
  comesFromOnboarding = false,
}: {
  solved: () => void;
  comesFromOnboarding?: boolean;
}) => {
  const { isScanning, ...globalStore } = useGlobalFastFields([
    'isScanning',
    'currentScan',
    'scaningProgress',
    'lastScanId',
    'scanVersion',
  ]);
  const navigate = useNavigate();
  const [currentScan, setCurrentScan] = useState<any>({});
  const { theme } = useTheme();

  // Usar useMemo para calcular el currentScan basado en los cambios del store
  const computedCurrentScan = useMemo(() => {
    const _scaningProgress: Map<string, any> = globalStore.scaningProgress.get;
    const _lastScanId = globalStore.lastScanId.get;
    const _currentScan = _scaningProgress?.get?.(_lastScanId) || null;
    // console.log('currentScan', { _currentScan, _scaningProgress, _lastScanId });

    if (_currentScan) {
      return _currentScan;
    } else if (
      globalStore.currentScan.get &&
      globalStore.currentScan.get?.phase === ScanStepType.Finished
    ) {
      return mapScanObjToScanFinishedObj(globalStore.currentScan.get);
    }
    return null;
  }, [
    globalStore.lastScanId.get,
    globalStore.scaningProgress.get,
    globalStore.currentScan.get,
    globalStore.scanVersion.get,
  ]);

  // useEffect para manejar la limpieza cuando el scan termina
  useEffect(() => {
    if (computedCurrentScan && computedCurrentScan.status === AUTO_SCAN_STATE.SCAN_FINISHED) {
      const _scaningProgress: Map<string, any> = globalStore.scaningProgress.get;
      const _lastScanId = globalStore.lastScanId.get;
      _scaningProgress.delete(_lastScanId);
      globalStore.scaningProgress.set(_scaningProgress);
    }
  }, [computedCurrentScan?.status]);

  // useEffect para actualizar el estado local
  useEffect(() => {
    if (computedCurrentScan) {
      setCurrentScan(computedCurrentScan);
    }
  }, [computedCurrentScan]);

  const closeModal = () => {
    solved();
    if (!isScanning.get && !globalStore.currentScan.get) {
      navigate('/issues');
    }
  };
  // const scanStep = (currentScan?.phase as ScanStepType) || ScanStepType.NonScan;

  const issuesFoundFlash = useValueFlash(currentScan?.m_nllm_issues_found);
  const issuesParsedFlash = useValueFlash(currentScan?.m_nllm_issues_parsed);
  const subdomainsFoundFlash = useValueFlash(currentScan?.m_subdomains_found);
  const serversDetectedFlash = useValueFlash(currentScan?.m_subdomains_found_servers);
  const leaksFoundFlash = useValueFlash(currentScan?.m_leaks_found);
  const socialLeaksFlash = useValueFlash(currentScan?.m_leaks_social_found);

  const navigateTo = (path: string, isDisabled: boolean) => {
    if (isDisabled) return;
    solved();
    navigate(path);
  };

  return (
    <ModalWrapper showCloseBtn={true} type="welcome-modal-container" action={solved}>
      <div className="welcome-content welcome-content-finish">
        <img className="logose" src={`/codefend/brand-small-${theme}.png`} width={120} />
        <Show
          when={
            currentScan?.status === AUTO_SCAN_STATE.SCAN_LAUNCHED ||
            currentScan?.status === AUTO_SCAN_STATE.SCAN_FINISHED
          }
          fallback={<PageLoader />}>
          <div className="scan-header-info">
            <div className="scan-header-row">
              <div className="scan-basic-info">
                <p>
                  AI-based scan performed on <b>{currentScan?.resource_address}</b> initiated by{' '}
                  {currentScan?.user_email} at {formatTimeFormat(currentScan?.launched)}.
                </p>
              </div>
              <div className="progress-mini">
                <ProgressCircle
                  progress={currentScan?.scanProgress}
                  size={65}
                  strokeWidth={5}
                  containerSize="4.5rem"
                  fontSize="1rem"
                />
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
                      <span>Detected issues:</span>
                      <b className={issuesFoundFlash}>{currentScan?.m_nllm_issues_found}</b>
                    </div>
                    <div
                      className={`info-item ${currentScan?.m_nllm_issues_parsed > 0 ? 'clickable' : 'disabled'}`}
                      onClick={() =>
                        currentScan?.m_nllm_issues_parsed > 0 &&
                        window.open(
                          `/issues?resourceClass=web&scan_id=${globalStore.lastScanId.get}`,
                          '_blank'
                        )
                      }
                      style={{
                        cursor: currentScan?.m_nllm_issues_parsed > 0 ? 'pointer' : 'default',
                        opacity: currentScan?.m_nllm_issues_parsed > 0 ? 1 : 0.6,
                        transition: 'all 0.2s ease',
                        padding: '8px',
                        borderRadius: '4px',
                        backgroundColor: 'transparent',
                      }}
                      onMouseEnter={e => {
                        if (currentScan?.m_nllm_issues_parsed > 0) {
                          e.currentTarget.style.backgroundColor = 'rgba(255, 69, 58, 0.1)';
                        }
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}>
                      <span>Analyzed issues:</span>
                      <b className={issuesParsedFlash}>{currentScan?.m_nllm_issues_parsed}</b>
                    </div>
                    {/* <div className="info-item">
                      <span>Status:</span>
                      <b>{currentScan?.m_nllm_finished ? 'Finished' : 'Operational'}</b>
                    </div> */}
                  </div>
                </div>
                <div className={'card-process-content-progress'}>
                  <div className="progress-info">
                    <ScanProgressBar
                      progress={currentScan?.webScanProgress}
                      isCompleted={currentScan?.m_nllm_finished}
                    />
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
                    <div
                      className={`info-item ${currentScan?.m_subdomains_found > 0 ? 'clickable' : 'disabled'}`}
                      onClick={() =>
                        currentScan?.m_subdomains_found > 0 && window.open('/web', '_blank')
                      }
                      style={{
                        cursor: currentScan?.m_subdomains_found > 0 ? 'pointer' : 'default',
                        opacity: currentScan?.m_subdomains_found > 0 ? 1 : 0.6,
                        transition: 'all 0.2s ease',
                        padding: '8px',
                        borderRadius: '4px',
                        backgroundColor: 'transparent',
                      }}
                      onMouseEnter={e => {
                        if (currentScan?.m_subdomains_found > 0) {
                          e.currentTarget.style.backgroundColor = 'rgba(255, 69, 58, 0.1)';
                        }
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}>
                      <span>Subdomains found:</span>
                      <b className={subdomainsFoundFlash}>{currentScan?.m_subdomains_found}</b>
                    </div>
                    <div
                      className={`info-item ${currentScan?.m_subdomains_found_servers > 0 ? 'clickable' : 'disabled'}`}
                      onClick={() =>
                        currentScan?.m_subdomains_found_servers > 0 &&
                        window.open('/network', '_blank')
                      }
                      style={{
                        cursor: currentScan?.m_subdomains_found_servers > 0 ? 'pointer' : 'default',
                        opacity: currentScan?.m_subdomains_found_servers > 0 ? 1 : 0.6,
                        transition: 'all 0.2s ease',
                        padding: '8px',
                        borderRadius: '4px',
                        backgroundColor: 'transparent',
                      }}
                      onMouseEnter={e => {
                        if (currentScan?.m_subdomains_found_servers > 0) {
                          e.currentTarget.style.backgroundColor = 'rgba(255, 69, 58, 0.1)';
                        }
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}>
                      <span>Detected servers:</span>
                      <b className={serversDetectedFlash}>
                        {currentScan?.m_subdomains_found_servers ?? 0}
                      </b>
                    </div>
                  </div>
                </div>
                <div className={'card-process-content-progress'}>
                  <div className="progress-info">
                    <ScanProgressBar
                      progress={currentScan?.subdomainScanProgress}
                      isCompleted={currentScan?.m_subdomains_finished}
                    />
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
                  <img
                    src="/codefend/gota.png"
                    alt="Drop Icon"
                    className="codefend-text-red"
                    style={{
                      width: '0.8em',
                      height: 'auto',
                      objectFit: 'contain',
                      marginRight: '0.2em',
                    }}
                  />
                  <h3>Darkweb leaks research</h3>
                </div>
                <div className={'process-badge'}>
                  {getStatusBadge('', currentScan?.m_leaks_finished, currentScan?.m_leaks_launched)}
                </div>
              </div>

              <div className={'card-process-content'}>
                <div className={'card-process-content-info'}>
                  <div className={'card-process-content-info-container'}>
                    <div className="info-item">
                      <span>Started:</span>
                      <b>{formatTimeFormat(currentScan?.m_leaks_launched)}</b>
                    </div>
                    <div
                      className={`info-item ${currentScan?.m_leaks_found > 0 ? 'clickable' : 'disabled'}`}
                      onClick={() =>
                        currentScan?.m_leaks_found > 0 &&
                        window.open(
                          `/issues?resourceClass=leaks&scan_id=${globalStore.lastScanId.get}`,
                          '_blank'
                        )
                      }
                      style={{
                        cursor: currentScan?.m_leaks_found > 0 ? 'pointer' : 'default',
                        opacity: currentScan?.m_leaks_found > 0 ? 1 : 0.6,
                        transition: 'all 0.2s ease',
                        padding: '8px',
                        borderRadius: '4px',
                        backgroundColor: 'transparent',
                      }}
                      onMouseEnter={e => {
                        if (currentScan?.m_leaks_found > 0) {
                          e.currentTarget.style.backgroundColor = 'rgba(255, 69, 58, 0.1)';
                        }
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}>
                      <span>Leaks found:</span>
                      <b className={leaksFoundFlash}>{currentScan?.m_leaks_found}</b>
                    </div>
                    <div
                      className={`info-item ${currentScan?.m_leaks_social_found > 0 ? 'clickable' : 'disabled'}`}
                      onClick={() =>
                        currentScan?.m_leaks_social_found > 0 &&
                        window.open(
                          `/social?resource_domain=${currentScan?.resource_address}`,
                          '_blank'
                        )
                      }
                      style={{
                        cursor: currentScan?.m_leaks_social_found > 0 ? 'pointer' : 'default',
                        opacity: currentScan?.m_leaks_social_found > 0 ? 1 : 0.6,
                        transition: 'all 0.2s ease',
                        padding: '8px',
                        borderRadius: '4px',
                        backgroundColor: 'transparent',
                      }}
                      onMouseEnter={e => {
                        if (currentScan?.m_leaks_social_found > 0) {
                          e.currentTarget.style.backgroundColor = 'rgba(255, 69, 58, 0.1)';
                        }
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}>
                      <span>Social leaks:</span>
                      <b className={socialLeaksFlash}>{currentScan?.m_leaks_social_found || 0}</b>
                    </div>
                  </div>
                </div>
                <div className={'card-process-content-progress'}>
                  <div className="progress-info">
                    <ScanProgressBar
                      progress={currentScan?.leaksScanProgress}
                      isCompleted={currentScan?.m_leaks_finished}
                    />
                    <span>{Math.round(currentScan?.leaksScanProgress)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Show>

        <PrimaryButton
          text="Close scanner overview"
          buttonStyle="black"
          click={closeModal}
          className="btn"
        />
      </div>
    </ModalWrapper>
  );
};
