import { useUserData } from '#commonUserHooks/useUserData';
import { companyIdIsNull } from '@/app/constants/validations';
import { AxiosHttpService } from '@services/axiosHTTP.service';
import { useWelcomeStore } from '@stores/useWelcomeStore';
import { useEffect, useRef } from 'react';
import useSWR from 'swr';

const fetcher = ([model, { company, resource_id, isScanRunning }]: any) => {
  if (!isScanRunning) return Promise.reject(false);
  if (companyIdIsNull(company)) return Promise.reject(false);
  return AxiosHttpService.getInstance()
    .post<any>({
      body: { company_id: company, resource_id: resource_id, model },
      requireSession: true,
    })
    .then(({ data }) => {
      return data;
    });
};

export const useVerifyScan = () => {
  const { getCompany } = useUserData();
  const { domainId, isScanRunning } = useWelcomeStore();
  const swrKeYRef = useRef<any>([
    'modules/paranoid',
    { company: getCompany(), resource_id: domainId, isScanRunning },
  ]);

  const { data, isLoading, isValidating } = useSWR(
    isScanRunning ? swrKeYRef.current : null,
    (key: any) => fetcher(key),
    {
      keepPreviousData: false,
      refreshInterval: 213000,
      revalidateOnReconnect: false,
      revalidateOnFocus: false,
      revalidateOnMount: true,
      fallbackData: [],
    }
  );

  useEffect(() => {
    swrKeYRef.current = [
      'modules/paranoid',
      { company: getCompany(), resource_id: domainId, isScanRunning },
    ];
    console.log({ data });
  }, [data, isLoading, isValidating, isScanRunning]);
};
