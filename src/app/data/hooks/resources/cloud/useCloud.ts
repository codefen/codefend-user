import { useEffect, useRef } from 'react';
import { useUserData } from '#commonUserHooks/useUserData';
import { defaultConfig, disponibleFetcher } from '@services/swr';
import useSWR from 'swr';
import { useGlobalFastField } from '@/app/views/context/AppContextProvider';

export const useCloud = () => {
  const { getCompany, logout } = useUserData();
  const company = useGlobalFastField('company');
  const swrKeYRef = useRef<any>([['resources/cloud/index'], { company: getCompany(), logout }]);

  const { data, mutate, isLoading, isValidating } = useSWR(
    swrKeYRef.current,
    (key: any) => disponibleFetcher(key),
    {
      ...defaultConfig,
      fallbackData: {},
    }
  );

  const refetch = () =>
    mutate(undefined, {
      revalidate: true,
      optimisticData: data,
    });

  const updateData = (newData: any) => {
    mutate(
      { disponibles: [...data?.disponibles, newData], company: company.get },
      {
        revalidate: true,
        optimisticData: data,
      }
    );
  };

  useEffect(() => {
    if (data?.company) {
      company.set(data.company);
    }
  }, [data?.company]);

  return {
    data: data?.disponibles ? data?.disponibles : [],
    isLoading: isLoading || isValidating,
    refetch,
    updateData,
  };
};
