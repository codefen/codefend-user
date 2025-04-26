import { useUserData } from '#commonUserHooks/useUserData';
import { companyIdIsNull } from '@/app/constants/validations';
import { AxiosHttpService } from '@services/axiosHTTP.service';
import useModalStore from '@stores/modal.store';
import { useWelcomeStore } from '@stores/useWelcomeStore';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import useSWR from 'swr';

const fetcher = ([model, { company }]: any) => {
  if (companyIdIsNull(company)) return Promise.reject(false);
  return AxiosHttpService.getInstance()
    .post<any>({
      body: { company_id: company, model },
      requireSession: true,
      insecure: true,
    })
    .then(({ data }) => {
      return { scans: data?.neuroscans || [], companyUpdated: data?.company || {} };
    });
};

export const useVerifyScanList = () => {
  // Recupera el company id del local storage
  const { getCompany } = useUserData();
  // Datos necesarios para el fetch del 'modules/neuroscan/view'
  const swrKeYRef = useRef<any>(['modules/neuroscan/index', { company: getCompany() }]);

  const { data } = useSWR(swrKeYRef.current, (key: any) => fetcher(key), {
    keepPreviousData: true,
    refreshInterval: 3000,
    revalidateOnReconnect: false,
    revalidateOnFocus: true,
    revalidateOnMount: true,
    fallbackData: { scans: [], companyUpdated: {} },
  });

  return data;
};
