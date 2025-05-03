import { companyIdIsNull } from '@/app/constants/validations';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { useVerifyScanList } from '@moduleHooks/neuroscan/useVerifyScanList';
import { AxiosHttpService } from '@services/axiosHTTP.service';
import { useEffect, useMemo, useRef } from 'react';
import useSWR from 'swr';

export const useManageScanProgress = () => {
  const { isScanning, company, currentScan, scanProgress } = useGlobalFastFields([
    'scanProgress',
    'isScanning',
    'currentScan',
    'company',
  ]);
  const prevPhaseRef = useRef<string | null>(null);
  const intervalRef = useRef<any>();
  const { latestScan } = useVerifyScanList();

  useEffect(() => {
    console.log('currentScan from useManageScanProgress', currentScan.get);
    console.log('isScanning from useManageScanProgress', isScanning.get);
    if (isScanning.get && !latestScan) {
      isScanning.set(false);
      scanProgress.set(0);
      currentScan.set(null);
      return;
    }
    const copy = currentScan.get;
    currentScan.set(latestScan ? latestScan : copy);
    if (latestScan?.id != copy?.id) {
      scanProgress.set(0);
      isScanning.set(true);
    }
  }, [latestScan, isScanning.get, currentScan.get, scanProgress.get]);

  // —— LOGICA DE PROGRESO ——

  useEffect(() => {
    const scan = currentScan.get;
    if (!scan) {
      return;
    }

    const { phase, issues_found, issues_parsed } = scan;
    // issuesParsed = número de issues procesadas. Asumo que lo obtienes de algún lado,
    // por ejemplo scan.issues_parsed o de otro globalFastField
    const issuesParsed = issues_parsed ?? 0;

    // Si cambió de fase, reiniciamos el intervalo y el ref
    if (prevPhaseRef.current !== scan.phase) {
      clearInterval(intervalRef.current);
      prevPhaseRef.current = scan.phase;
    }

    if (phase === 'scanner') {
      // initialize
      intervalRef.current = setInterval(() => {
        scanProgress.set(Math.min(scanProgress.get + 0.5 * (1 - scanProgress.get / 25), 25));
      }, 2300);
    } else if (phase === 'parser') {
      // fase de parser: cálculo inmediato
      const base = 25;
      const max = 99;
      const ratio = issues_found > 0 ? issuesParsed / issues_found : 0;
      scanProgress.set(base + ratio * (max - base));

      // aquí podrías calcular estimatedTime si lo guardas en otro fastField,
      // igual que hacías antes. O bien dejarlo en local state.
    } else {
      scanProgress.set(100);
    }

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [currentScan.get]);
};
