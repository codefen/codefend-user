import { useUserData } from '#commonUserHooks/useUserData';
import { MAX_SCAN_RETRIES } from '@/app/constants/empty';
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
  const { isScanning, scanNumber, company, scanRetries } = useGlobalFastFields([
    'isScanning',
    'scanNumber',
    'company',
    'scanRetries',
  ]);
  const scanningValue = isScanning.get;
  const [initialFetchDone, setInitialFetchDone] = useState(false);
  const baseKey = ['modules/neuroscan/index', { company: company.get?.id }];
  const swrKey = baseKey;

  const { data } = useSWR<ScanManager>(swrKey, fetcher, {
    refreshInterval: scanRetries.get > 0 || scanningValue ? 3000 : 0,
    revalidateOnFocus: scanRetries.get > 0,
    revalidateOnReconnect: scanRetries.get > 0,
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

  useEffect(() => {
    const scanSize = data?.scans?.length;
    const isActive = latestScan?.phase == 'scanner' || latestScan?.phase == 'parser';
    if (scanNumber.get != scanSize) {
      scanNumber.set(scanSize || 0);
    }
    console.log('scanRetries', { retries: scanRetries.get, isActive });
    if (!isActive && scanRetries.get > 0) {
      scanRetries.set(scanRetries.get - 1);
    }
    if (!latestScan) {
      if (scanningValue) isScanning.set(false);
      return;
    }
    if (scanningValue && !isActive) {
      isScanning.set(false);
    } else if (!scanningValue && isActive) {
      isScanning.set(true);
      scanRetries.set(MAX_SCAN_RETRIES);
    }
  }, [data, latestScan, scanningValue]);

  const isScanActive = (scan: any) => scan?.phase === 'scanner' || scan?.phase === 'parser';

  return { data: data!, latestScan, isScanActive, isScanning };
};
