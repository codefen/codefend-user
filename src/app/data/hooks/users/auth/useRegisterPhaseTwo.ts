import { useFetcher } from '#commonHooks/useFetcher';
import { APP_MESSAGE_TOAST, AUTH_TEXT } from '@/app/constants/app-toast-texts';
import { apiErrorValidation } from '@/app/constants/validations';
import { toast } from 'react-toastify';
import { AxiosHttpService } from '@services/axiosHTTP.service';
import { decodePayload } from '@services/decodedToken';
import { EMPTY_COMPANY_CUSTOM } from '@/app/constants/empty';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';

export const useRegisterPhaseTwo = () => {
  const [fetcher, _, isLoading] = useFetcher();
  const axiosHttp = AxiosHttpService.getInstance();
  const { session, user, company, lead, country } = useGlobalFastFields([
    'session',
    'user',
    'company',
    'lead',
    'country',
  ]);

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
        session.set(data.session as string);
        user.set(data.user);
        company.set({
          ...EMPTY_COMPANY_CUSTOM,
          id: data.user.company_id || '',
          name: data.user.company_name || '',
        });
        toast.success(AUTH_TEXT.LOGIN_SUCCESS);
        axiosHttp.updateUrlInstance();
        return { pass: true, user: data.user };
      })
      .catch((e: Error) => {
        toast.error(e.message);
        return { pass: false, user: null };
      });
  };

  return { isLoading, signUpFinish, lead, country };
};
