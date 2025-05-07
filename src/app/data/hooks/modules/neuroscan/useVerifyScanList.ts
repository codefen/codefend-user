import { useUserData } from '#commonUserHooks/useUserData';
import { companyIdIsNull } from '@/app/constants/validations';
import { useGlobalFastField, useGlobalFastFields } from '@/app/views/context/AppContextProvider';
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
  if (scans.length === 0) return null;
  return scans.reduce((a, b) =>
    new Date(a.creacion).getTime() > new Date(b.creacion).getTime() ? a : b
  );
};

export const useVerifyScanList = () => {
  // Recupera el company id del local storage
  const { getCompany } = useUserData();
  const { isScanning, scanNumber } = useGlobalFastFields(['isScanning', 'scanNumber']);
  const companyId = getCompany();
  const scanningValue = isScanning.get;
  const [initialFetchDone, setInitialFetchDone] = useState(false);
  const baseKey = ['modules/neuroscan/index', { company: companyId }];
  //const shouldFetch = Boolean(companyId) && (!initialFetchDone || isScanning.get);
  const swrKey = baseKey;

  const { data } = useSWR<ScanManager>(swrKey, fetcher, {
    refreshInterval: 3000,
    revalidateOnFocus: scanningValue,
    revalidateOnReconnect: scanningValue,
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
    const scanSize = data?.scans?.length;
    console.log({ scanSize });
    if (scanNumber.get != scanSize) {
      scanNumber.set(scanSize || 0);
    }
    if (!latestScan) {
      if (scanningValue) isScanning.set(false);
      return;
    }

    const isActive = latestScan.phase === 'scanner' || latestScan.phase === 'parser';

    if (scanningValue && !isActive) {
      isScanning.set(false);
    } else if (!scanningValue && isActive) {
      isScanning.set(true);
    }
  }, [latestScan, scanningValue]);

  const isScanActive = (scan: any) => scan?.phase === 'scanner' || scan?.phase === 'parser';

  return { data: data!, latestScan, isScanActive, isScanning };
};
