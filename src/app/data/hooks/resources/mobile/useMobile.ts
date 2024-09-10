import { useRef } from 'react';
import { ResourcesTypes, useOrderStore } from '../../..';
import { useUserData } from '#commonUserHooks/useUserData';
import { defaultConfig, disponibleFetcher } from '@services/swr';
import useSWR from 'swr';

export const useMobile = () => {
  const { updateState, setScopeTotalResources } = useOrderStore(state => state);
  const { getCompany, logout } = useUserData();

  const swrKeYRef = useRef<any>([
    ['resources/mobile', 'view_all'],
    { company: getCompany(), logout },
  ]);

  const { data, mutate, isLoading, isValidating } = useSWR(
    swrKeYRef.current,
    (key: any) => disponibleFetcher(key),
    {
      ...defaultConfig,
      onSuccess: () => {
        setScopeTotalResources(data.length);
        updateState('resourceType', ResourcesTypes.MOBILE);
      },
    }
  );

  const refetch = () =>
    mutate(undefined, {
      revalidate: true,
      optimisticData: data,
    });

  const updateData = (newData: any) => {
    let updatedData: any[] = [];
    if (newData?.andoird) updatedData = [...data, newData.andoird];
    if (newData?.apple) updatedData = [...updatedData, newData.apple];

    mutate(updatedData, {
      revalidate: true,
      optimisticData: updatedData,
    });
  };

  return {
    data: data ? data : [],
    isLoading: isLoading || isValidating,
    refetch,
    updateData,
  };
};
