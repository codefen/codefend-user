import { useFetcher } from '#commonHooks/useFetcher';
import { APP_MESSAGE_TOAST } from '@/app/constants/app-toast-texts';
import { EMPTY_COMPANY } from '@/app/constants/empty';
import { apiErrorValidation } from '@/app/constants/validations';
import { useGlobalFastField } from '@/app/views/context/AppContextProvider';
import { AxiosHttpService } from '@services/axiosHTTP.service';
import { decodePayload } from '@services/decodedToken';
import { useAdminCompanyStore, useAuthStore, type AuthState } from '@stores/index';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

export const useSignupInvitation = () => {
  const [fetcher, _, isLoading] = useFetcher();
  const country = useGlobalFastField('country');
  const { updateUser, updateAuth, updateToken } = useAuthStore((state: AuthState) => state);
  const { selectCompany } = useAdminCompanyStore(state => state);
  const axiosHttp = AxiosHttpService.getInstance();

  const sendSignUp = (formObject: Record<any, FormDataEntryValue>) => {
    fetcher('post', {
      body: {
        invoke_user_email: formObject['invoke_user_email'],
        invoke_user_hash: formObject['invoke_user_hash'],
        user_fname: formObject['user_fname'],
        user_lname: formObject['user_lname'],
        user_username: formObject['user_username'],
        user_phone: formObject['user_phone'],
        user_password: formObject['user_password'],
        user_idiom: formObject['user_idiom'],
      },
      path: 'users/invoke/finish',
    })
      .then(({ data }: any) => {
        if (data.isAnError || apiErrorValidation(data?.error, data?.response)) {
          throw new Error(data?.info || APP_MESSAGE_TOAST.API_UNEXPECTED_ERROR);
        }
        const token = data.session as string;
        const decodedToken = decodePayload(token || '');
        const user = {
          ...data.user,
          exp: decodedToken?.exp || 0,
        };
        updateUser(user);
        updateToken(token);
        updateAuth();
        selectCompany({
          ...EMPTY_COMPANY,
          id: data.user.company_id || '',
          name: data.user.company_name || '',
        });
        axiosHttp.updateUrlInstance();
        window.location.href = '/';
      })
      .catch((e: Error) => {
        toast.error(e.message);
      });
  };

  return { sendSignUp, isLoading, country };
};
