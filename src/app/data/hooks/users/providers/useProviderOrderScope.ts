import { useFetcher } from '#commonHooks/useFetcher';
import { useUserData } from '#commonUserHooks/useUserData';
import { apiErrorValidation } from '@/app/constants/validations';
import { verifySession } from '@/app/constants/validations';

export const useProviderOrderScope = () => {
  const { getCompany, logout } = useUserData();
  const [fetcher] = useFetcher();
  //const providers = useRef<Provider[]>();

  const getProviderOrder = (orderId: string) => {
    fetcher('post', {
      body: {
        company_id: getCompany(),
        order_id: orderId,
      },
      path: 'providers/orders/view',
    }).then(({ data }: any) => {
      if (verifySession(data, logout)) return;
      if (data.isAnError || apiErrorValidation(data?.error, data?.response)) {
        throw new Error('An error has occurred on the server');
      }
    });
  };

  return getProviderOrder;
};
