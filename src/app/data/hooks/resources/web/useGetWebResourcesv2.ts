import { useEffect, useRef, useState } from 'react';
import { verifySession } from '@/app/constants/validations';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useUserData } from '#commonUserHooks/useUserData';
import { apiErrorValidation, companyIdIsNull } from '@/app/constants/validations';
import { APP_EVENT_TYPE, type Webresource } from '@interfaces/panel';
import { useGlobalFastField, useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import useSWR from 'swr';
import { AxiosHttpService } from '@services/axiosHTTP.service';
import { getCompanyAllMetrics } from '@utils/metric.service';
import { useInitialDomainStore } from '@stores/initialDomain.store';

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
        return { resources: [], company: null };

      return { resources: data?.resources, company: data?.company };
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
  const swrKeYRef = useRef<any>(['resources/web/index', { company: company.get?.id, logout }]);
  const { update, isUniqueDomain } = useInitialDomainStore();

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
      appEvent.get != APP_EVENT_TYPE.WEB_RESOURCE_PAGE_CONDITION &&
      appEvent.get != APP_EVENT_TYPE.NOTIFICATION &&
      appEvent.get != APP_EVENT_TYPE.SCAN_FINISHED &&
      appEvent.get != APP_EVENT_TYPE.SCAN_LAUNCHED &&
      appEvent.get != APP_EVENT_TYPE.LAUNCH_SCAN
    ) {
      refetch();
      appEvent.set(APP_EVENT_TYPE.WEB_RESOURCE_PAGE_CONDITION);
    }

    const metrics = getCompanyAllMetrics(data?.resources);
    domainCount.set(metrics.domainCount);
    subDomainCount.set(metrics.subDomainCount);
    uniqueIpCount.set(metrics.uniqueIpCount);
    const isUnique = metrics.domainCount === 1;
    if (isUnique !== isUniqueDomain) {
      update('isUniqueDomain', isUnique);
    }
    if (isUnique) {
      update('initialDomain', data?.resources[0].resource_domain);
      update('resourceId', data?.resources[0].id);
    }
    if (isDefaultPlan.get) {
      if (metrics.domainCount <= 2 && metrics.subDomainCount <= 6) {
        planPreference.set('small');
      } else if (metrics.domainCount <= 5 && metrics.subDomainCount <= 15) {
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
    webResources: data?.resources || [],
    isLoading,
    refetch,
    appEvent,
    domainCount,
    subDomainCount,
    uniqueIpCount,
  };
};
