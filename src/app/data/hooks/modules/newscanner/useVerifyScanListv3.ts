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
import { all } from 'axios';
import { useEffect, useMemo, useState, useRef } from 'react';
import useSWR from 'swr';

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
  const { isOpen } = useModalStore();
  const [allActiveScan, setAllActiveScan] = useState<any[]>([]);

  const swrKey = useMemo(() => {
    if (!companyId) return null;

    return ['neuroscans/index', { company: companyId }];
  }, [companyId]);
  const swrConfig = useMemo(() => {
    const shouldRefresh = scanningValue;
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
        const currentMap = scaningProgress.get instanceof Map ? scaningProgress.get : new Map();
        const filtered = raw.filter((scan: any) => {
          const mapScan = currentMap.get(scan.id);
          // Caso 1: el scan está lanzado (activo)
          if (scan?.phase === 'launched') return true;
          // Caso 2: en la API ya terminó, pero en el mapa todavía lo tengo como no terminado
          const stillActiveInMap = mapScan?.phase === 'launched';
          const nowFinishedInApi = scan?.phase === 'finished';
          if (nowFinishedInApi && stillActiveInMap) return true;
          return false;
        });
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
    allActiveScan.forEach(scan => {
      const fixed = activeMap.get(scan.id) || {
        scanProgress: 0,
        webScanProgress: 0,
        leaksScanProgress: 0,
        subdomainScanProgress: 0,
        status: AUTO_SCAN_STATE.SCAN_LAUNCHED,
      };
      activeMap.set(scan.id, {
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
      });
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
      if (webScanPhase === 'scanner') {
        const now = Date.now(); //Hora actual podes sumar 1 cada 8seg que paso de la hora actual
        const launchedTime = new Date(m_nllm_launched).getTime();
        const elapsedSeconds = (now - launchedTime) / 1000;
        const maxProgress = 25;
        const estimatedDuration = 200;

        const progress = Math.min((elapsedSeconds / estimatedDuration) * maxProgress, maxProgress);
        webScanProgress = progress;
      } else if (webScanPhase === 'parser') {
        const m_nllm_issues_found = value?.m_nllm_issues_found;
        const m_nllm_issues_parsed = value?.m_nllm_issues_parsed;
        webScanProgress = getParserProgress(m_nllm_issues_found, m_nllm_issues_parsed);
      } else {
        webScanProgress = 100;
      }

      if (!m_leaks_finished) {
        const now = Date.now();
        const elapsedSec = Math.floor((now - m_leaks_launched) / 1000);
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
        leaksScanProgress = 100;
      }

      if (!m_subdomains_finished) {
        const now = Date.now();
        const elapsedSec = Math.floor((now - m_subdomains_launched) / 1000);
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
        subdomainScanProgress = 100;
      }

      const overallProgress = computeOverallProgress(
        webScanProgress,
        leaksScanProgress,
        subdomainScanProgress
      );
      if (value?.phase !== 'finished') {
        isAnyScanPending = true;
      }
      activeMap.set(key, {
        ...value,
        scanProgress: overallProgress,
        webScanProgress: webScanProgress,
        leaksScanProgress: leaksScanProgress,
        subdomainScanProgress: subdomainScanProgress,
        status:
          overallProgress === 100 ? AUTO_SCAN_STATE.SCAN_FINISHED : AUTO_SCAN_STATE.SCAN_LAUNCHED,
      });

      if (!isOpen && value?.phase === 'finished') {
        activeMap.delete(key);
      }
    }
    // console.log('activeMap to save', activeMap, isAnyScanPending);
    // console.log('activeMap to save', activeMap);
    scaningProgress.set(activeMap);
    isScanning.set(isAnyScanPending);
    scanVersion.set(scanVersion.get + 1); // Forzar reactividad
  }, [JSON.stringify(allActiveScan)]);
};
