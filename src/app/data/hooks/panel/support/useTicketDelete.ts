import { useCallback } from 'react';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useUserData } from '#commonUserHooks/useUserData';
import { companyIdIsNull } from '@/app/constants/validations';

export const useTicketDelete = () => {
  const { getCompany } = useUserData();
  const [fetcher, _, isLoading] = useFetcher();
  const fetchDelete = useCallback(async (ticketID: string, companyID: string) => {
    return fetcher('post', {
      body: {
        model: 'cs/index',
        ac: 'del',
        id: ticketID,
        company_id: companyID,
      },
    }).then(({ data }: any) => data);
  }, []);

  const deletTicket = (ticketID: string) => {
    const companyID = getCompany();
    if (companyIdIsNull(companyID)) return Promise.reject(false);
    return fetchDelete(ticketID, companyID);
  };

  return { deletTicket };
};
