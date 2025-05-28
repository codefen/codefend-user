import { useEffect, useRef, useState } from 'react';
import { verifySession } from '@/app/constants/validations';
import { useUserData } from '#commonUserHooks/useUserData';
import { apiErrorValidation, companyIdIsNull } from '@/app/constants/validations';
import { APP_EVENT_TYPE, USER_LOGGING_STATE } from '@interfaces/panel';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import useSWR from 'swr';
import { AxiosHttpService } from '@services/axiosHTTP.service';
import { getNetworkMetrics } from '@utils/metric.service';

const fetcher = ([model, { company, logout }]: any) => {
  if (companyIdIsNull(company)) return Promise.reject({ resources: [], company: null });
  const axiosHttp = AxiosHttpService.getInstance();
  axiosHttp.updateUrlInstance();
  return axiosHttp
    .post<any>({
      body: { company_id: company },
      path: model,
    })
    .then(({ data }) => {
      if (verifySession(data, logout) || apiErrorValidation(data))
        return { resources: [], company: null };

      return { resources: data?.disponibles, company: data?.company };
    });
};

export const useGetNetworkv2 = () => {
  const { logout, company } = useUserData();
  const {
    appEvent,
    internalIpCount,
    externalIpCount,
    totalNotUniqueIpCount,
    isDefaultPlan,
    planPreference,
    totalNetowrkElements,
    userLoggingState,
  } = useGlobalFastFields([
    'appEvent',
    'externalIpCount',
    'totalNotUniqueIpCount',
    'totalNetowrkElements',
    'internalIpCount',
    'planPreference',
    'isDefaultPlan',
    'userLoggingState',
  ]);
  const swrKeYRef = useRef<any>(['resources/lan/index', { company: company.get?.id, logout }]);

  const { data, isLoading, mutate } = useSWR(swrKeYRef.current, (key: any) => fetcher(key), {
    keepPreviousData: true,
    revalidateOnReconnect: true,
    revalidateOnFocus: true,
    revalidateOnMount: true,
    fallbackData: { resources: [], company: company.get },
  });

  useEffect(() => {
    if (data?.company) {
      company.set(data?.company);
    }
    if (
      appEvent.get != APP_EVENT_TYPE.NETWORK_RESOURCE_PAGE_CONDITION &&
      appEvent.get != APP_EVENT_TYPE.NOTIFICATION &&
      appEvent.get != APP_EVENT_TYPE.SCAN_FINISHED &&
      appEvent.get != APP_EVENT_TYPE.SCAN_LAUNCHED &&
      appEvent.get != APP_EVENT_TYPE.LAUNCH_SCAN &&
      userLoggingState.get != USER_LOGGING_STATE.LOGGED_OUT
    ) {
      refetch();
      appEvent.set(APP_EVENT_TYPE.NETWORK_RESOURCE_PAGE_CONDITION);
    }

    const metrics = getNetworkMetrics(data?.resources);
    internalIpCount.set(metrics.totalInternalIps);
    externalIpCount.set(metrics.totalExternalIps);
    totalNotUniqueIpCount.set(metrics.totalNotUniqueIpCount);
    totalNetowrkElements.set(metrics.total);
    if (isDefaultPlan.get) {
      if (metrics.total <= 20) {
        planPreference.set('small');
      } else if (metrics.total <= 200) {
        planPreference.set('medium');
      } else {
        planPreference.set('advanced');
      }
    }
  }, [data?.company, appEvent.get, isDefaultPlan.get]);

  const refetch = () =>
    mutate(undefined, {
      revalidate: true,
      optimisticData: data,
    });

  return {
    networks: data?.resources || [],
    isLoading,
    refetch,
    appEvent,
    internalIpCount,
    externalIpCount,
    totalNotUniqueIpCount,
  };
};
