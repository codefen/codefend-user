import { useRef } from 'react';
import { ResourcesTypes, useOrderStore } from '../../..';
import { useUserData } from '#commonUserHooks/useUserData';
import { defaultConfig, disponibleFetcher } from '@services/swr';
import useSWR from 'swr';

export const useCloud = () => {
  const { updateState, setScopeTotalResources } = useOrderStore(state => state);
  const { getCompany, logout } = useUserData();

  const swrKeYRef = useRef<any>([
    ['resources/cloud', 'view_all'],
    { company: getCompany(), logout },
  ]);

  const { data, mutate, isLoading, isValidating } = useSWR(
    swrKeYRef.current,
    (key: any) => disponibleFetcher(key),
    {
      ...defaultConfig,
      onSuccess: () => {
        setScopeTotalResources(data.length);
        updateState('resourceType', ResourcesTypes.CLOUD);
      },
    }
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
