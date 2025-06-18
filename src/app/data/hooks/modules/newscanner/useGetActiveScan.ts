import { companyIdIsNull } from '@/app/constants/validations';
import { ScanStepType } from '@/app/constants/welcome-steps';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { AUTO_SCAN_STATE } from '@interfaces/panel';
import { AxiosHttpService } from '@services/axiosHTTP.service';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import useSWR from 'swr';

interface FetcherResponse {
  scan: any;
  companyUpdated: any | null;
}

interface FetcherParams {
  company: any;
  scanId?: string;
}

const createOptimizedFetcher = () => {
  // Cache de promesas para evitar requests duplicados
  const requestCache = new Map<string, Promise<FetcherResponse>>();

  return ([model, { company, scanId }]: [string, FetcherParams]): Promise<FetcherResponse> => {
    // Validación temprana con mejor tipado
    if (companyIdIsNull(company)) {
      return Promise.resolve({
        scan: {},
        companyUpdated: null,
      });
    }

    // Crear clave única para el cache
    const cacheKey = `${model}-${company}-${scanId}`;

    // Verificar si ya existe una request en curso
    if (requestCache.has(cacheKey)) {
      return requestCache.get(cacheKey)!;
    }

    // Crear nueva request
    const request = AxiosHttpService.getInstance()
      .post<any>({
        body: { company_id: company, neuroscan_id: scanId },
        path: model,
        requireSession: true,
      })
      .then(({ data }) => ({
        scan: data?.neuroscan || {},
        companyUpdated: data?.company || null,
      }))
      .catch(err => {
        console.warn('Scan fetch error:', err);
        return {
          scan: {},
          companyUpdated: null,
        };
      })
      .finally(() => {
        // Limpiar cache después de completar la request
        requestCache.delete(cacheKey);
      });

    // Guardar en cache
    requestCache.set(cacheKey, request);

    return request;
  };
};
const optimizedFetcher = createOptimizedFetcher();

export const useGetActiveScan = () => {
  const {
    isScanning,
    company,
    scanRetries,
    currentScan,
    autoScanState,
    scanProgress,
    subdomainProgress,
    webScanProgress,
    leaksScanProgress,
  } = useGlobalFastFields([
    'isScanning',
    'company',
    'scanRetries',
    'currentScan',
    'autoScanState',
    'scanProgress',
    'subdomainProgress',
    'webScanProgress',
    'leaksScanProgress',
  ]);
  // Referencias para evitar re-renders innecesarios
  const previousDataRef = useRef<any | null>(null);
  const previousAutoScanStateRef = useRef<string | null>(null);
  const previousScanningValueRef = useRef<boolean>(false);

  // Memoizar valores frecuentemente accedidos
  const companyId = useMemo(() => company.get?.id, [company.get?.id]);
  const currentScanId = useMemo(() => currentScan.get?.id, [currentScan.get?.id]);
  const scanningValue = useMemo(() => isScanning.get, [isScanning.get]);
  const autoScanStateValue = useMemo(() => autoScanState.get, [autoScanState.get]);

  // Memoizar la clave de SWR para evitar re-creaciones
  const swrKey = useMemo(() => {
    if (!companyId) return null;

    return ['modules/neuroscan/view', { company: companyId, scanId: currentScanId }];
  }, [companyId, currentScanId]);
  const swrConfig = useMemo(() => {
    const shouldRefresh =
      autoScanStateValue === AUTO_SCAN_STATE.LAUNCH_SCAN ||
      autoScanStateValue === AUTO_SCAN_STATE.SCAN_LAUNCHED;

    return {
      refreshInterval: shouldRefresh ? 2000 : 0,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      revalidateOnMount: true,
      dedupingInterval: 1000, // Evitar requests duplicados en 1 segundo
      keepPreviousData: true,
      fallbackData: { scan: {}, companyUpdated: null },
      // Configuración adicional para optimización
      errorRetryCount: 3,
      errorRetryInterval: 1000,
      focusThrottleInterval: 5000, // Throttle revalidación en focus
    };
  }, [autoScanStateValue]);
  const { data, error, isLoading } = useSWR<any>(swrKey, optimizedFetcher, swrConfig);

  const isScanActive = useCallback((scan: any | null | undefined) => {
    return scan?.phase === ScanStepType.LAUNCHED;
  }, []);

  useEffect(() => {
    const currentData = data?.scan;
    const currentAutoScanState = autoScanStateValue;
    const currentScanningValue = scanningValue;

    // Early return si no hay cambios significativos
    if (
      previousDataRef.current === currentData &&
      previousAutoScanStateRef.current === currentAutoScanState &&
      previousScanningValueRef.current === currentScanningValue
    ) {
      return;
    }
    const isActive = isScanActive(currentData);

    if (isActive) {
      // Actualizar estado de auto-scan si es necesario
      if (currentAutoScanState !== AUTO_SCAN_STATE.SCAN_LAUNCHED) {
        autoScanState.set(AUTO_SCAN_STATE.SCAN_LAUNCHED);
      }

      // Iniciar scanning si no está activo
      if (!currentScanningValue) {
        isScanning.set(true);
      }
    } else if (
      !isActive &&
      (currentAutoScanState === AUTO_SCAN_STATE.SCAN_LAUNCHED ||
        currentAutoScanState === AUTO_SCAN_STATE.LAUNCH_SCAN)
    ) {
      isScanning.set(false);
      autoScanState.set(AUTO_SCAN_STATE.SCAN_FINISHED);
      scanRetries.set(2);
    }
    if (previousDataRef.current !== currentData) {
      currentScan.set(currentData || {});
    }

    // Actualizar referencias
    previousDataRef.current = currentData;
    previousAutoScanStateRef.current = currentAutoScanState;
    previousScanningValueRef.current = currentScanningValue;
  }, [
    data?.scan,
    scanningValue,
    autoScanStateValue,
    autoScanState.set,
    isScanning.set,
    currentScan.set,
  ]);

  return {
    data: data?.scan!,
    isScanActive,
    isScanning,
    autoScanState,
    scanProgress,
    subdomainProgress,
    webScanProgress,
    leaksScanProgress,
  };
};
