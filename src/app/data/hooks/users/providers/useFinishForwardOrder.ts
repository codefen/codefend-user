import { useFetcher } from '#commonHooks/useFetcher';
import { useUserData } from '#commonUserHooks/useUserData';
import { apiErrorValidation, companyIdIsNull } from '@/app/constants/validations';
import { useState } from 'react';

export const useFinishForwardOrder = () => {
  const { getCompany } = useUserData();
  const [fetcher, _, isLoading] = useFetcher();
  const [transferProvider, setTransfer] = useState<string>('');

  const finishForwardOrder = (order_id: any) => {
    const companyID = getCompany();
    if (companyIdIsNull(companyID)) return Promise.reject(false);
    return fetcher('post', {
      body: {
        model: 'providers/orders/forward',
        company_id: getCompany(),
        chosen_provider_id: transferProvider,
        order_id,
      },
    })
      .then(({ data }: any) => {
        if (data.isAnError || apiErrorValidation(data?.error, data?.response)) {
          throw new Error('An error has occurred on the server');
        }
        return true;
      })
      .catch(() => {
        return false;
      });
  };

  return [transferProvider, isLoading, { finishForwardOrder, setTransfer }] as const;
};
