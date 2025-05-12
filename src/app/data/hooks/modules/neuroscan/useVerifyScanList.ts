import { MAX_SCAN_RETRIES } from '@/app/constants/empty';
import { companyIdIsNull } from '@/app/constants/validations';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { AxiosHttpService } from '@services/axiosHTTP.service';
import { useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';

interface ScanManager {
  scans: any[];
  companyUpdated: any;
}

const fetcher = ([model, { company }]: any) => {
  if (companyIdIsNull(company)) return Promise.reject(false);
  return AxiosHttpService.getInstance()
    .post<any>({
      body: { company_id: company },
      params: model,
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

const getLatestScan = (scans: any[]) => {
  if (scans.length === 0) return null;
  return scans.reduce((a, b) =>
    new Date(a.creacion).getTime() > new Date(b.creacion).getTime() ? a : b
  );
};

export const useVerifyScanList = () => {
  const { isScanning, scanNumber, company, scanRetries, currentScan } = useGlobalFastFields([
    'isScanning',
    'scanNumber',
    'company',
    'scanRetries',
    'currentScan',
  ]);
  const scanningValue = isScanning.get;
  const [initialFetchDone, setInitialFetchDone] = useState(false);
  const baseKey = ['modules/neuroscan/index', { company: company.get?.id }];
  const swrKey = baseKey;

  const { data } = useSWR<ScanManager>(swrKey, fetcher, {
    refreshInterval: scanRetries.get > 0 || scanningValue ? 3000 : 0,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
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
    if (!isActive && scanRetries.get > 0) {
      scanRetries.set(scanRetries.get - 1);
    }
    if (!latestScan) {
      if (scanningValue) isScanning.set(false);
      currentScan.set(null);
      return;
    }
    if (scanningValue && !isActive) {
      isScanning.set(false);
    } else if (!scanningValue && isActive) {
      isScanning.set(true);
      scanRetries.set(MAX_SCAN_RETRIES);
    }
    currentScan.set(latestScan);
  }, [data, latestScan, scanningValue]);

  const isScanActive = (scan: any) => scan?.phase === 'scanner' || scan?.phase === 'parser';
  console.log('data', data);
  return { data: data!, latestScan, isScanActive, isScanning };
};
