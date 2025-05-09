import { useFetcher } from '#commonHooks/useFetcher';
import { useUserData } from '#commonUserHooks/useUserData';
import { PROVIDER_PANEL_TEXT } from '@/app/constants/app-toast-texts';
import { apiErrorValidation, companyIdIsNull } from '@/app/constants/validations';
import { toast } from 'react-toastify';

export const useProviderOrderFinish = () => {
  const { getCompany } = useUserData();
  const [fetcher] = useFetcher();

  const finishOrder = (orderId: string) => {
    const companyID = getCompany();
    if (companyIdIsNull(companyID)) return;
    return fetcher('post', {
      body: {
        company_id: companyID,
        order_id: orderId,
      },
      path: 'providers/orders/finish',
    })
      .then(({ data }: any) => {
        if (apiErrorValidation(data)) {
          throw new Error(PROVIDER_PANEL_TEXT.FAILURE_ORDER_FINISHED);
        }
        toast.success(PROVIDER_PANEL_TEXT.ORDER_FINISHED);
      })
      .catch((e: Error) => {
        toast.error(e.message);
      });
  };
  return finishOrder;
};
