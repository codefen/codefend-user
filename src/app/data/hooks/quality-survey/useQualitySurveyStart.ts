import { useFetcher } from '#commonHooks/useFetcher';
import { useUserData } from '#commonUserHooks/useUserData';
import { apiErrorValidation, companyIdIsNull } from '@/app/constants/validations';
import { useQualitySurveyStore } from '@stores/qualitySurvey.store';

export const useQualitySurveyStart = () => {
  const { getCompany } = useUserData();
  const [fetcher] = useFetcher();
  const { updateProvider } = useQualitySurveyStore();

  const startPoll = (orderId: string, referenceNumber: string) => {
    const companyID = getCompany();
    if (companyIdIsNull(companyID) || !orderId) return;
    return fetcher('post', {
      body: {
        model: 'orders/review',
        phase: 'profile_info',
        company_id: companyID,
        order_id: orderId,
        reference_number: referenceNumber,
      },
    }).then(({ data }: any) => {
      if (apiErrorValidation(data)) {
        throw new Error('An error has occurred on the server');
      }

      updateProvider(data.provider);
    });
  };

  return startPoll;
};
