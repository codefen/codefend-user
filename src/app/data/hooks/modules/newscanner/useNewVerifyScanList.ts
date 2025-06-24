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
import { useCallback } from 'react';
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

export const useNewVerifyScanList = () => {
  const { company } = useGlobalFastFields(['company']);
  const baseKey = ['modules/neuroscan/index', { company: company.get?.id }];
  const swrKey = company.get?.id ? baseKey : null;

  const { data, mutate } = useSWR<ScanManager>(swrKey, fetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    revalidateOnMount: true,
    dedupingInterval: 0,
    keepPreviousData: true,
    fallbackData: { scans: [], companyUpdated: null },
  });

  const updateCompany = useCallback(() => {
    if (data?.companyUpdated) {
      company.set(data?.companyUpdated);
    }
  }, [data?.companyUpdated]);

  return { scans: data?.scans!, updateCompany, companyId: company.get?.id };
};
