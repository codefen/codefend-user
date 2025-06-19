import { APP_EVENT_TYPE, AUTO_SCAN_STATE } from '@interfaces/panel';
import { useGetActiveScan } from '@moduleHooks/newscanner/useGetActiveScan';
import { useTimedProgress } from '@moduleHooks/newscanner/useTimedProgress';
import { useCallback, useEffect, useRef } from 'react';

const getScannerProgress = (current: number) => Math.min(current + 0.5 * (1 - current / 25), 25);

export const getParserProgress = (found: number, parsed: number) => {
  const base = 25;
  const max = 99;
  const ratio = found > 0 ? parsed / found : 0;
  return base + ratio * (max - base);
};

export const computeOverallProgress = (
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

export const LEAKS_ESTIMATED_DURATION = 400; // en segundos
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
      // console.log('useNewManageScanProgress - updateOverallProgress', { web, leaks, subdomain });
      const webProgress = web ?? webScanProgress.get ?? 0;
      const leaksProgress = leaks ?? leaksScanProgress.get ?? 0;
      const subdomainProgres = subdomain ?? subdomainProgress.get ?? 0;

      return computeOverallProgress(webProgress, leaksProgress, subdomainProgres);
    },
    [webScanProgress.get, leaksScanProgress.get, subdomainProgress.get]
  );

  const stopInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const updateAllProgress = useCallback(
    (
      web = webScanProgress.get ?? 0,
      leaks = leaksScanProgress.get ?? 0,
      subs = subdomainProgress.get ?? 0
    ) => {
      const overall = computeOverallProgress(web, leaks, subs);
      scanProgress.set(overall);
    },
    [webScanProgress.get, leaksScanProgress.get, subdomainProgress.get]
  );

  useEffect(() => {
    if (currentScan && isScanning.get && autoScanState?.get === AUTO_SCAN_STATE.SCAN_FINISHED) {
      stopInterval();
      webScanProgress.set(100);
      leaksScanProgress.set(100);
      subdomainProgress.set(100);
      scanProgress.set(100);
    }
  }, [currentScan?.id, isScanning.get, autoScanState?.get]);

  // —— PROGRESO AUTOMÁTICO EN FASE "scanner" —— //
  useEffect(() => {
    stopInterval();

    if (currentScan?.m_nllm_phase !== 'scanner' || !isScanning.get) return;

    intervalRef.current = setInterval(() => {
      const current = webScanProgress.get ?? 0;
      console.log('useNewManageScanProgress - setInterval - current', current);
      const updated = getScannerProgress(current);
      console.log('useNewManageScanProgress - setInterval - updated', updated);
      webScanProgress.set(updated);
      updateAllProgress(updated);
      if (updated >= 25) stopInterval();
    }, 2300);

    return stopInterval;
  }, [currentScan?.id, currentScan?.m_nllm_phase, isScanning.get]);

  // —— PROGRESO POR ISSUES EN FASE "parser" —— //
  useEffect(() => {
    if (currentScan?.m_nllm_phase !== 'parser' || !isScanning.get) return;

    const { m_nllm_issues_found = 0, m_nllm_issues_parsed = 0 } = currentScan;
    console.log('useNewManageScanProgress - parser - current', webScanProgress.get);
    const parsedProgress = getParserProgress(
      Number(m_nllm_issues_found),
      Number(m_nllm_issues_parsed)
    );
    console.log('useNewManageScanProgress - parser - updated', parsedProgress);

    webScanProgress.set(parsedProgress);
    updateAllProgress(parsedProgress);
  }, [
    currentScan?.id,
    currentScan?.m_nllm_phase,
    currentScan?.m_nllm_issues_found,
    currentScan?.m_nllm_issues_parsed,
    isScanning.get,
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

  useEffect(() => stopInterval, [stopInterval]);
};
