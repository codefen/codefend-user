import { useUserData } from '#commonUserHooks/useUserData';
import { EMPTY_COMPANY_CUSTOM } from '@/app/constants/empty';
import { apiErrorValidation, companyIdIsNull, verifySession } from '@/app/constants/validations';
import { useGlobalFastField } from '@/app/views/context/AppContextProvider';
import { AxiosHttpService } from '@services/axiosHTTP.service';
import { useEffect, useRef } from 'react';
import useSWR from 'swr';

export const EMPTY_COMPANY_PREFERENCE = {
  company_members: [],
  company: EMPTY_COMPANY_CUSTOM,
  company_orders: [],
};

const fetcher = ([model, { company, logout }]: any) => {
  if (companyIdIsNull(company)) return Promise.reject(EMPTY_COMPANY_PREFERENCE);
  const axiosHttp = AxiosHttpService.getInstance();
  axiosHttp.updateUrlInstance();
  return axiosHttp
    .post<any>({
      body: { company_id: company },
      path: model,
    })
    .then(({ data }) => {
      if (verifySession(data, logout)) return;
      if (apiErrorValidation(data)) {
        throw new Error('');
      }
      let members = data.company_members ? data.company_members : [];
      members = data.provided_accesses ? members.concat(data.provided_accesses) : members;
      const res = data
        ? {
            company_members: members,
            company: data?.company ? data.company : EMPTY_COMPANY_CUSTOM,
            company_orders: data.company_orders ? data.company_orders : [],
          }
        : EMPTY_COMPANY_PREFERENCE;
      return res;
    });
};

export const useNewPreference = () => {
  const { getCompany, logout } = useUserData();
  const companyStored = useGlobalFastField('company');
  const swrKeYRef = useRef<any>(['companies/preferences', { company: getCompany(), logout }]);
  const { data, isLoading } = useSWR<any>(swrKeYRef.current, (key: any) => fetcher(key), {
    keepPreviousData: true,
    revalidateOnReconnect: true,
    revalidateOnFocus: true,
    revalidateOnMount: true,
    fallbackData: EMPTY_COMPANY_PREFERENCE,
  });

  useEffect(() => {
    if (data?.company) {
      companyStored.set(data.company);
    }
  }, [data]);

  return {
    data,
    isLoading,
  };
};
