import { useCallback, useEffect } from 'react';
import { useUserData } from '#commonUserHooks/useUserData';
import { defaultConfig, genericFetcher } from '@services/swr';
import useSWRInfinite from 'swr/infinite';
import { useGlobalFastField } from '@/app/views/context/AppContextProvider';
import type { SocialFilterState } from './useSocialFilters';

export const useSocial = (filters: SocialFilterState) => {
  const { getCompany, logout } = useUserData();
  const company = useGlobalFastField('company');
  const companyID = getCompany();

  const getKey = useCallback(
    (pageIndex: number, previousPageData: any) => {
      // Si la página anterior no trajo resultados, o no hay companyID, no pedir más.
      if ((previousPageData && !previousPageData.disponibles) || !companyID) {
        return null;
      }
       // Si la página anterior es la última página, no pedir más.
      if (previousPageData && pageIndex + 1 > previousPageData.ds_size) {
        return null;
      }
      const params: any = { company_id: companyID, ds: pageIndex + 1, logout };
      if (filters.resource_domain.length > 0) {
        params.resource_domain = filters.resource_domain.join(',');
      }
      return ['resources/se/index', params];
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [companyID, filters.resource_domain],
  );

  const { data, size, setSize, error, mutate, isLoading, isValidating } = useSWRInfinite(
    getKey,
    genericFetcher,
    {
      ...defaultConfig,
      revalidateFirstPage: true,
    }
  );

  const members = data ? [].concat(...data.map(page => page.disponibles)) : [];
  const isLoadingMore = isLoading || (size > 0 && data && typeof data[size - 1] === 'undefined');
  const isReachingEnd = data && (data[data.length - 1]?.disponibles?.length < 1000 || (data[0] && size >= data[0].ds_size));

  useEffect(() => {
    if (data && data[0]?.company) {
      company.set(data[0].company);
    }
  }, [data, company]);

  const loadMore = () => {
    if (!isLoadingMore && !isReachingEnd) {
      setSize(size + 1);
    }
  };

  const refetch = () => {
    mutate();
  };

  return {
    members,
    isLoading: isLoading,
    isReachingEnd,
    loadMore,
    refetch,
    isLoadingMore,
    domains: data && data[0] ? data[0].emails_domains : []
  };
};
