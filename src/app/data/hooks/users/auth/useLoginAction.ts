import { toast } from 'react-toastify';
import { EMPTY_COMPANY_CUSTOM } from '@/app/constants/empty';
import { AxiosHttpService } from '@services/axiosHTTP.service';
import { APP_MESSAGE_TOAST, AUTH_TEXT } from '@/app/constants/app-toast-texts';
import { useFetcher } from '#commonHooks/useFetcher';
import { apiErrorValidation } from '@/app/constants/validations';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';

export const useLoginAction = () => {
  const [fetcher, _, isLoading] = useFetcher();
  const axiosHttp = AxiosHttpService.getInstance();
  const { session, user, company } = useGlobalFastFields(['session', 'user', 'company']);

  const signInUser = (email: string, password: string, mfa: string): Promise<any> => {
    const body: any = {
      provided_password: password,
      provided_email: email,
    };
    if (mfa) {
      body['provided_mfa_code'] = mfa;
    }
    return fetcher('post', {
      body,
      path: '/users/access',
    })
      .then(({ data }: any) => {
        if (apiErrorValidation(data)) {
          const customError: any = new Error(data.info || APP_MESSAGE_TOAST.API_UNEXPECTED_ERROR);
          customError.code = data?.error_info || 'generic';
          customError.email = email;
          customError.password = password;
          throw customError;
        }
        session.set(data.session as string);
        user.set(data.user);
        company.set({
          ...EMPTY_COMPANY_CUSTOM,
          id: data.user.company_id || '',
          name: data.user.company_name || '',
        });
        toast.success(AUTH_TEXT.LOGIN_SUCCESS);
        axiosHttp.updateUrlInstance();
        return user;
      })
      .catch((e: any) => {
        if (e.code === 'mfa_code_undefined') {
          // No mostrar toast, solo indicar que falta MFA
          return { mfaRequired: true, email: e.email, password: e.password };
        }

        toast.error(e.message);
        return { error: 'invalid_username_or_password' };
      });
  };

  return { signInUser, isLoading };
};
