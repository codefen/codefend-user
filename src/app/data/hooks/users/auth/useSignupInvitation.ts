import { useFetcher } from '#commonHooks/useFetcher';
import { APP_MESSAGE_TOAST } from '@/app/constants/app-toast-texts';
import { EMPTY_COMPANY_CUSTOM } from '@/app/constants/empty';
import { apiErrorValidation } from '@/app/constants/validations';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { AxiosHttpService } from '@services/axiosHTTP.service';
import { toast } from 'react-toastify';

export const useSignupInvitation = () => {
  const [fetcher, _, isLoading] = useFetcher();
  const axiosHttp = AxiosHttpService.getInstance();
  const { session, user, company, lead, country } = useGlobalFastFields([
    'session',
    'user',
    'company',
    'lead',
    'country',
  ]);

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
        developer: 'increible',
      },
      path: 'users/invoke/finish',
      insecure: true,
    })
      .then(({ data }: any) => {
        if (apiErrorValidation(data)) {
          throw new Error(data?.info || APP_MESSAGE_TOAST.API_UNEXPECTED_ERROR);
        }
        session.set(data.session as string);
        user.set(data.user);
        company.set({
          ...EMPTY_COMPANY_CUSTOM,
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
