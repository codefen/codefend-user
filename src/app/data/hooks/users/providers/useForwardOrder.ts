import { useFetcher } from '#commonHooks/useFetcher';
import { useUserData } from '#commonUserHooks/useUserData';
import { apiErrorValidation, companyIdIsNull } from '@/app/constants/validations';

export const useForwardOrder = () => {
  const { getCompany } = useUserData();
  const [fetcher, _, isLoading] = useFetcher();

  const forwardOrder = (order_id: any) => {
    const companyID = getCompany();
    if (companyIdIsNull(companyID)) return Promise.reject({ res: false, providers: [] });
    return fetcher('post', {
      body: {
        company_id: companyID,
        order_id,
      },
      path: 'providers/orders/forward',
    })
      .then(({ data }: any) => {
        if (data.isAnError || apiErrorValidation(data?.error, data?.response)) {
          throw new Error('An error has occurred on the server');
        }
        return { res: true, providers: data.providers };
      })
      .catch(() => {
        return { res: false, providers: [] };
      });
  };

  return [forwardOrder, isLoading] as const;
};
