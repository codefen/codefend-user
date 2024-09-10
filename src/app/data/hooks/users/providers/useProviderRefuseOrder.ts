import { useFetcher } from '#commonHooks/useFetcher';
import { useUserData } from '#commonUserHooks/useUserData';
import { PROVIDER_PANEL_TEXT } from '@/app/constants/app-toast-texts';
import { apiErrorValidation, companyIdIsNull } from '@/app/constants/validations';
import { useProviderRefuseStore } from '@stores/providerOrder.store';
import { toast } from 'react-toastify';

export const useProviderRefuseOrder = () => {
  const { getCompany } = useUserData();
  const [fetcher, cancelRequest, _] = useFetcher();
  const { isRefusing } = useProviderRefuseStore();

  const refuseOrder = (selectedReason: string, reason: string, orderId: string) => {
    const companyID = getCompany();
    if (companyIdIsNull(companyID)) return Promise.reject();
    return fetcher('post', {
      body: {
        model: 'providers/orders/cancel',
        company_id: companyID,
        order_id: orderId,
        canceled_reason: selectedReason,
        canceled_reason_desc: reason,
      },
      requestId: 'refuseOrder',
    })
      .then(({ data }: any) => {
        if (data.isAnError || apiErrorValidation(data?.error, data?.response)) {
          throw new Error(PROVIDER_PANEL_TEXT.FAILURE_REFUSE_ORDER);
        }
        toast.success(PROVIDER_PANEL_TEXT.REFUSED_ORDER);
      })
      .catch((e: Error) => {
        toast.error(e.message);
      });
  };
  const cancelConfirm = () => cancelRequest('confirmRequest');
  return {
    refuseOrder,
    cancelConfirm,
    isRefusing,
  };
};
