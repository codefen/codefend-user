import { MAX_SCAN_RETRIES } from '@/app/constants/empty';
import { companyIdIsNull } from '@/app/constants/validations';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { APP_EVENT_TYPE } from '@interfaces/panel';
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
  const {
    isScanning,
    scanNumber,
    company,
    scanRetries,
    currentScan,
    appEvent,
    isInitialFetchDone,
  } = useGlobalFastFields([
    'isScanning',
    'scanNumber',
    'company',
    'scanRetries',
    'currentScan',
    'appEvent',
    'isInitialFetchDone',
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
      if (isInitialFetchDone.get) {
        console.log('initialFetchDone on onSuccess');
        scanRetries.set(MAX_SCAN_RETRIES);
        isInitialFetchDone.set(false);
      }
      const latest = getLatestScan(newData?.scans || []);
      const isActive = latest?.phase == 'scanner' || latest?.phase == 'parser';
      const isLaunchingScan = appEvent.get === APP_EVENT_TYPE.LAUNCH_SCAN;
      if (!isActive && !isLaunchingScan && scanRetries.get > 0) {
        console.log('scanRetries.get on onSuccess', scanRetries.get);
        scanRetries.set(scanRetries.get - 1);
      }
    },
  });

  // Limpiar el timeout cuando el componente se desmonte
  // useEffect(() => {
  //   return () => {
  //     console.log('scanRetries.get on return useEffect retryTimeoutRef', scanRetries.get);
  //     if (retryTimeoutRef.current) {
  //       clearTimeout(retryTimeoutRef.current);
  //     }
  //   };
  // }, []);

  const latestScan = useMemo(() => getLatestScan(data?.scans || []), [data?.scans]);

  // Efecto para manejar los reintentos
  // useEffect(() => {
  //   const handleRetry = () => {
  //     if (scanRetries.get > 0) {
  //       console.log('scanRetries.get on handleRetry', scanRetries.get);
  //       scanRetries.set(scanRetries.get - 1);
  //       // Programar el siguiente reintento
  //       retryTimeoutRef.current = setTimeout(handleRetry, 2000);
  //     }
  //   };

  //   const isLaunchingScan = appEvent.get === APP_EVENT_TYPE.LAUNCH_SCAN;
  //   const isScanFinished = appEvent.get === APP_EVENT_TYPE.SCAN_FINISHED;

  //   // Limpiar el timeout anterior si existe
  //   if (retryTimeoutRef.current) {
  //     clearTimeout(retryTimeoutRef.current);
  //     retryTimeoutRef.current = null;
  //   }

  //   // Iniciar el sistema de reintentos solo si estamos en estados específicos
  //   if ((isScanFinished || isLaunchingScan) && scanRetries.get > 0) {
  //     retryTimeoutRef.current = setTimeout(handleRetry, 2000);
  //   }

  //   return () => {
  //     if (retryTimeoutRef.current) {
  //       clearTimeout(retryTimeoutRef.current);
  //     }
  //   };
  // }, [appEvent.get, scanRetries.get]);

  useEffect(() => {
    const scanSize = data?.scans?.length;
    const isActive = latestScan?.phase == 'scanner' || latestScan?.phase == 'parser';
    const isLaunchingScan = appEvent.get === APP_EVENT_TYPE.LAUNCH_SCAN;
    const isScanLaunched = appEvent.get === APP_EVENT_TYPE.SCAN_LAUNCHED;
    const isScanFinished = appEvent.get === APP_EVENT_TYPE.SCAN_FINISHED;
    const isEventOther =
      appEvent.get !== APP_EVENT_TYPE.LAUNCH_SCAN &&
      appEvent.get !== APP_EVENT_TYPE.SCAN_FINISHED &&
      appEvent.get !== APP_EVENT_TYPE.SCAN_LAUNCHED;
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
        appEvent.set(APP_EVENT_TYPE.SCAN_LAUNCHED);
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
        appEvent.set(APP_EVENT_TYPE.SCAN_FINISHED);
        isScanning.set(false);
      } else if (isScanFinished || isLaunchingScan || isEventOther) {
        if (scanningValue) {
          isScanning.set(false);
        }
      }
    }

    // Actualizar el escaneo actual
    currentScan.set(latestScan);
  }, [data, latestScan, scanningValue, appEvent.get, scanRetries.get]);

  const isScanActive = (scan: any) => scan?.phase === 'scanner' || scan?.phase === 'parser';
  return { data: data!, latestScan, isScanActive, isScanning, appEvent };
};
