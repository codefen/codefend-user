import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { useVerifyScanList } from '@moduleHooks/neuroscan/useVerifyScanList';
import { useEffect, useRef } from 'react';

export const useManageScanProgress = () => {
  const { currentScan, scanProgress } = useGlobalFastFields(['scanProgress', 'currentScan']);
  const prevPhaseRef = useRef<string | null>(null);
  const intervalRef = useRef<any>();
  const { latestScan, isScanActive, isScanning } = useVerifyScanList();

  useEffect(() => {
    if (!latestScan) return;

    const isActive = isScanActive(latestScan);
    const current = currentScan.get;

    const sameScan = current?.id === latestScan.id;

    // Si está activo, actualizo todo
    if (isActive) {
      if (!sameScan) {
        scanProgress.set(0);
      }
    } else {
      if (sameScan && isScanning.get) {
        scanProgress.set(100);
      }
    }
  }, [latestScan, isScanning.get, currentScan.get, scanProgress.get]);

  // —— LOGICA DE PROGRESO EN FASE "scanner" ——

  useEffect(() => {
    const scan = currentScan.get;
    if (!scan || scan.phase !== 'scanner' || !isScanning.get) return;
    let currentProgress = scanProgress.get;
    intervalRef.current = setInterval(() => {
      currentProgress = Math.min(currentProgress + 0.5 * (1 - currentProgress / 25), 25);
      scanProgress.set(currentProgress);
    }, 2300);

    return () => clearInterval(intervalRef.current);
  }, [currentScan.get?.id, currentScan.get?.phase]);

  // —— ACTUALIZA PROGRESO EN FASE "parser" ——
  useEffect(() => {
    const scan = currentScan.get;
    if (!scan || scan.phase !== 'parser' || !isScanning.get) return;

    const { issues_found, issues_parsed } = scan;
    const base = 25;
    const max = 99;
    const ratio = issues_found > 0 ? issues_parsed / issues_found : 0;
    scanProgress.set(base + ratio * (max - base));
  }, [currentScan.get?.issues_found, currentScan.get?.issues_parsed, currentScan.get?.phase]);
};
