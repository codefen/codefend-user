import { useEffect, useRef } from 'react';
import { genericFetcher } from '@services/swr';
import useSWR from 'swr';

export const useRecomendedUsername = (ref?: string) => {
  const swrKeYRef = useRef<any>([
    'users/new',
    {
      phase: 2,
      lead_reference_number: ref || localStorage.getItem('referenceNumber') || '',
    },
  ]);

  const { data, mutate } = useSWR(swrKeYRef.current, (key: any) => genericFetcher(key), {
    keepPreviousData: true,
    revalidateOnReconnect: false,
    revalidateOnFocus: false,
    revalidateOnMount: false,
    revalidateIfStale: true,
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
