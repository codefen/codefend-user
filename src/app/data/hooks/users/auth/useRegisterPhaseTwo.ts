import { useFetcher } from '#commonHooks/useFetcher';
import { APP_MESSAGE_TOAST } from '@/app/constants/app-toast-texts';
import { apiErrorValidation } from '@/app/constants/validations';
import { toast } from 'react-toastify';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { useSessionManager } from './useSessionManager';

export const useRegisterPhaseTwo = () => {
  const [fetcher, _, isLoading] = useFetcher();
  const { handleSuccessfulLogin } = useSessionManager();
  const { lead, country } = useGlobalFastFields(['lead', 'country']);

  const signUpFinish = async (params: any): Promise<{ pass: boolean; user: any }> => {
    return fetcher('post', {
      body: {
        phase: 2,
        ...params,
      },
      path: 'users/new',
      requestId: 'signUpFinishReq',
    })
      .then(({ data }: any) => {
        if (data.email_error === '1' || apiErrorValidation(data)) {
          throw new Error(data?.info || APP_MESSAGE_TOAST.API_UNEXPECTED_ERROR);
        }
        const user = handleSuccessfulLogin(data);
        return { pass: true, user };
      })
      .catch((e: Error) => {
        toast.error(e.message);
        return { pass: false, user: null };
      });
  };

  return { isLoading, signUpFinish, lead, country };
};
