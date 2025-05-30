import { useFetcher } from '#commonHooks/useFetcher';
import { useUserData } from '#commonUserHooks/useUserData';
import { apiErrorValidation, companyIdIsNull } from '@/app/constants/validations';
import { useQualitySurveyStore } from '@stores/qualitySurvey.store';

export const useQualityOverallPhase = () => {
  const { getCompany } = useUserData();
  const [fetcher] = useFetcher();
  const { orderId, referenceNumber } = useQualitySurveyStore();

  const sendOverallPhase = (pollVal: string) => {
    const companyID = getCompany();
    if (companyIdIsNull(companyID) || !pollVal) return;
    fetcher('post', {
      body: {
        model: 'orders/review',
        phase: 'overall_score',
        company_id: companyID,
        order_id: orderId,
        reference_number: referenceNumber,
        overall_score: pollVal,
      },
    }).then(({ data }: any) => {
      if (apiErrorValidation(data)) {
        throw new Error('An error has occurred on the server');
      }
    });
  };

  return sendOverallPhase;
};
