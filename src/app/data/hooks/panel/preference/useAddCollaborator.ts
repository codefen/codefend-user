import { toast } from 'react-toastify';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useUserData } from '#commonUserHooks/useUserData';
import { apiErrorValidation } from '@/app/constants/validations';
import { APP_MESSAGE_TOAST, PREFERENCE_PANEL_TEXT } from '@/app/constants/app-toast-texts';

/* Custom Hook "usePreferences" to handle retrieving all user preferences*/
export const useAddCollaborator = () => {
  const { getCompany } = useUserData();
  const [fetcher, _, isLoading] = useFetcher(true);

  const sendAddCollaborator = (email: string) => {
    return fetcher('post', {
      body: {
        company_id: getCompany() || '',
        invoke_user_email: email,
      },
      path: 'users/invoke',
    })
      .then(({ data }: any) => {
        if (apiErrorValidation(data)) {
          throw new Error(data?.info || APP_MESSAGE_TOAST.API_UNEXPECTED_ERROR);
        }

        toast.success(PREFERENCE_PANEL_TEXT.GUEST_COLABORATOR);
      })
      .catch((e: Error) => {
        toast.error(e.message);
      });
  };

  return { sendAddCollaborator, isLoading };
};
