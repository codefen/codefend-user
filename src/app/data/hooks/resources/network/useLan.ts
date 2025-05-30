import { useRef } from 'react';
import { type Device } from '@interfaces/panel';
import { companyIdIsNull, verifySession } from '@/app/constants/validations';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useUserData } from '#commonUserHooks/useUserData';

export interface LanProps {
  loading: boolean;
  networks: Device[];
  error: string | null;
  info: string | null;
}

/* Custom Hook "useLan" to handle recovery of all LAN apps*/
export const useLan = () => {
  const { getCompany, logout } = useUserData();
  const [fetcher, _, isLoading] = useFetcher();
  const dataRef = useRef<Device[]>([]);

  /* Fetch LAN  Apps */
  const fetchAllLan = (companyID: string) => {
    fetcher('post', {
      body: {
        company_id: companyID,
      },
      path: 'resources/lan/index',
    }).then(({ data }: any) => {
      if (verifySession(data, logout)) return;

      dataRef.current = data.disponibles ? data.disponibles : [];
    });
  };

  /* Refetch Function. */
  const refetch = () => {
    const companyID = getCompany();
    if (companyIdIsNull(companyID)) return;
    fetchAllLan(companyID);
  };

  return { loading: isLoading, networks: dataRef.current ? dataRef.current : [], refetch };
};
