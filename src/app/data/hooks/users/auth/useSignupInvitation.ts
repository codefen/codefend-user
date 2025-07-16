import { useFetcher } from '#commonHooks/useFetcher';
import { APP_MESSAGE_TOAST } from '@/app/constants/app-toast-texts';
import { apiErrorValidation } from '@/app/constants/validations';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { toast } from 'react-toastify';
import { useSessionManager } from './useSessionManager';

export const useSignupInvitation = () => {
  const [fetcher, _, isLoading] = useFetcher();
  const { handleSuccessfulLogin } = useSessionManager();
  const { country } = useGlobalFastFields(['country']);

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
        if (apiErrorValidation(data)) {
          throw new Error(data?.info || APP_MESSAGE_TOAST.API_UNEXPECTED_ERROR);
        }
        handleSuccessfulLogin(data);
        // 🚨 SOLUCIÓN: Dar tiempo para que el estado se persista antes de redirigir
        setTimeout(() => {
          window.location.href = '/';
        }, 200);
      })
      .catch((e: Error) => {
        toast.error(e.message);
      });
  };

  return { sendSignUp, isLoading, country };
};
