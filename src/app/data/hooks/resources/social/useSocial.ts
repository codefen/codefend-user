import { useRef } from 'react';
import { useUserData } from '#commonUserHooks/useUserData';
import { defaultConfig, disponibleFetcher } from '@services/swr';
import useSWR from 'swr';

export const useSocial = () => {
  const { getCompany, logout } = useUserData();
  const swrKeYRef = useRef<any>([['resources/se', 'view_all'], { company: getCompany(), logout }]);

  const { data, mutate, isLoading, isValidating } = useSWR(
    swrKeYRef.current,
    (key: any) => disponibleFetcher(key),
    defaultConfig
  );

  return {
    members: data,
    isLoading: isLoading || isValidating,
    refetch: () =>
      mutate(undefined, {
        revalidate: true,
        optimisticData: data,
      }),
  };
};
