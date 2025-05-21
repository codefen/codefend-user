import { useFetcher } from '#commonHooks/useFetcher';
import { useUserData } from '#commonUserHooks/useUserData';
import { apiErrorValidation, companyIdIsNull } from '@/app/constants/validations';
import type { FullOrder } from '@interfaces/order';
import { verifySession } from '@/app/constants/validations';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { APP_MESSAGE_TOAST } from '@/app/constants/app-toast-texts';

export const useProviderOrders = () => {
  const { getCompany, logout } = useUserData();
  const [fetcher, _, isLoading] = useFetcher();
  const [orders, setOrders] = useState<FullOrder[]>([]);

  const getProviderOrders = () => {
    const companyID = getCompany();
    if (companyIdIsNull(companyID)) return;
    fetcher<any>('post', {
      body: {
        company_id: companyID,
      },
      path: 'providers/orders/index/unconfirmed',
    })
      .then(({ data }: any) => {
        if (verifySession(data, logout)) return;
        if (apiErrorValidation(data)) {
          throw new Error(APP_MESSAGE_TOAST.API_UNEXPECTED_ERROR);
        }
        setOrders(data.orders ? data.orders : []);
      })
      .catch((e: Error) => toast.error(e.message));
  };

  return [orders, { setOrders, getProviderOrders, isLoading }] as const;
};
