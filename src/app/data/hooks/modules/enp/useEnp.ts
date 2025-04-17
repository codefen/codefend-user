import { useRef } from 'react';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useUserData } from '#commonUserHooks/useUserData';

const useFetchEndpoints = (companyID: string, scanID: number) => {
  const [fetcher, _, isLoading] = useFetcher();
  const dataRef = useRef<any>();

  const fetchEnd = async (companyID: string) => {
    fetcher('post', {
      body: {
        ac: 'get',
        scan_id: scanID,
        company_id: companyID,
      },
      path: 'modules/epm/devices',
    }).then(({ data }: any) => {
      dataRef.current = data;
    });
  };

  const refetch = async () => {
    fetchEnd(companyID);
  };

  const getEndpoints = () => {
    const endData = isLoading ? ({} as any) : dataRef;
    return endData || {};
  };

  return { getEndpoints, isLoading, refetch };
};

// Hook principal que utiliza los hooks anteriores
export const useEnp = (scanID: number) => {
  const { getCompany } = useUserData();
  const companyID = getCompany();

  const { getEndpoints, isLoading, refetch } = useFetchEndpoints(companyID, scanID);

  return {
    getEndpoints,
    isLoading,
    refetch,
  };
};
