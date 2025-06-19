/**
 * Hook principal para la gestión de datos de escaneos
 * Este hook maneja:
 * - Obtención de la lista de escaneos desde la API
 * - Procesamiento de datos incluyendo:
 *   - ID del escaneo
 *   - Dominio (resource_address)
 *   - Estado y progreso del escaneo
 * - Integración con el sistema de filtros
 * - Actualización en tiempo real del estado de escaneos
 */

import { MAX_SCAN_RETRIES } from '@/app/constants/empty';
import { companyIdIsNull } from '@/app/constants/validations';
import { ScanStepType } from '@/app/constants/welcome-steps';
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

export const useNewVerifyScanList = () => {
  const {
    isScanning,
    scanNumber,
    company,
    scanRetries,
    currentScan,
    autoScanState,
    scanProgress,
    webScanProgress,
    leaksScanProgress,
    subdomainProgress,
  } = useGlobalFastFields([
    'isScanning',
    'scanNumber',
    'company',
    'scanRetries',
    'currentScan',
    'autoScanState',
    'scanProgress',
    'webScanProgress',
    'leaksScanProgress',
    'subdomainProgress',
  ]);
  const scanningValue = isScanning.get;
  const baseKey = ['modules/neuroscan/index', { company: company.get?.id }];
  const swrKey = company.get?.id ? baseKey : null;

  // Usar useRef para trackear el estado anterior y evitar bucles
  const previousAutoScanState = useRef<string | null>(null);
  const hasUpdatedAutoScanState = useRef(false);

  const { data, mutate } = useSWR<ScanManager>(swrKey, fetcher, {
    refreshInterval: scanRetries.get > 0 ? 2000 : 0,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    revalidateOnMount: true,
    dedupingInterval: 0,
    keepPreviousData: true,
    fallbackData: { scans: [], companyUpdated: null },
    onSuccess: (newData: any) => {
      const latest = getLatestScan(newData?.scans || []);
      const isActive = latest?.phase == 'launched';
      const isLaunchingScan =
        autoScanState.get === AUTO_SCAN_STATE.LAUNCH_SCAN ||
        autoScanState.get === AUTO_SCAN_STATE.SCAN_LAUNCHED;
      if (!isActive && !isLaunchingScan && scanRetries.get > 0) {
        scanRetries.set(scanRetries.get - 1);
      } else if ((isActive || isLaunchingScan) && scanRetries.get > 0) {
        scanRetries.set(0);
      }
    },
  });

  const latestScan = useMemo(() => getLatestScan(data?.scans || []), [data?.scans]);

  useEffect(() => {
    const scanSize = data?.scans?.length;
    const isActive = latestScan?.phase == 'launched';
    const currentAutoScanState = autoScanState.get;

    const isNotLaunching =
      currentAutoScanState == AUTO_SCAN_STATE.NON_SCANNING ||
      currentAutoScanState == AUTO_SCAN_STATE.SCAN_FINISHED;
    const isScanLaunched = currentAutoScanState == AUTO_SCAN_STATE.SCAN_LAUNCHED;

    // Update scan number if changed
    if (scanNumber.get != scanSize) {
      scanNumber.set(scanSize || 0);
    }

    if (currentScan.get?.phase === ScanStepType.LAUNCHED) {
      return;
    }

    // Comparar IDs para determinar si hay un nuevo escaneo
    const currentScanId = currentScan.get?.id;
    const latestScanId = latestScan?.id;
    const isNewScan = latestScanId && currentScanId !== latestScanId;

    // Si hay un escaneo activo, actualizar el estado
    if (isActive) {
      if (isNotLaunching && !isScanLaunched && !hasUpdatedAutoScanState.current) {
        // Si estamos lanzando y detectamos un escaneo activo, cambiar a LAUNCH_SCAN
        // Solo actualizar si no hemos actualizado ya en este ciclo
        autoScanState.set(AUTO_SCAN_STATE.LAUNCH_SCAN);
        hasUpdatedAutoScanState.current = true;
      }
      // Si hay un escaneo activo, mantener isScanning en true
      if (!scanningValue) {
        isScanning.set(true);
      }
    }

    // Actualizar el escaneo actual si es diferente al actual o si no hay uno actual
    if (isNewScan || !currentScan.get) {
      currentScan.set(latestScan);
      webScanProgress.set(0);
      leaksScanProgress.set(0);
      subdomainProgress.set(0);
      scanProgress.set(0);
    }

    // Resetear el flag cuando el estado cambie
    if (previousAutoScanState.current !== currentAutoScanState) {
      previousAutoScanState.current = currentAutoScanState;
      hasUpdatedAutoScanState.current = false;
    }
  }, [data, latestScan, scanningValue, scanRetries.get]);

  return {
    data: data!,
    currentScan: currentScan.get,
  };
};
