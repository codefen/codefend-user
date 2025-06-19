import { MAX_SCAN_RETRIES } from '@/app/constants/empty';
import { companyIdIsNull } from '@/app/constants/validations';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { AUTO_SCAN_STATE } from '@interfaces/panel';
import { AxiosHttpService } from '@services/axiosHTTP.service';
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

export const useVerifyScanList = () => {
  const { isScanning, scanNumber, company, scanRetries, currentScan, autoScanState, scanProgress } =
    useGlobalFastFields([
      'isScanning',
      'scanNumber',
      'company',
      'scanRetries',
      'currentScan',
      'autoScanState',
      'scanProgress',
    ]);
  const scanningValue = isScanning.get;
  const retryTimeoutRef = useRef<any>(null);
  const baseKey = ['modules/neuroscan/index', { company: company.get?.id }];
  const swrKey = company.get?.id ? baseKey : null;
  const { data, mutate } = useSWR<ScanManager>(swrKey, fetcher, {
    refreshInterval: scanRetries.get > 0 || scanningValue ? 2000 : 0,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    revalidateOnMount: true,
    dedupingInterval: 0,
    keepPreviousData: true,
    fallbackData: { scans: [], companyUpdated: null },
    onSuccess: (newData: any) => {
      const latest = getLatestScan(newData?.scans || []);
      const isActive = latest?.phase == 'launched';
      const isLaunchingScan = autoScanState.get === AUTO_SCAN_STATE.LAUNCH_SCAN;
      if (!isActive && !isLaunchingScan && scanRetries.get > 0) {
        scanRetries.set(scanRetries.get - 1);
      }
    },
  });

  const latestScan = useMemo(() => getLatestScan(data?.scans || []), [data?.scans]);

  useEffect(() => {
    const scanSize = data?.scans?.length;
    const isActive = latestScan?.phase == 'launched';
    const isLaunchingScan = autoScanState.get === AUTO_SCAN_STATE.LAUNCH_SCAN;
    const isScanLaunched = autoScanState.get === AUTO_SCAN_STATE.SCAN_LAUNCHED;
    const isScanFinished = autoScanState.get === AUTO_SCAN_STATE.SCAN_FINISHED;
    const isEventOther =
      autoScanState.get !== AUTO_SCAN_STATE.LAUNCH_SCAN &&
      autoScanState.get !== AUTO_SCAN_STATE.SCAN_FINISHED &&
      autoScanState.get !== AUTO_SCAN_STATE.SCAN_LAUNCHED;
    // Update scan number if changed
    if (scanNumber.get != scanSize) {
      scanNumber.set(scanSize || 0);
    }

    // Si hay un escaneo activo, actualizar el estado
    if (isActive) {
      // Limpiar el sistema de reintentos si hay un escaneo activo
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }

      if (isLaunchingScan) {
        // Si estamos lanzando y detectamos un escaneo activo, cambiar a SCAN_LAUNCHED
        autoScanState.set(AUTO_SCAN_STATE.SCAN_LAUNCHED);
      }
      // Si hay un escaneo activo, mantener isScanning en true
      if (!scanningValue) {
        isScanning.set(true);
      }
      // Resetear retries cuando hay un escaneo activo
      if (scanRetries.get !== MAX_SCAN_RETRIES) {
        scanRetries.set(MAX_SCAN_RETRIES);
      }
    } else {
      // Si no hay escaneo activo
      if (isScanLaunched) {
        // Si estábamos en SCAN_LAUNCHED y ya no hay escaneo activo, cambiar a FINISHED
        autoScanState.set(AUTO_SCAN_STATE.SCAN_FINISHED);
        isScanning.set(false);
      } else if (isScanFinished || isLaunchingScan || isEventOther) {
        if (scanningValue) {
          isScanning.set(false);
        }
      }
    }

    // Actualizar el escaneo actual
    currentScan.set(latestScan);
  }, [data, latestScan, scanningValue, autoScanState.get, scanRetries.get]);

  const isScanActive = (scan: any) => scan?.phase === 'launched';
  return {
    data: data!,
    currentScan: currentScan.get,
    isScanActive,
    isScanning,
    autoScanState,
    scanProgress,
  };
};
