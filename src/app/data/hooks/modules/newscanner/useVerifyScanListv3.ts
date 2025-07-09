import { MAX_SCAN_RETRIES } from '@/app/constants/empty';
import { companyIdIsNull } from '@/app/constants/validations';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { AUTO_SCAN_STATE } from '@interfaces/panel';
import {
  computeOverallProgress,
  getParserProgress,
  LEAKS_ESTIMATED_DURATION,
  SUBDOMAINS_ESTIMATED_DURATION,
} from '@moduleHooks/newscanner/useNewManageScanProgress';
import { AxiosHttpService } from '@services/axiosHTTP.service';
import useModalStore from '@stores/modal.store';
import { MODAL_KEY_OPEN } from '@/app/constants/app-texts';
import { all } from 'axios';
import { useEffect, useMemo, useState, useRef } from 'react';
import useSWR from 'swr';

// Variable global para bloquear llamadas incorrectas
const getScannerStarting = () => {
  return (window as any).SCANNER_STARTING ? (window as any).SCANNER_STARTING() : false;
};

interface ScanManager {
  scans: any[];
  companyUpdated: any;
}

const fetcher = ([model, { company }]: any) => {
  if (companyIdIsNull(company))
    return Promise.reject({
      scans: [],
      companyUpdated: null,
    });
  return AxiosHttpService.getInstance()
    .post<any>({
      body: { company_id: company },
      path: model,
      requireSession: true,
    })
    .then(({ data }) => ({
      scans: data?.neuroscans || [],
      companyUpdated: data?.company,
    }))
    .catch(err => ({
      scans: [],
      companyUpdated: null,
    }));
};

const getLatestScan = (scans: any[]) => {
  if (scans.length === 0) return null;
  return scans.reduce((a, b) =>
    new Date(a.creacion).getTime() > new Date(b.creacion).getTime() ? a : b
  );
};

const getActiveScans = (scans: any[]) => {
  if (scans?.length === 0) return [];
  return scans.filter(scan => scan?.phase == 'launched');
};

