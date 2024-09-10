import { useRef } from 'react';
import { useUserData } from '#commonUserHooks/useUserData';
import { genericFetcher } from '@services/swr';
import useSWR from 'swr';

export const useGetOneCloud = () => {
  const { getCompany } = useUserData();

  const swrKeYRef = useRef<any>([
    'resources/cloud',
    { company_id: getCompany(), ac: 'view_one', id: '0' },
  ]);

  const { data, mutate, isLoading, isValidating } = useSWR(
    swrKeYRef.current,
    (key: any) => genericFetcher(key),
    {
      fallback: {},
      revalidateOnMount: false,
      revalidateIfStale: false,
      revalidateOnFocus: false,
      refreshWhenHidden: false,
      revalidateOnReconnect: false,
      keepPreviousData: false,
    }
  );

  const refetch = (id: any) => {
    swrKeYRef.current = ['resources/cloud', { company_id: getCompany(), ac: 'view_one', id: id }];
    mutate(undefined, {
      revalidate: true,
      optimisticData: data,
      populateCache: false,
    });
  };

  return {
    data: data ? data?.unico : {},
    isLoading: isLoading || isValidating,
    refetch,
  };
};
