import { toast } from 'react-toastify';
import { useFetcher } from '#commonHooks/useFetcher';
import { useUserData } from '#commonUserHooks/useUserData';
import { PROVIDER_PANEL_TEXT } from '@/app/constants/app-toast-texts';
import { apiErrorValidation, companyIdIsNull } from '@/app/constants/validations';

export const useProviderConfirm = () => {
  const { getCompany } = useUserData();
  const [fetcher, _, isLoading] = useFetcher();

  const confirmOrder = (orderId: string) => {
    const companyID = getCompany();
    if (companyIdIsNull(companyID)) return;
    fetcher('post', {
      body: {
        model: 'providers/orders/confirm',
        company_id: companyID,
        order_id: orderId,
      },
      requestId: 'confirmOrder',
    })
      .then(({ data }: any) => {
        if (data.isAnError || apiErrorValidation(data?.error, data?.response)) {
          throw new Error(PROVIDER_PANEL_TEXT.FAILURE_ACCEPT_ORDER);
        }
        toast.success(PROVIDER_PANEL_TEXT.ACCEPTED_ORDER);
      })
      .catch((e: Error) => {
        toast.error(e.message);
      });
  };

  return { confirmOrder, isLoading };
};
