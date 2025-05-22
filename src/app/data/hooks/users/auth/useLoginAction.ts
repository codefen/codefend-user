import { toast } from 'react-toastify';
import { APP_MESSAGE_TOAST, AUTH_TEXT } from '@/app/constants/app-toast-texts';
import { useFetcher } from '#commonHooks/useFetcher';
import { apiErrorValidation } from '@/app/constants/validations';
import { useSessionManager } from './useSessionManager';

export const useLoginAction = () => {
  const [fetcher, _, isLoading] = useFetcher();
  const { handleSuccessfulLogin } = useSessionManager();

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
        return handleSuccessfulLogin(data);
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