export const useVerifyScanListv3 = () => {
  const { isScanning, scanNumber, company, scaningProgress, lastScanId, scanVersion } =
    useGlobalFastFields([
      'isScanning',
      'scanNumber',
      'company',
      'scaningProgress',
      'lastScanId',
      'scanVersion',
    ]);
  const companyId = useMemo(() => company.get?.id, [company.get?.id]);
  const scanningValue = useMemo(() => isScanning.get, [isScanning.get]);
  const { isOpen, modalId } = useModalStore();
  const [allActiveScan, setAllActiveScan] = useState<any[]>([]);

  const swrKey = useMemo(() => {
    if (!companyId) return null;
    
    // PROTECCIÓN SELECTIVA: Solo bloquear ANTES de que se active isScanning
    // Una vez que isScanning = true, significa que el scan fue creado exitosamente
    const isOnboardingModal = isOpen && modalId === MODAL_KEY_OPEN.USER_WELCOME_FINISH;
    const scannerStillStarting = getScannerStarting();
    const shouldBlock = isOnboardingModal && scannerStillStarting && !scanningValue;
    
    if (shouldBlock) {
      console.log('🚫 BLOQUEANDO useVerifyScanListv3 - Esperando creación del scanner');
      return null;
    } else {
      console.log('✅ useVerifyScanListv3 - Permitiendo llamada:', { 
        isOnboardingModal,
        scannerStillStarting,
        isScanning: scanningValue,
        shouldBlock 
      });
    }

    return ['neuroscans/index', { company: companyId }];
  }, [companyId, isOpen, modalId, scanningValue]);
  const swrConfig = useMemo(() => {
    const shouldRefresh = scanningValue;
    console.log('🔄 useVerifyScanListv3 - polling config:', { shouldRefresh, interval: shouldRefresh ? 2000 : 30000 });
    return {
      refreshInterval: shouldRefresh ? 2000 : 30000,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      revalidateOnMount: true,
      dedupingInterval: 1000,
      keepPreviousData: true,
      fallbackData: { scans: [], companyUpdated: null },
      errorRetryCount: 3,
      errorRetryInterval: 1000,
      focusThrottleInterval: 5000,
      onSuccess: (data: any) => {
        const raw = data?.scans || [];
        console.log('📊 useVerifyScanListv3 - datos recibidos:', { 
          totalScans: raw.length, 
          data,
          firstScan: raw[0] ? {
            id: raw[0].id,
            phase: raw[0].phase,
            m_nllm_issues_found: raw[0].m_nllm_issues_found,
            m_nllm_issues_parsed: raw[0].m_nllm_issues_parsed,
            m_leaks_found: raw[0].m_leaks_found,
            m_leaks_social_found: raw[0].m_leaks_social_found
          } : null
        });
        const currentMap = scaningProgress.get instanceof Map ? scaningProgress.get : new Map();
        const filtered = raw.filter((scan: any) => {
          const mapScan = currentMap.get(scan.id);
          // Caso 1: el scan está lanzado (activo)
          if (scan?.phase === 'launched') return true;
          // Caso 2: en la API ya terminó, pero en el mapa todavía lo tengo como no terminado
          const stillActiveInMap = mapScan?.phase === 'launched';
          const nowFinishedInApi = scan?.phase === 'finished' || scan?.phase === 'killed';
          if (nowFinishedInApi && stillActiveInMap) return true;
          return false;
        });
        console.log('📊 useVerifyScanListv3 - scans activos filtrados:', filtered.length);
        setAllActiveScan(filtered);
      },
    };
  }, [scanningValue, scaningProgress.get]);
  const { data } = useSWR<ScanManager>(swrKey, fetcher, swrConfig);
  // const allActiveScan = useMemo(() => {
  //   const raw = data?.scans || [];
  //   const currentMap = scaningProgress.get instanceof Map ? scaningProgress.get : new Map();
  //   return raw.filter(scan => {
  //     const mapScan = currentMap.get(scan.id);
  //     // Caso 1: el scan está lanzado (activo)
  //     if (scan?.phase === 'launched') return true;
  //     // Caso 2: en la API ya terminó, pero en el mapa todavía lo tengo como no terminado
  //     const stillActiveInMap = mapScan?.phase === 'launched';
  //     const nowFinishedInApi = scan?.phase === 'finished';
  //     if (nowFinishedInApi && stillActiveInMap) return true;
  //     return false;
  //   });
  // }, [JSON.stringify(data?.scans || []), lastScanId?.get, scanningValue]);

  useEffect(() => {
    const raw = data?.scans || [];
    const activeMap = scaningProgress.get instanceof Map ? scaningProgress.get : new Map();
    const _scanSize = raw?.length;
    if (_scanSize === 0) {
      scanNumber.set(_scanSize);
    }
    let isAnyScanPending = false;
    
    console.log('🔄 useVerifyScanListv3 - Procesando allActiveScan:', {
      allActiveScanLength: allActiveScan.length,
      activeMapSize: activeMap.size,
      scansInAllActive: allActiveScan.map(s => ({
        id: s.id,
        phase: s.phase,
        m_nllm_issues_found: s.m_nllm_issues_found,
        m_nllm_issues_parsed: s.m_nllm_issues_parsed,
        m_leaks_found: s.m_leaks_found,
        m_leaks_social_found: s.m_leaks_social_found
      }))
    });
    
    allActiveScan.forEach(scan => {
      const fixed = activeMap.get(scan.id) || {
        scanProgress: 0,
        webScanProgress: 0,
        leaksScanProgress: 0,
        subdomainScanProgress: 0,
        status: AUTO_SCAN_STATE.SCAN_LAUNCHED,
      };
      
      const updatedScan = {
        ...fixed,
        phase: scan.phase,
        m_nllm_issues_found: scan?.m_nllm_issues_found,
        m_nllm_issues_parsed: scan?.m_nllm_issues_parsed,
        m_nllm_phase: scan?.m_nllm_phase,
        m_nllm_finished: scan?.m_nllm_finished,
        m_nllm_launched: scan?.m_nllm_launched,
        m_nllm_parser_finished: scan?.m_nllm_parser_finished,
        m_nllm_scanner_finished: scan?.m_nllm_scanner_finished,
        m_nllm_scanner_launched: scan?.m_nllm_scanner_launched,
        m_leaks_launched: scan?.m_leaks_launched,
        m_leaks_finished: scan?.m_leaks_finished,
        m_leaks_phase: scan?.m_leaks_phase,
        m_leaks_social_found: scan?.m_leaks_social_found,
        m_leaks_found: scan?.m_leaks_found,
        m_subdomains_launched: scan?.m_subdomains_launched,
        m_subdomains_finished: scan?.m_subdomains_finished,
        m_subdomains_found: scan?.m_subdomains_found,
        m_subdomains_found_servers: scan?.m_subdomains_found_servers,
        resource_address: scan?.resource_address,
        resource_class: scan?.resource_class,
        resource_id: scan?.resource_id,
        user_email: scan?.user_email,
        launched: scan?.launched,
      };
      
      console.log(`🔄 useVerifyScanListv3 - Actualizando scan ${scan.id}:`, {
        original: scan,
        updated: updatedScan,
        key_fields: {
          m_nllm_issues_found: updatedScan.m_nllm_issues_found,
          m_nllm_issues_parsed: updatedScan.m_nllm_issues_parsed,
          m_leaks_found: updatedScan.m_leaks_found,
          m_leaks_social_found: updatedScan.m_leaks_social_found
        },
        critical_phases: {
          phase: scan.phase,
          m_nllm_phase: scan?.m_nllm_phase,
          m_nllm_launched: scan?.m_nllm_launched,
          m_nllm_finished: scan?.m_nllm_finished,
          m_leaks_launched: scan?.m_leaks_launched,
          m_leaks_finished: scan?.m_leaks_finished,
          m_subdomains_launched: scan?.m_subdomains_launched,
          m_subdomains_finished: scan?.m_subdomains_finished
        }
      });
      
      activeMap.set(scan.id, updatedScan);
    });

    for (const [key, value] of activeMap.entries()) {
      // console.log('update progress value', value);
      const m_nllm_launched = value?.m_nllm_launched; // fecha de inicio
      const webScanPhase = value?.m_nllm_phase;
      const m_leaks_launched = new Date(value?.m_leaks_launched).getTime();
      const m_leaks_finished = value?.m_leaks_finished
        ? new Date(value?.m_leaks_finished).getTime()
        : null;
      const m_subdomains_launched = new Date(value?.m_subdomains_launched).getTime();
      const m_subdomains_finished = value?.m_subdomains_finished
        ? new Date(value?.m_subdomains_finished).getTime()
        : null;

      let webScanProgress = value?.webScanProgress;
      let leaksScanProgress = value?.leaksScanProgress;
      let subdomainScanProgress = value?.subdomainScanProgress;
      
      console.log(`🔍 useVerifyScanListv3 - Calculando progreso para scan ${key}:`, {
        webScanPhase,
        m_nllm_launched,
        m_leaks_launched,
        m_subdomains_launched,
        finished_flags: {
          m_nllm_finished: value?.m_nllm_finished,
          m_leaks_finished: value?.m_leaks_finished,
          m_subdomains_finished: value?.m_subdomains_finished
        },
        current_progress: {
          webScanProgress,
          leaksScanProgress,
          subdomainScanProgress
        }
      });
      
      if (webScanPhase === 'scanner') {
        const now = Date.now(); //Hora actual podes sumar 1 cada 8seg que paso de la hora actual
        const launchedTime = new Date(m_nllm_launched).getTime();
        const elapsedSeconds = (now - launchedTime) / 1000;
        const maxProgress = 25;
        const estimatedDuration = 200;

        const progress = Math.min((elapsedSeconds / estimatedDuration) * maxProgress, maxProgress);
        webScanProgress = progress;
        console.log(`📊 useVerifyScanListv3 - WebScan SCANNER progress: ${progress}% (elapsed: ${elapsedSeconds}s)`);
      } else if (webScanPhase === 'parser') {
        const m_nllm_issues_found = value?.m_nllm_issues_found;
        const m_nllm_issues_parsed = value?.m_nllm_issues_parsed;
        webScanProgress = getParserProgress(m_nllm_issues_found, m_nllm_issues_parsed);
        console.log(`📊 useVerifyScanListv3 - WebScan PARSER progress: ${webScanProgress}% (found: ${m_nllm_issues_found}, parsed: ${m_nllm_issues_parsed})`);
      } else if (value?.m_nllm_finished) {
        webScanProgress = 100;
        console.log(`📊 useVerifyScanListv3 - WebScan FINISHED: 100%`);
      } else {
        console.log(`📊 useVerifyScanListv3 - WebScan WAITING: ${webScanProgress}% (phase: ${webScanPhase})`);
        
        // TEMPORAL: Agregar progreso mínimo basado en tiempo cuando las fases no se actualizan
        if (!webScanPhase || webScanPhase === 'launched') {
          const now = Date.now();
          const launchedTime = new Date(m_nllm_launched).getTime();
          const elapsedSeconds = (now - launchedTime) / 1000;
          
          if (elapsedSeconds > 10) { // Después de 10 segundos, mostrar progreso mínimo
            const timeBasedProgress = Math.min(elapsedSeconds / 300 * 15, 15); // Max 15% en 5 minutos
            webScanProgress = Math.max(webScanProgress || 0, timeBasedProgress);
            console.log(`⏰ useVerifyScanListv3 - Aplicando progreso temporal basado en tiempo: ${webScanProgress}% (elapsed: ${elapsedSeconds}s)`);
          }
        }
      }

      if (!m_leaks_finished) {
        const now = Date.now();
        let elapsedSec = 0;
        
        if (value?.m_leaks_launched) {
          elapsedSec = Math.floor((now - m_leaks_launched) / 1000);
          const rawProgress = Math.min(elapsedSec / LEAKS_ESTIMATED_DURATION, 1); // normalizado [0, 1]

          // Ralentizar después del 85%
          let easedProgress;
          if (rawProgress < 0.85) {
            easedProgress = rawProgress * 98; // Escalado lineal hasta 85% → ~83.3%
          } else {
            const slowdownProgress = (rawProgress - 0.85) / (1 - 0.85); // [0,1] en el rango [0.85,1]
            const slowCurve = 1 - Math.pow(1 - slowdownProgress, 2);
            easedProgress = 83.3 + slowCurve * (98 - 83.3);
          }

          leaksScanProgress = Math.max(leaksScanProgress || 0, Math.min(easedProgress, 98));
        } else {
          // Si no hay fecha de lanzamiento, calcular desde el launch principal
          elapsedSec = Math.floor((now - new Date(value?.launched).getTime()) / 1000);
        }
        
        // TEMPORAL: Progreso mínimo si los leaks no se han lanzado pero el scan está activo
        if (!value?.m_leaks_launched && elapsedSec > 30) {
          const timeBasedProgress = Math.min(elapsedSec / 600 * 5, 5); // Max 5% en 10 minutos
          leaksScanProgress = Math.max(leaksScanProgress || 0, timeBasedProgress);
          console.log(`⏰ useVerifyScanListv3 - Leaks progreso temporal: ${leaksScanProgress}% (elapsed: ${elapsedSec}s)`);
        }
      } else {
        leaksScanProgress = 100;
      }

      if (!m_subdomains_finished) {
        const now = Date.now();
        let elapsedSec = 0;
        
        if (value?.m_subdomains_launched) {
          elapsedSec = Math.floor((now - m_subdomains_launched) / 1000);
          const rawProgress = Math.min(elapsedSec / SUBDOMAINS_ESTIMATED_DURATION, 1); // normalizado [0, 1]

          // Ralentizar después del 85%
          let easedProgress;
          if (rawProgress < 0.85) {
            easedProgress = rawProgress * 98; // Escalado lineal hasta 85% → ~83.3%
          } else {
            // Aplicamos una curva de easing más lenta a partir de 85%
            // Se mueve desde 83.3% hasta 98% lentamente
            const slowdownProgress = (rawProgress - 0.85) / (1 - 0.85); // [0,1] en el rango [0.85,1]
            const slowCurve = 1 - Math.pow(1 - slowdownProgress, 2);
            easedProgress = 83.3 + slowCurve * (98 - 83.3);
          }

          subdomainScanProgress = Math.max(subdomainScanProgress || 0, Math.min(easedProgress, 98));
        } else {
          // Si no hay fecha de lanzamiento, calcular desde el launch principal
          elapsedSec = Math.floor((now - new Date(value?.launched).getTime()) / 1000);
        }
        
        // TEMPORAL: Progreso mínimo si los subdomains no se han lanzado pero el scan está activo
        if (!value?.m_subdomains_launched && elapsedSec > 30) {
          const timeBasedProgress = Math.min(elapsedSec / 600 * 5, 5); // Max 5% en 10 minutos
          subdomainScanProgress = Math.max(subdomainScanProgress || 0, timeBasedProgress);
          console.log(`⏰ useVerifyScanListv3 - Subdomains progreso temporal: ${subdomainScanProgress}% (elapsed: ${elapsedSec}s)`);
        }
      } else {
        subdomainScanProgress = 100;
      }

      const overallProgress = computeOverallProgress(
        webScanProgress,
        leaksScanProgress,
        subdomainScanProgress
      );
      if (value?.phase !== 'finished' && value?.phase !== 'killed') {
        isAnyScanPending = true;
      }
      
      const finalStatus = overallProgress === 100 ? AUTO_SCAN_STATE.SCAN_FINISHED : AUTO_SCAN_STATE.SCAN_LAUNCHED;
      
      console.log(`📊 useVerifyScanListv3 - Progreso FINAL para scan ${key}:`, {
        webScanProgress,
        leaksScanProgress,
        subdomainScanProgress,
        overallProgress,
        finalStatus,
        phase: value?.phase,
        isAnyScanPending
      });
      
      activeMap.set(key, {
        ...value,
        scanProgress: overallProgress,
        webScanProgress: webScanProgress,
        leaksScanProgress: leaksScanProgress,
        subdomainScanProgress: subdomainScanProgress,
        status: finalStatus,
      });

      if (!isOpen && (value?.phase === 'finished' || value?.phase === 'killed')) {
        activeMap.delete(key);
      }
    }
    console.log('💾 useVerifyScanListv3 - Guardando en store:', {
      activeMapSize: activeMap.size,
      activeMapKeys: Array.from(activeMap.keys()),
      isAnyScanPending,
      scanVersion: scanVersion.get + 1,
      firstScanInMap: activeMap.size > 0 ? activeMap.values().next().value : null
    });
    
    scaningProgress.set(activeMap);
    isScanning.set(isAnyScanPending);
    scanVersion.set(scanVersion.get + 1); // Forzar reactividad
  }, [JSON.stringify(allActiveScan)]);
};
