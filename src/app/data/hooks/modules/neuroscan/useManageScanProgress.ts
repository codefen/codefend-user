import { APP_EVENT_TYPE } from '@interfaces/panel';
import { useVerifyScanList } from '@moduleHooks/neuroscan/useVerifyScanList';
import { useEffect, useRef } from 'react';

export const useManageScanProgress = () => {
  const intervalRef = useRef<any>();
  const { currentScan, isScanning, appEvent, scanProgress } = useVerifyScanList();

  useEffect(() => {
    if (!currentScan) return;

    if (appEvent?.get === APP_EVENT_TYPE.SCAN_FINISHED) {
      scanProgress.set(100);
    }
  }, [currentScan, isScanning?.get, scanProgress?.get, appEvent?.get]);

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

    const { issues_found, issues_parsed } = scan;
    const base = 25;
    const max = 99;
    const ratio = issues_found > 0 ? issues_parsed / issues_found : 0;
    scanProgress.set(base + ratio * (max - base));
  }, [currentScan?.issues_found, currentScan?.issues_parsed, currentScan?.phase]);
};
