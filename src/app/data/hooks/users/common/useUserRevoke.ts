import { useFetcher } from '#commonHooks/useFetcher';
import { apiErrorValidation, companyIdIsNull } from '@/app/constants/validations';
import { useUserData } from './useUserData';
import { toast } from 'react-toastify';
import { APP_MESSAGE_TOAST, PREFERENCE_PANEL_TEXT } from '@/app/constants/app-toast-texts';

export const useUserRevoke = () => {
  const { getCompany } = useUserData();
  const [fetcher, _, isLoading] = useFetcher();

  const revokeAccessUser = (userID: string) => {
    const companyID = getCompany();
    if (companyIdIsNull(companyID)) return Promise.reject(false);

    return fetcher<any>('post', {
      body: {
        company_id: companyID,
        revoke_id: userID,
      },
      path: 'users/revoke',
    }).then(({ data }) => {
      if (data.isAnError || apiErrorValidation(data)) {
        throw new Error(APP_MESSAGE_TOAST.API_UNEXPECTED_ERROR);
      }
      toast.success(PREFERENCE_PANEL_TEXT.REVOKE_USER_ACCESS);
    });
  };

  return { revokeAccessUser, isLoading };
};
