import { useEffect, useMemo } from 'react';
import { companyIdIsNull, verifySession } from '@/app/constants/validations';
import { useUserData } from '#commonUserHooks/useUserData.ts';
import { EMPTY_DASHBOARD_PROPS } from '@/app/constants/empty';
import { apiErrorValidation } from '@/app/constants/validations';
import { AxiosHttpService } from '@services/axiosHTTP.service';
import useSWR from 'swr';
import { optimizedConfigs } from '@services/swr';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';

const fetcher = ([model, { company, logout }]: any) => {
  if (companyIdIsNull(company)) return Promise.reject(EMPTY_DASHBOARD_PROPS);
  const axiosHttp = AxiosHttpService.getInstance();
  axiosHttp.updateUrlInstance();
  return axiosHttp
    .post<any>({
      body: { company_id: company },
      path: model,
    })
    .then(({ data }) => {
      if (verifySession(data, logout) || apiErrorValidation(data)) return EMPTY_DASHBOARD_PROPS;

      return data
        ? {
            issues: data?.issues ? data.issues : [],
            issues_condicion: data?.issues_condicion,
            issues_share: data?.issues_share,
            members: data?.members ? data.members : [],
            resources: data?.resources,
            company: data?.company ?? null,
          }
        : EMPTY_DASHBOARD_PROPS;
    });
};

export const useDashboard = () => {
  const { logout, company } = useUserData();
  const { scanNumber, isScanning } = useGlobalFastFields(['scanNumber', 'isScanning']);
  // ✅ Usar useMemo para swrKey estable
  const swrKey = useMemo(
    () => (company.get?.id ? ['companies/dashboard', company.get.id] : null),
    [company.get?.id]
  );

  const { data, isLoading } = useSWR(
    swrKey,
    () => fetcher(['companies/dashboard', { company: company.get?.id, logout }]),
    {
      ...optimizedConfigs.dashboard,
      fallbackData: EMPTY_DASHBOARD_PROPS,
    }
  );

  useEffect(() => {
    if (data?.company) {
      company.set(data?.company);
    }
  }, [data?.company, company]);

  return {
    isLoading,
    data,
    company,
    scanNumber,
    isScanning,
  };
};
