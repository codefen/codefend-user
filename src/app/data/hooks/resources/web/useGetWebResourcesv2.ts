import { useCallback, useEffect, useMemo, useRef } from 'react';
import { verifySession } from '@/app/constants/validations';
import { useUserData } from '#commonUserHooks/useUserData';
import { apiErrorValidation, companyIdIsNull } from '@/app/constants/validations';
import { APP_EVENT_TYPE } from '@interfaces/panel';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import useSWR from 'swr';
import { AxiosHttpService } from '@services/axiosHTTP.service';
import { getCompanyAllMetrics } from '@utils/metric.service';
import { useInitialDomainStore } from '@stores/initialDomain.store';
import { optimizedConfigs } from '@services/swr';

const fetcher = ([model, { company, logout }]: any) => {
  if (companyIdIsNull(company)) return Promise.reject({ resources: [], company: null });
  const axiosHttp = AxiosHttpService.getInstance();
  axiosHttp.updateUrlInstance();
  return axiosHttp
    .post<any>({
      body: { company_id: company, childs: 'yes' },
      path: model,
    })
    .then(({ data }) => {
      if (verifySession(data, logout) || apiErrorValidation(data))
        return { resources: [], company: null, map_resources: [] };

      return {
        resources: data?.resources,
        company: data?.company,
        map_resources: data?.map_resources,
      };
    });
};

export const useGetWebResourcesv2 = () => {
  const { logout, company } = useUserData();
  const { appEvent, domainCount, subDomainCount, uniqueIpCount, isDefaultPlan, planPreference } =
    useGlobalFastFields([
      'appEvent',
      'subDomainCount',
      'uniqueIpCount',
      'domainCount',
      'planPreference',
      'isDefaultPlan',
    ]);

  // ✅ Key estable para SWR - sin incluir logout que se recrea
  const swrKey = useMemo(
    () => (company.get?.id ? ['resources/web/index', company.get.id] : null),
    [company.get?.id]
  );

  const { update, isUniqueDomain } = useInitialDomainStore();

  // ✅ Usar configuración optimizada para listas
  const { data, isLoading, mutate } = useSWR(
    swrKey,
    () => fetcher(['resources/web/index', { company: company.get?.id, logout }]),
    {
      ...optimizedConfigs.lists,
      fallbackData: { resources: [], company: null, map_resources: [] }, // Sin datos reactivos
    }
  );

  // ✅ Refs para evitar recreaciones innecesarias
  const previousMetricsRef = useRef<any>(null);
  const appEventProcessedRef = useRef(false);

  // ✅ Definir refetch antes de los useEffect
  const refetch = useCallback(
    () =>
      mutate(undefined, {
        revalidate: true,
        optimisticData: data, // ✅ Usar optimisticData en lugar de populateCache
      }),
    [mutate, data]
  );

  // ✅ Efecto para actualizar company cuando cambie
  useEffect(() => {
    if (data?.company) {
      company.set(data?.company);
    }
  }, [data?.company, company]);

  // ✅ Efecto separado para manejar appEvent y refetch con flag de procesamiento
  useEffect(() => {
    if (
      !appEventProcessedRef.current &&
      appEvent.get !== APP_EVENT_TYPE.WEB_RESOURCE_PAGE_CONDITION &&
      appEvent.get !== APP_EVENT_TYPE.NOTIFICATION
    ) {
      refetch();
      appEvent.set(APP_EVENT_TYPE.WEB_RESOURCE_PAGE_CONDITION);
      appEventProcessedRef.current = true;
    }
  }, [appEvent.get, refetch]);

  // ✅ Efecto separado para actualizar métricas con comparación para evitar sets innecesarios
  useEffect(() => {
    if (data?.resources?.length) {
      const metrics = getCompanyAllMetrics(data.resources);

      // Solo actualizar si los valores realmente cambiaron
      if (JSON.stringify(metrics) !== JSON.stringify(previousMetricsRef.current)) {
        domainCount.set(metrics.domainCount);
        subDomainCount.set(metrics.subDomainCount);
        uniqueIpCount.set(metrics.uniqueIpCount);

        const isUnique = metrics.domainCount === 1;
        if (isUnique !== isUniqueDomain) {
          update('isUniqueDomain', isUnique);
        }
        if (isUnique && data?.resources?.[0]) {
          update('initialDomain', data?.resources[0].resource_domain);
          update('resourceId', data?.resources[0].id);
        }

        previousMetricsRef.current = metrics;
      }
    }
  }, [data?.resources, isUniqueDomain, update]);

  // ✅ Efecto separado para plan preference
  useEffect(() => {
    if (isDefaultPlan.get && previousMetricsRef.current) {
      const { domainCount: domains, subDomainCount: subDomains } = previousMetricsRef.current;

      let newPlan: 'small' | 'medium' | 'advanced' = 'advanced';
      if (domains <= 2 && subDomains <= 6) {
        newPlan = 'small';
      } else if (domains <= 5 && subDomains <= 15) {
        newPlan = 'medium';
      }

      if (planPreference.get !== newPlan) {
        planPreference.set(newPlan);
      }
    }
  }, [isDefaultPlan.get, planPreference]);

  return {
    webResources: data?.resources || [],
    mapResources: data?.map_resources || [],
    isLoading,
    refetch,
    appEvent,
    domainCount,
    subDomainCount,
    uniqueIpCount,
  };
};
