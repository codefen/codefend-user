import { useUserData } from '#commonUserHooks/useUserData';
import { companyIdIsNull } from '@/app/constants/validations';
import { AxiosHttpService } from '@services/axiosHTTP.service';
import { useWelcomeStore } from '@stores/useWelcomeStore';
import { useEffect, useRef } from 'react';
import useSWR from 'swr';

const fetcher = ([model, { company, resource_id, isScanRunning, neuroscan_id }]: any) => {
  if (!isScanRunning) return Promise.reject(false);
  if (companyIdIsNull(company)) return Promise.reject(false);
  return AxiosHttpService.getInstance()
    .post<any>({
      body: { company_id: company, resource_id: resource_id, model, neuroscan_id },
      requireSession: true,
      insecure: true,
    })
    .then(({ data }) => {
      return data;
    });
};

export const useVerifyScan = () => {
  const { getCompany } = useUserData();
  const { domainId, isScanRunning, setScanRunning, setScanStep, scanStep, neuroScanId } =
    useWelcomeStore();
  const swrKeYRef = useRef<any>([
    'modules/neuroscan/view',
    { company: getCompany(), resource_id: domainId, isScanRunning, neuroscan_id: neuroScanId },
  ]);

  const { data, isLoading, isValidating } = useSWR(swrKeYRef.current, (key: any) => fetcher(key), {
    keepPreviousData: true,
    refreshInterval: 10000,
    revalidateOnReconnect: false,
    revalidateOnFocus: true,
    revalidateOnMount: true,
    fallbackData: [],
  });

  useEffect(() => {
    swrKeYRef.current = [
      'modules/neuroscan/view',
      { company: getCompany(), resource_id: domainId, isScanRunning, neuroscan_id: neuroScanId },
    ];
    const currentPhase = data?.neuroscan?.phase;
    const hasError = data?.error === '1';
    if ((isScanRunning && currentPhase === 'finished') || hasError) {
      setScanRunning(false);
    }
    if (currentPhase !== scanStep) {
      setScanStep(currentPhase);
    }
  }, [data, isLoading, isValidating, isScanRunning, neuroScanId]);
};
