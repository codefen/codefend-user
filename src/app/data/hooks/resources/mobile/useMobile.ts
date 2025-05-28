import { useEffect, useRef } from 'react';
import { useUserData } from '#commonUserHooks/useUserData';
import { defaultConfig, disponibleFetcher } from '@services/swr';
import useSWR from 'swr';
import { useGlobalFastField } from '@/app/views/context/AppContextProvider';

export const useMobile = () => {
  const { getCompany, logout } = useUserData();
  const company = useGlobalFastField('company');

  const swrKeYRef = useRef<any>([['resources/mobile/index'], { company: getCompany(), logout }]);

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
    let updatedData = { disponibles: [...data?.disponibles, newData], company: company.get };

    mutate(updatedData, {
      revalidate: true,
      optimisticData: updatedData,
    });
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
