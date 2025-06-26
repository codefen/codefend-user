import { useRef } from 'react';
import { useUserData } from '#commonUserHooks/useUserData';
import { defaultConfig, disponibleFetcher } from '@services/swr';
import useSWR from 'swr';

export const useSourceCode = () => {
  const { getCompany, logout } = useUserData();
  const swrKeYRef = useRef<any>([
    ['resources/source', 'view_all'],
    { company: getCompany(), logout },
  ]);
  const { data, mutate, isLoading, isValidating } = useSWR(
    swrKeYRef.current,
    (key: any) => disponibleFetcher(key),
    {
      ...defaultConfig,
      fallbackData: {},
    }
  );

  return {
    data: data?.disponibles ? data?.disponibles : [],
    isLoading: isLoading || isValidating,
    refetch: () =>
      mutate(undefined, {
        revalidate: true,
        optimisticData: data,
        populateCache: false,
      }),
  };
};
