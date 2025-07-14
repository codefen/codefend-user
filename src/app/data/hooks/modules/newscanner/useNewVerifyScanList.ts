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

import { companyIdIsNull } from '@/app/constants/validations';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { AxiosHttpService } from '@services/axiosHTTP.service';
import { useCallback, useMemo } from 'react';
import useSWR from 'swr';
import useModalStore from '@stores/modal.store';
import { MODAL_KEY_OPEN } from '@/app/constants/app-texts';

// Variable global para bloquear llamadas incorrectas
const getScannerStarting = () => {
  return (window as any).SCANNER_STARTING ? (window as any).SCANNER_STARTING() : false;
};

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
    .then(({ data }) => {
      return {
        scans: data?.neuroscans || [],
        companyUpdated: data?.company,
      };
    })
    .catch(err => ({
      scans: [],
      companyUpdated: null,
    }));
};

export const useNewVerifyScanList = () => {
  const { company, isScanning } = useGlobalFastFields(['company', 'isScanning']);
  const { isOpen, modalId } = useModalStore();
  const baseKey = ['neuroscans/index', { company: company.get?.id }];

  // PROTECCIÓN SELECTIVA: Solo bloquear ANTES de que se active isScanning
  // Una vez que isScanning = true, significa que el scan fue creado exitosamente
  const isOnboardingModal = isOpen && modalId === MODAL_KEY_OPEN.USER_WELCOME_FINISH;
  const scannerStillStarting = getScannerStarting();
  const shouldSkipCall = isOnboardingModal && scannerStillStarting && !isScanning.get;

  // if (shouldSkipCall) {
  //   console.log('🚫 BLOQUEANDO useNewVerifyScanList - Esperando creación del scanner');
  // } else {
  //   console.log('✅ useNewVerifyScanList - Permitiendo llamada:', {
  //     isOnboardingModal,
  //     scannerStillStarting,
  //     isScanning: isScanning.get,
  //     shouldSkipCall
  //   });
  // }

  const swrKey = company.get?.id && !shouldSkipCall ? baseKey : null;

  // Configuración inicial del SWR
  const { data, mutate } = useSWR<ScanManager>(swrKey, fetcher, {
    refreshInterval: 3000, // 3 segundos por defecto
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    revalidateOnMount: true,
    dedupingInterval: 1000,
    keepPreviousData: true,
    fallbackData: { scans: [], companyUpdated: null },
    onSuccess: (responseData: any) => {
      const scans = responseData?.scans || [];
      const hasActiveScans = scans.some((scan: any) => {
        const isActive = !scan.finished && scan.phase !== 'finished' && scan.phase !== 'killed';
        return isActive;
      });

      // console.log('📊 useNewVerifyScanList - datos actualizados:', {
      //   totalScans: scans.length,
      //   hasActiveScans,
      //   activeScans: scans.filter((s: any) => !s.finished && s.phase !== 'finished').length,
      //   scans: scans.map((s: any) => ({
      //     id: s.id,
      //     domain: s.resource_address,
      //     phase: s.phase,
      //     finished: s.finished,
      //     found: s.m_nllm_issues_found,
      //     parsed: s.m_nllm_issues_parsed,
      //   })),
      // });
    },
  });

  const updateCompany = useCallback(() => {
    if (data?.companyUpdated) {
      company.set(data?.companyUpdated);
    }
  }, [data?.companyUpdated]);

  return { scans: data?.scans || [], updateCompany, companyId: company.get?.id, mutate };
};
