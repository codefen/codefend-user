import { type Ticket } from '@interfaces/panel.ts';
import { useRef } from 'react';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useUserData } from '#commonUserHooks/useUserData';
import { apiErrorValidation, companyIdIsNull } from '@/app/constants/validations';

interface ApiResponse {
  disponibles: Ticket[];
  eliminados: Ticket[];
  error?: string;
  response?: string;
  info: string;
}

/* Custom Hook "useAllTicket" to retrieve all tickets in customer support view*/
export const useAllTicket = () => {
  const { getCompany } = useUserData();
  const [fetcher, _, isLoading] = useFetcher();
  const dataRef = useRef<Ticket[]>([]);

  const fetchAll = async (companyID: string) => {
    fetcher<ApiResponse>('post', {
      body: {
        ac: 'view_all',
        company_id: companyID,
      },
      path: 'cs/index',
    }).then(({ data }) => {
      if (apiErrorValidation(data)) {
        return;
      }
      dataRef.current = data.disponibles || [];
    });
  };

  const refetch = () => {
    const companyID = getCompany();
    if (companyIdIsNull(companyID)) return;
    fetchAll(companyID);
  };
  const getTikets = (): Ticket[] => {
    return isLoading ? [] : dataRef.current || [];
  };

  return {
    getTikets,
    isLoading,
    refetch,
  };
};
