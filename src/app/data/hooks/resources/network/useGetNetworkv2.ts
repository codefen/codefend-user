import { useEffect, useMemo, useRef, useState } from 'react';
import { verifySession } from '@/app/constants/validations';
import { useUserData } from '#commonUserHooks/useUserData';
import { apiErrorValidation, companyIdIsNull } from '@/app/constants/validations';
import { APP_EVENT_TYPE, USER_LOGGING_STATE } from '@interfaces/panel';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import useSWR from 'swr';
import { AxiosHttpService } from '@services/axiosHTTP.service';
import { getNetworkMetrics } from '@utils/metric.service';
import { optimizedConfigs } from '@services/swr';

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
  // ✅ Key estable para SWR - sin incluir logout que se recrea
  const swrKey = useMemo(
    () => (company.get?.id ? ['resources/lan/index', company.get.id] : null),
    [company.get?.id]
  );

  const { data, isLoading, mutate } = useSWR(
    swrKey,
    () => fetcher(['resources/lan/index', { company: company.get?.id, logout }]),
    {
      ...optimizedConfigs.networkResources,
      fallbackData: { resources: [], company: null }, // Sin datos reactivos
    }
  );

  // ✅ Refs para evitar recreaciones innecesarias
  const previousMetricsRef = useRef<any>(null);
  const appEventProcessedRef = useRef(false);

  useEffect(() => {
    if (data?.company) {
      company.set(data?.company);
    }
  }, [data?.company, company]);

  // ✅ useEffect separado para app events para evitar loops
  useEffect(() => {
    if (
      !appEventProcessedRef.current &&
      appEvent.get != APP_EVENT_TYPE.NETWORK_RESOURCE_PAGE_CONDITION &&
      appEvent.get != APP_EVENT_TYPE.NOTIFICATION &&
      userLoggingState.get != USER_LOGGING_STATE.LOGGED_OUT
    ) {
      refetch();
      appEvent.set(APP_EVENT_TYPE.NETWORK_RESOURCE_PAGE_CONDITION);
      appEventProcessedRef.current = true;
    }
  }, [appEvent.get, userLoggingState.get]);

  // ✅ useEffect separado para métricas con comparación para evitar sets innecesarios
  useEffect(() => {
    if (data?.resources) {
      const metrics = getNetworkMetrics(data.resources);

      // Solo actualizar si los valores realmente cambiaron
      if (JSON.stringify(metrics) !== JSON.stringify(previousMetricsRef.current)) {
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

        previousMetricsRef.current = metrics;
      }
    }
  }, [data?.resources, isDefaultPlan.get]);

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
