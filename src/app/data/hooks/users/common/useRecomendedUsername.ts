import { useEffect, useMemo } from 'react';
import { genericFetcher, optimizedConfigs } from '@services/swr';
import useSWR from 'swr';

export const useRecomendedUsername = (ref?: string) => {
  // ✅ Usar useMemo para swrKey estable
  const swrKey = useMemo(
    () => [
      'users/new',
      {
        phase: 2,
        lead_reference_number: ref || localStorage.getItem('referenceNumber') || '',
      },
    ],
    [ref]
  );

  const { data, mutate } = useSWR(swrKey, (key: any) => genericFetcher(key), {
    ...optimizedConfigs.static,
    fallbackData: {},
  });
  const updateReferenceNumber = (referenceNumber: string) => {
    localStorage.setItem('referenceNumber', referenceNumber);
  };
  const refetch = () =>
    mutate(undefined, {
      revalidate: true,
      optimisticData: undefined,
    });

  useEffect(() => {
    if (ref) {
      updateReferenceNumber(ref);
      refetch();
    }
  }, [ref]);
  return {
    data,
    updateReferenceNumber,
    refetch,
  };
};
