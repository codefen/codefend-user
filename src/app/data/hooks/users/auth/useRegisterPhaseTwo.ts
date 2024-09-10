import { useFetcher } from '#commonHooks/useFetcher';
import { APP_MESSAGE_TOAST, AUTH_TEXT } from '@/app/constants/app-toast-texts';
import { apiErrorValidation } from '@/app/constants/validations';
import { toast } from 'react-toastify';
import { AxiosHttpService } from '@services/axiosHTTP.service';
import useAuthStore, { type AuthState } from '@stores/auth.store';
import useAdminCompanyStore from '@stores/adminCompany.store';
import { decodePayload } from '@services/decodedToken';
import { EMPTY_COMPANY } from '@/app/constants/empty';

export const useRegisterPhaseTwo = () => {
  const [fetcher, _, isLoading] = useFetcher();
  const { updateUser, updateAuth, updateToken } = useAuthStore((state: AuthState) => state);
  const { selectCompany } = useAdminCompanyStore(state => state);
  const axiosHttp = AxiosHttpService.getInstance();

  const signUpFinish = async (params: any): Promise<boolean> => {
    return fetcher('post', {
      body: {
        model: 'users/new',
        phase: 2,
        ...params,
      },
      requestId: 'signUpFinishReq',
    })
      .then(({ data }: any) => {
        if (data.email_error === '1' || apiErrorValidation(data?.error, data?.response)) {
          throw new Error(data.info || APP_MESSAGE_TOAST.API_UNEXPECTED_ERROR);
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
        toast.success(AUTH_TEXT.LOGIN_SUCCESS);
        axiosHttp.updateUrlInstance();
        return data.user;
      })
      .catch((e: Error) => {
        toast.error(e.message);
        return {};
      });
  };

  return { isLoading, signUpFinish };
};
