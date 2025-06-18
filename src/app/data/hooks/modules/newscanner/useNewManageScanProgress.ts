import { APP_EVENT_TYPE, AUTO_SCAN_STATE } from '@interfaces/panel';
import { useGetActiveScan } from '@moduleHooks/newscanner/useGetActiveScan';
import { useTimedProgress } from '@moduleHooks/newscanner/useTimedProgress';
import { useCallback, useEffect, useRef } from 'react';

const getScannerProgress = (current: number) => Math.min(current + 0.5 * (1 - current / 25), 25);

const getParserProgress = (found: number, parsed: number) => {
  const base = 25;
  const max = 99;
  const ratio = found > 0 ? parsed / found : 0;
  return base + ratio * (max - base);
};

const computeOverallProgress = (
  webScanProgress: number,
  leaksScanProgress: number,
  subdomainProgress: number
) => {
  // console.log({ webScanProgress, leaksScanProgress, subdomainProgress });
  const progresses = [webScanProgress, leaksScanProgress, subdomainProgress];
  const validProgresses = progresses.filter(val => typeof val === 'number' && !isNaN(val));
  if (validProgresses.length === 0) return 0;
  const sum = validProgresses.reduce((acc, val) => acc + val, 0);
  return sum / validProgresses.length;
};

const LEAKS_ESTIMATED_DURATION = 700; // en segundos
const SUBDOMAINS_ESTIMATED_DURATION = 600; // en segundos

export const useNewManageScanProgress = () => {
  const intervalRef = useRef<any>(0);
  const {
    data: currentScan,
    isScanning,
    autoScanState,
    scanProgress,
    subdomainProgress,
    webScanProgress,
    leaksScanProgress,
  } = useGetActiveScan();
  const updateOverallProgress = useCallback(
    (web?: number, leaks?: number, subdomain?: number) => {
      const webProgress = web ?? webScanProgress.get ?? 0;
      const leaksProgress = leaks ?? leaksScanProgress.get ?? 0;
      const subdomainProgres = subdomain ?? subdomainProgress.get ?? 0;

      return computeOverallProgress(webProgress, leaksProgress, subdomainProgres);
    },
    [webScanProgress.get, leaksScanProgress.get, subdomainProgress.get]
  );

  const clearCurrentInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!currentScan) return;
    if (isScanning.get && autoScanState?.get === AUTO_SCAN_STATE.SCAN_FINISHED) {
      clearCurrentInterval();
      webScanProgress.set(100);
      leaksScanProgress.set(100);
      subdomainProgress.set(100);
      scanProgress.set(100);
    }
  }, [currentScan, isScanning?.get, autoScanState?.get]);

  // —— PROGRESO AUTOMÁTICO EN FASE "scanner" —— //
  useEffect(() => {
    clearCurrentInterval();

    const scan = currentScan;
    const isCurrentlyScanning = isScanning.get;
    if (!scan || scan.m_nllm_phase !== 'scanner' || !isCurrentlyScanning) {
      return;
    }

    let current = webScanProgress.get ?? 0;
    intervalRef.current = setInterval(() => {
      // Verificar si aún estamos escaneando antes de actualizar
      if (!isScanning.get) {
        clearCurrentInterval();
        return;
      }
      console.log('current', current);
      current = getScannerProgress(current);
      webScanProgress.set(current);

      const overallProgress = updateOverallProgress(current, undefined, undefined);
      scanProgress.set(overallProgress);

      // Si llegamos al máximo, limpiar el intervalo
      if (current >= 25) {
        clearCurrentInterval();
      }
    }, 2300);

    return clearCurrentInterval;
  }, [currentScan?.id, currentScan?.m_nllm_phase]);

  // —— PROGRESO POR ISSUES EN FASE "parser" —— //
  useEffect(() => {
    const scan = currentScan;
    const isCurrentlyScanning = isScanning.get;

    if (!scan || scan.m_nllm_phase !== 'parser' || !isCurrentlyScanning) {
      return;
    }

    const { m_nllm_issues_found: found = 0, m_nllm_issues_parsed: parsed = 0 } = scan;

    const progress = getParserProgress(Number(found), Number(parsed));
    webScanProgress.set(progress);
    scanProgress.set(updateOverallProgress(progress, undefined, undefined));
  }, [
    currentScan?.id,
    currentScan?.m_nllm_phase,
    currentScan?.m_nllm_issues_found,
    currentScan?.m_nllm_issues_parsed,
  ]);

  // —— PROGRESO LEAKS POR TIEMPO —— //
  useTimedProgress(
    currentScan?.m_leaks_launched,
    currentScan?.m_leaks_finished,
    LEAKS_ESTIMATED_DURATION,
    leaksScanProgress.set,
    current => scanProgress.set(updateOverallProgress(undefined, current, undefined))
  );

  // —— PROGRESO SUBDOMINIOS POR TIEMPO —— //
  useTimedProgress(
    currentScan?.m_subdomains_launched,
    currentScan?.m_subdomains_finished,
    SUBDOMAINS_ESTIMATED_DURATION,
    subdomainProgress.set,
    current => scanProgress.set(updateOverallProgress(undefined, undefined, current))
  );

  useEffect(() => {
    return clearCurrentInterval;
  }, [clearCurrentInterval]);
};
