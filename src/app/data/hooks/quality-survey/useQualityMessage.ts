import { useFetcher } from '#commonHooks/useFetcher';
import { useUserData } from '#commonUserHooks/useUserData';
import { apiErrorValidation, companyIdIsNull } from '@/app/constants/validations';
import { useQualitySurveyStore } from '@stores/qualitySurvey.store';

export const useQualityMessage = () => {
  const { getCompany } = useUserData();
  const [fetcher] = useFetcher();
  const { orderId, referenceNumber } = useQualitySurveyStore();

  const sendMessage = (message: string) => {
    const companyID = getCompany();
    if (companyIdIsNull(companyID)) return;
    fetcher('post', {
      body: {
        model: 'orders/review',
        phase: 'provider_review',
        company_id: companyID,
        order_id: orderId,
        reference_number: referenceNumber,
        provider_review: message,
      },
    }).then(({ data }: any) => {
      if (data.isAnError || apiErrorValidation(data?.error, data?.response)) {
        throw new Error('An error has occurred on the server');
      }
    });
  };

  return sendMessage;
};
