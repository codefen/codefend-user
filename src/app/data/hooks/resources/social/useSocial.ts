import { useCallback, useEffect } from 'react';
import { useUserData } from '#commonUserHooks/useUserData';
import { defaultConfig, genericFetcher } from '@services/swr';
import useSWRInfinite from 'swr/infinite';
import { useGlobalFastField } from '@/app/views/context/AppContextProvider';
import type { SocialFilterState } from './useSocialFilters';
import { useDebounce } from '../../common/useDebounce';

export const useSocial = (filters: SocialFilterState, searchTerm: string) => {
  const { getCompany, logout } = useUserData();
  const company = useGlobalFastField('company');
  const companyID = getCompany();
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const getKey = useCallback(
    (pageIndex: number, previousPageData: any) => {
      if ((previousPageData && !previousPageData.disponibles) || !companyID) {
        return null;
      }
      if (previousPageData && pageIndex + 1 > previousPageData.ds_size) {
        return null;
      }
      const params: any = { company_id: companyID, ds: pageIndex + 1, logout };

      if (debouncedSearchTerm) {
        params.search = debouncedSearchTerm;
      } else {
        if (filters.resource_domain.length > 0) {
          params.resource_domain = filters.resource_domain.join(',');
        }
      }

      return ['resources/se/index', params];
    },
    [companyID, filters.resource_domain, debouncedSearchTerm],
  );

  const { data, size, setSize, error, mutate, isLoading, isValidating } = useSWRInfinite(
    getKey,
    genericFetcher,
    {
      ...defaultConfig,
      revalidateFirstPage: true,
    }
  );

  const members = data ? [].concat(...data.map(page => page.disponibles || [])) : [];
  const isLoadingMore = isLoading || (size > 0 && data && typeof data[size - 1] === 'undefined');
  const isReachingEnd = data && (data[data.length - 1]?.disponibles?.length < 250 || (data[0] && size >= data[0].ds_size));

  const isSearchingBackend = !!debouncedSearchTerm && isLoading;

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
    isSearchingBackend,
    domains: data && data[0] ? data[0].emails_domains : []
  };
};
