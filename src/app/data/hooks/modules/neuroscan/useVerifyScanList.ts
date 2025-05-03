import { useUserData } from '#commonUserHooks/useUserData';
import { companyIdIsNull } from '@/app/constants/validations';
import { useGlobalFastField } from '@/app/views/context/AppContextProvider';
import { AxiosHttpService } from '@services/axiosHTTP.service';
import useModalStore from '@stores/modal.store';
import { useEffect, useMemo, useRef, useState } from 'react';
import useSWR from 'swr';

interface ScanManager {
  scans: any[];
  companyUpdated: any;
}

const fetcher = ([model, { company }]: any) => {
  if (companyIdIsNull(company)) return Promise.reject(false);
  return AxiosHttpService.getInstance()
    .post<any>({
      body: { company_id: company, model },
      requireSession: true,
      insecure: true,
    })
    .then(({ data }) => ({
      scans: data?.neuroscans || [],
      companyUpdated: data?.company || {},
    }))
    .catch(err => ({
      scans: [],
      companyUpdated: {},
    }));
};

const getInProgress = (scans: any[]) =>
  scans.filter(s => s.phase === 'scanner' || s.phase === 'parser');

const getLatestScan = (scans: any[]) => {
  const ips = getInProgress(scans);
  if (ips.length === 0) return null;
  return ips.reduce((a, b) =>
    new Date(a.creacion).getTime() > new Date(b.creacion).getTime() ? a : b
  );
};

export const useVerifyScanList = () => {
  // Recupera el company id del local storage
  const { getCompany } = useUserData();
  const companyId = getCompany();
  const isScanning = useGlobalFastField('isScanning');

  // 2) Flag local para saber si ya hicimos la 1ª petición
  const [initialFetchDone, setInitialFetchDone] = useState(false);

  // 3) Clave SWR: existe siempre que haya companyId,
  //    pero SWR sólo la usará si `shouldFetch===true`
  const baseKey = ['modules/neuroscan/index', { company: companyId }];
  const shouldFetch = Boolean(companyId) && (!initialFetchDone || isScanning.get);
  const swrKey = shouldFetch ? baseKey : null;

  const { data } = useSWR<ScanManager>(swrKey, fetcher, {
    // Polling sólo si isScanning === true
    refreshInterval: isScanning.get ? 3000 : 0,
    // Revalidate al focus/reconnect sólo si está scanneando
    revalidateOnFocus: isScanning.get,
    revalidateOnReconnect: isScanning.get,
    // Queremos la 1ª llamada sí o sí
    revalidateOnMount: true,
    keepPreviousData: true,
    fallbackData: { scans: [], companyUpdated: {} },
    onSuccess: () => {
      if (!initialFetchDone) {
        setInitialFetchDone(true);
      }
    },
  });

  const latestScan = useMemo(() => getLatestScan(data?.scans || []), [data?.scans]);

  // Si al primer fetch detectamos un scan en curso, activamos la bandera
  useEffect(() => {
    if (latestScan && !isScanning.get) {
      isScanning.set(true);
    }
  }, [latestScan, isScanning.get]);

  return { data: data!, latestScan };
};
