import { useUserData } from '#commonUserHooks/useUserData';
import { EMPTY_COMPANY_CUSTOM } from '@/app/constants/empty';
import { apiErrorValidation, companyIdIsNull, verifySession } from '@/app/constants/validations';
import { AxiosHttpService } from '@services/axiosHTTP.service';
import { useRef } from 'react';
import useSWR from 'swr';

export const EMPTY_COMPANY_PREFERENCE = {
  company_members: [],
  company: EMPTY_COMPANY_CUSTOM,
};

const fetcher = ([model, { company, logout }]: any) => {
  if (companyIdIsNull(company)) return Promise.reject(EMPTY_COMPANY_PREFERENCE);
  const axiosHttp = AxiosHttpService.getInstance();
  axiosHttp.updateUrlInstance();
  return axiosHttp
    .post<any>({
      body: { company_id: company, model },
    })
    .then(({ data }) => {
      if (verifySession(data, logout)) return;
      if (apiErrorValidation(data?.error, data?.response)) {
        throw new Error('');
      }
      return data
        ? {
            issues: data.issues ? data.issues : [],
            issues_condicion: data.issues_condicion,
            issues_share: data.issues_share,
            members: data.members ? data.members : [],
            resources: data.resources,
            company: data?.company ?? null,
          }
        : EMPTY_COMPANY_PREFERENCE;
    });
};

export const useNewPreference = () => {
  const { getCompany, logout } = useUserData();
  const swrKeYRef = useRef<any>(['companies/preferences', { company: getCompany(), logout }]);
  const { data, isLoading } = useSWR(swrKeYRef.current, (key: any) => fetcher(key), {
    keepPreviousData: true,
    revalidateOnReconnect: true,
    revalidateOnFocus: true,
    revalidateOnMount: true,
    fallbackData: EMPTY_COMPANY_PREFERENCE,
  });

  return {
    data,
    isLoading,
  };
};
