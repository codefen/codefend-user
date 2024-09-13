import { useRef } from 'react';
import { useUserData } from '#commonUserHooks/useUserData';
import { defaultConfig, disponibleFetcher } from '@services/swr';
import useSWR from 'swr';

export const useCloud = () => {
  const { getCompany, logout } = useUserData();

  const swrKeYRef = useRef<any>([
    ['resources/cloud', 'view_all'],
    { company: getCompany(), logout },
  ]);

  const { data, mutate, isLoading, isValidating } = useSWR(
    swrKeYRef.current,
    (key: any) => disponibleFetcher(key),
    defaultConfig
  );

  const refetch = () =>
    mutate(undefined, {
      revalidate: true,
      optimisticData: data,
    });

  const updateData = (newData: any) => {
    mutate([...data, newData], {
      revalidate: true,
      optimisticData: data,
    });
  };

  return {
    data: data ? data : [],
    isLoading: isLoading || isValidating,
    refetch,
    updateData,
  };
};
