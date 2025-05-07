import { useEffect, useRef } from 'react';
import { useUserData } from '#commonUserHooks/useUserData';
import { genericFetcher } from '@services/swr';
import useSWR from 'swr';
import { useGlobalFastField } from '@/app/views/context/AppContextProvider';

export const useGetOneMobile = () => {
  const { getCompany } = useUserData();
  const company = useGlobalFastField('company');
  const swrKeYRef = useRef<any>(['resources/mobile/view', { company_id: getCompany(), id: '0' }]);

  const { data, mutate, isLoading, isValidating } = useSWR(
    swrKeYRef.current,
    (key: any) => {
      return genericFetcher(key)
        .then(response => {
          console.log('=== RESPUESTA DE LA API ===');
          console.log('URL:', key);
          console.log('Respuesta completa:', response);
          if (response?.unico) {
            console.log('Datos de la aplicación:', response.unico);
            console.log('app_android_downloads:', response.unico.app_android_downloads);
            console.log('downloads:', response.unico.downloads);
            console.log('app_rank:', response.unico.app_rank);
          }
          console.log('==========================');
          return response;
        })
        .catch(error => {
          console.error('Error en la petición a la API:', error);
          throw error;
        });
    },
    {
      fallback: {},
      revalidateOnMount: false,
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,

      refreshWhenHidden: false,
      refreshWhenOffline: false,
      keepPreviousData: false,
    }
  );

  const refetch = (id: any) => {
    swrKeYRef.current = ['resources/mobile/view', { company_id: getCompany(), id: id }];
    mutate(undefined, {
      revalidate: true,
      optimisticData: data,
      populateCache: false,
    });
  };

  useEffect(() => {
    if (data?.company) {
      company.set(data.company);
    }
  }, [data?.company]);

  return {
    data: data ? data?.unico : {},
    isLoading: isLoading || isValidating,
    refetch,
  };
};
