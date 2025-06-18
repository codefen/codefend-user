import { APP_EVENT_TYPE, AUTO_SCAN_STATE } from '@interfaces/panel';
import { useVerifyScanList } from '@moduleHooks/neuroscan/useVerifyScanList';
import { useEffect, useRef } from 'react';

export const useManageScanProgress = () => {
  const intervalRef = useRef<any>(0);
  const { currentScan, isScanning, autoScanState, scanProgress } = useVerifyScanList();

  useEffect(() => {
    if (!currentScan) return;

    if (autoScanState?.get === AUTO_SCAN_STATE.SCAN_FINISHED) {
      scanProgress.set(100);
    }
  }, [currentScan, isScanning?.get, scanProgress?.get, autoScanState?.get]);

  // —— LOGICA DE PROGRESO EN FASE "scanner" ——

  useEffect(() => {
    const scan = currentScan;
    if (!scan || scan.phase !== 'scanner' || !isScanning.get) return;
    let currentProgress = scanProgress.get;
    intervalRef.current = setInterval(() => {
      currentProgress = Math.min(currentProgress + 0.5 * (1 - currentProgress / 25), 25);
      scanProgress.set(currentProgress);
    }, 2300);

    return () => clearInterval(intervalRef.current);
  }, [currentScan?.id, currentScan?.phase]);

  // —— ACTUALIZA PROGRESO EN FASE "parser" ——
  useEffect(() => {
    const scan = currentScan;
    if (!scan || scan.phase !== 'parser' || !isScanning.get) return;

    const { found_issues, found_parsed_issues } = scan;
    const base = 25;
    const max = 99;
    const ratio = found_issues > 0 ? found_parsed_issues / found_issues : 0;
    scanProgress.set(base + ratio * (max - base));
  }, [currentScan?.m_nllm_issues_found, currentScan?.m_nllm_issues_parsed, currentScan?.phase]);
};
