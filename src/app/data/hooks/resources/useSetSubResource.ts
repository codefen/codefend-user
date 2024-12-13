import { toast } from 'react-toastify';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useUserData } from '#commonUserHooks/useUserData';
import { apiErrorValidation, companyIdIsNull } from '@/app/constants/validations';
import { APP_MESSAGE_TOAST } from '@/app/constants/app-toast-texts';

export const useSetResource = (type: string, successText: string) => {
  const { getCompany } = useUserData();
  const [fetcher, _, isLoading] = useFetcher();

  const setNewResource = (params: any) => {
    const companyID = getCompany();
    if (companyIdIsNull(companyID)) return Promise.reject(false);
    return fetcher<any>('post', {
      body: {
        model: `resources/${type}`,
        company_id: companyID,
        ...params,
      },
      timeout: 180000,
    })
      .then(({ data }) => {
        if (data.isAnError || apiErrorValidation(data?.error, data?.response)) {
          throw new Error(APP_MESSAGE_TOAST.API_UNEXPECTED_ERROR);
        }
        toast.success(successText);
        return true;
      })
      .catch((error: any) => {
        toast.error(error.message);
        return false;
      });
  };

  return { setNewResource, isLoading };
};
