import { useFetcher } from '#commonHooks/useFetcher';
import { useUserData } from '#commonUserHooks/useUserData';
import { apiErrorValidation, companyIdIsNull } from '@/app/constants/validations';
import type { FullOrder } from '@/app/data';
import { useState } from 'react';

export const useCurrentOrders = () => {
  const { getCompany } = useUserData();
  const [fetcher, _, isLoading] = useFetcher();
  const [currentOrders, setCurrentOrders] = useState<FullOrder[]>([]);

  const getConfirmOrders = () => {
    const companyID = getCompany();
    if (companyIdIsNull(companyID)) return;
    fetcher<any>('post', {
      body: {
        company_id: companyID,
      },
      path: 'providers/orders/index/confirmed',
    }).then(({ data }) => {
      if (apiErrorValidation(data)) {
        throw new Error('An error has occurred on the server');
      }
      setCurrentOrders(data.orders ? data.orders : []);
    });
  };

  return [currentOrders, { setCurrentOrders, getConfirmOrders, isLoading }] as const;
};
