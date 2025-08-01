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
  const { scopeType } = useInitialDomainStore();
  const { setIsOpen, setModalId } = useModalStore();

  // TEMPORAL: Obtener datos directamente desde useNewVerifyScanList como fallback
  const { scans: directScans } = useNewVerifyScanList();
  const { theme } = useTheme();

  // TEMPORAL: Forzar ejecución de useVerifyScanListv3 para asegurar que se ejecute
  useVerifyScanListv3();

  // Usar useMemo para calcular el currentScan basado en los cambios del store
  const computedCurrentScan = useMemo(() => {
    const _scaningProgress: Map<string, any> = globalStore.scaningProgress.get;
    const _lastScanId = globalStore.lastScanId.get;
    const _currentScan = _scaningProgress?.get?.(_lastScanId) || null;

    // DEBUGGING: Log detallado del estado
    // console.log('🎯 WelcomeFinish - computedCurrentScan debug:', {
    //   lastScanId: _lastScanId,
    //   scaningProgressSize: _scaningProgress?.size || 0,
    //   scaningProgressKeys: _scaningProgress ? Array.from(_scaningProgress.keys()) : [],
    //   currentScanFromProgress: _currentScan,
    //   currentScanFromGlobal: globalStore.currentScan.get,
    //   scanVersion: globalStore.scanVersion.get,
    //   directScansLength: directScans?.length || 0,
    //   directScansFirst: directScans && directScans.length > 0 ? {
    //     id: directScans[0].id,
    //     phase: directScans[0].phase,
    //     m_nllm_issues_found: directScans[0].m_nllm_issues_found,
    //     m_nllm_issues_parsed: directScans[0].m_nllm_issues_parsed,
    //     m_leaks_found: directScans[0].m_leaks_found,
    //     m_leaks_social_found: directScans[0].m_leaks_social_found
    //   } : null
    // });

    // 🔥 MEJORA: Buscar datos frescos del backend primero
    const directScan =
      directScans && directScans.length > 0 && _lastScanId
        ? directScans.find(s => s.id === _lastScanId)
        : null;

    if (_currentScan && directScan) {
      // ✅ PRIORIDAD: Combinar datos de scaningProgress con valores frescos del backend
      // console.log('🎯 WelcomeFinish - COMBINANDO: scaningProgress + datos frescos:', {
      //   scaningProgressData: _currentScan,
      //   freshBackendData: directScan,
      //   issuesCompare: {
      //     fromProgress_found: _currentScan.m_nllm_issues_found,
      //     fromProgress_parsed: _currentScan.m_nllm_issues_parsed,
      //     fromBackend_found: directScan.m_nllm_issues_found,
      //     fromBackend_parsed: directScan.m_nllm_issues_parsed
      //   }
      // });

      // Combinar: usar progreso calculado de scaningProgress pero valores críticos del backend
      return {
        ..._currentScan,
        // ⚡ CRÍTICO: Siempre usar valores más frescos del backend para issues
        m_nllm_issues_found: directScan.m_nllm_issues_found,
        m_nllm_issues_parsed: directScan.m_nllm_issues_parsed,
        m_leaks_found: directScan.m_leaks_found,
        m_leaks_social_found: directScan.m_leaks_social_found,
        m_subdomains_found: directScan.m_subdomains_found,
        m_subdomains_found_servers: directScan.m_subdomains_found_servers,
        // También actualizar otros campos importantes
        phase: directScan.phase,
        m_nllm_phase: directScan.m_nllm_phase,
        m_nllm_finished: directScan.m_nllm_finished,
        m_leaks_finished: directScan.m_leaks_finished,
        m_subdomains_finished: directScan.m_subdomains_finished,
      };
    } else if (_currentScan) {
      // console.log('🎯 WelcomeFinish - Usando scan del scaningProgress (sin datos frescos):', _currentScan);
      return _currentScan;
    } else if (
      globalStore.currentScan.get &&
      globalStore.currentScan.get?.phase === ScanStepType.Finished
    ) {
      // console.log('🎯 WelcomeFinish - Usando scan del currentScan global (finished)');
      return mapScanObjToScanFinishedObj(globalStore.currentScan.get);
    }

    // FALLBACK: Solo datos directos si no hay otros
    if (directScan) {
      // console.log(
      //   '🎯 WelcomeFinish - FALLBACK: Usando scan directo de useNewVerifyScanList:',
      //   directScan
      // );

      // Calcular progreso correcto basado en el estado del scan
      const isFinished = directScan.phase === 'finished';
      const webScanProgress = isFinished || directScan.m_nllm_finished ? 100 : 50;
      const leaksScanProgress = isFinished || directScan.m_leaks_finished ? 100 : 50;
      const subdomainScanProgress = isFinished || directScan.m_subdomains_finished ? 100 : 50;
      const overallProgress = isFinished
        ? 100
        : (webScanProgress + leaksScanProgress + subdomainScanProgress) / 3;

      // console.log('🎯 WelcomeFinish - FALLBACK progress calculation:', {
      //   phase: directScan.phase,
      //   isFinished,
      //   webScanProgress,
      //   leaksScanProgress,
      //   subdomainScanProgress,
      //   overallProgress,
      // });

      return {
        ...directScan,
        status: isFinished ? AUTO_SCAN_STATE.SCAN_FINISHED : AUTO_SCAN_STATE.SCAN_LAUNCHED,
        scanProgress: overallProgress,
        webScanProgress,
        leaksScanProgress,
        subdomainScanProgress,
      };
    }

    // console.log('🎯 WelcomeFinish - No se encontró scan válido, devolviendo null');
    return null;
  }, [
    globalStore.lastScanId.get,
    globalStore.scaningProgress.get,
    globalStore.currentScan.get,
    globalStore.scanVersion.get,
    directScans, // TEMPORAL: Agregar directScans como dependencia
  ]);

  // useEffect para manejar la limpieza cuando el scan termina
  useEffect(() => {
    if (computedCurrentScan && computedCurrentScan.status === AUTO_SCAN_STATE.SCAN_FINISHED) {
      const _scaningProgress = globalStore.scaningProgress.get;
      const _lastScanId = globalStore.lastScanId.get;

      // Verificar que _scaningProgress sea un Map válido antes de usar .delete()
      if (_scaningProgress instanceof Map && _lastScanId) {
        _scaningProgress.delete(_lastScanId);
        globalStore.scaningProgress.set(_scaningProgress);
      }
    }
  }, [computedCurrentScan?.status]);

  // useEffect para actualizar el estado local
  useEffect(() => {
    if (computedCurrentScan) {
      // console.log('🎯 WelcomeFinish - Actualizando currentScan:', {
      //   scanId: computedCurrentScan.id || globalStore.lastScanId.get,
      //   progress: {
      //     overall: computedCurrentScan.scanProgress,
      //     web: computedCurrentScan.webScanProgress,
      //     leaks: computedCurrentScan.leaksScanProgress,
      //     subdomains: computedCurrentScan.subdomainScanProgress,
      //   },
      //   issues: {
      //     found: computedCurrentScan.m_nllm_issues_found,
      //     parsed: computedCurrentScan.m_nllm_issues_parsed,
      //     leaks: computedCurrentScan.m_leaks_found,
      //     social: computedCurrentScan.m_leaks_social_found,
      //   },
      //   phases: {
      //     main: computedCurrentScan.phase,
      //     nllm: computedCurrentScan.m_nllm_phase,
      //     nllm_launched: computedCurrentScan.m_nllm_launched,
      //     leaks_launched: computedCurrentScan.m_leaks_launched,
      //     subdomains_launched: computedCurrentScan.m_subdomains_launched,
      //   },
      //   status: computedCurrentScan.status,
      //   timestamp: new Date().toISOString(),
      // });
      setCurrentScan(computedCurrentScan);
    }
  }, [computedCurrentScan]);

  const closeModal = (markAsResolved: boolean = false) => {
    // 🚨 CRÍTICO: Solo marcar como resuelto si se especifica explícitamente
    if (markAsResolved) {
      // console.log('✅ Marcando onboarding como resuelto - usuario completó exitosamente');
      solved();
    } else {
      console.log('🔄 Cerrando modal sin marcar como resuelto - cierre automático/F5');
    }

    // ✅ DETECTAR UBICACIÓN ACTUAL: Si está en /ai-surveillance, no navegar
    const currentPath = window.location.pathname;
    // console.log('📍 Ubicación actual al cerrar modal:', currentPath);

    if (currentPath.includes('/ai-surveillance')) {
      // console.log('🎯 Cerrando modal en AI Surveillance - NO navegar, quedarse donde está');
      // Solo cerrar el modal, no navegar a ningún lado
      return;
    }

    // 🚨 BANDERA CRÍTICA: Verificar checkEmail antes de redirigir (solo para otras páginas)
    const { checkEmail } = useInitialDomainStore.getState();

    // Si viene del onboarding, siempre ir a issues con el scan específico
    // EXCEPCIÓN: No redirigir automáticamente si checkEmail es true (usuario seleccionó "check my personal email")
    if (comesFromOnboarding && !checkEmail) {
      // console.log('🚀 Redirigiendo a issues - checkEmail:', checkEmail);
      const scanId = globalStore.lastScanId.get;
      if (scanId) {
        navigate(`/issues?scan_id=${scanId}`);
      } else {
        navigate('/issues');
      }
    } else if (checkEmail) {
      // console.log('🎯 NO redirigiendo a issues - checkEmail activo:', checkEmail);
    } else if (!isScanning.get && !globalStore.currentScan.get) {
      // Lógica original para otros casos
      navigate('/issues');
    }

    // Si no se cumple ninguna condición, simplemente cierra el modal sin navegar
  };

  // ✅ ELIMINAR VALIDACIÓN DE CIERRE: El modal siempre debe poder cerrarse
  const canCloseModal = () => {
    // ✅ SIEMPRE RETORNAR TRUE: El usuario debe poder cerrar el modal en cualquier momento
    // console.log('🔓 canCloseModal - SIEMPRE permitiendo cierre del modal');
    return true;
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
    // Los botones de navegación específicos siempre pueden cerrar el modal
    // y marcan el onboarding como resuelto porque el usuario completó exitosamente
    // console.log('✅ Usuario navegó a:', path, '- marcando onboarding como resuelto');
    solved();
    navigate(path);
  };

  // Función para manejar el cierre del modal con validación
  const handleCloseAttempt = () => {
    // console.log('✅ Usuario hizo click en cerrar modal - permitiendo cierre siempre');
    // ✅ SIEMPRE PERMITIR CIERRE: El usuario debe poder cerrar el modal en cualquier momento
    const currentPath = window.location.pathname;
    const isFromAiSurveillance = currentPath.includes('/ai-surveillance');

    // console.log('🎯 Cerrando modal desde:', {
    //   currentPath,
    //   isFromAiSurveillance,
    //   scanStatus: currentScan?.status,
    //   comesFromOnboarding,
    // });

    // ✅ FORZAR CIERRE DEL MODAL usando el store
    // console.log('🔐 Forzando cierre del modal usando store...');
    setModalId('');
    setIsOpen(false);

    // Solo marcar como resuelto si NO viene de AI Surveillance (para no afectar onboarding)
    closeModal(!isFromAiSurveillance);
  };

  return (
    <ModalWrapper showCloseBtn={true} type="welcome-modal-container" action={handleCloseAttempt}>
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
          click={handleCloseAttempt}
          className="btn"
        />
      </div>
    </ModalWrapper>
  );
};
