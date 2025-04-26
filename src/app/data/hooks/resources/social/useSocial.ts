import { useEffect, useRef } from 'react';
import { useUserData } from '#commonUserHooks/useUserData';
import { defaultConfig, disponibleFetcher } from '@services/swr';
import useSWR from 'swr';
import { useGlobalFastField } from '@/app/views/context/AppContextProvider';

export const useSocial = () => {
  const { getCompany, logout } = useUserData();
  const company = useGlobalFastField('company');
  const swrKeYRef = useRef<any>([['resources/se/index'], { company: getCompany(), logout }]);

  const { data, mutate, isLoading, isValidating } = useSWR(
    swrKeYRef.current,
    (key: any) => disponibleFetcher(key),
    {
      ...defaultConfig,
      fallbackData: {},
    }
  );

  useEffect(() => {
    if (data?.company) {
      company.set(data.company);
    }
  }, [data?.company]);

  return {
    members: data?.disponibles ? data?.disponibles : [],
    isLoading: isLoading || isValidating,
    refetch: () =>
      mutate(undefined, {
        revalidate: true,
        optimisticData: data,
      }),
  };
};
