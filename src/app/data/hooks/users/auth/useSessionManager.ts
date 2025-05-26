import { toast } from 'react-toastify';
import { AxiosHttpService } from '@services/axiosHTTP.service';
import { EMPTY_COMPANY_CUSTOM } from '@/app/constants/empty';
import { AUTH_TEXT } from '@/app/constants/app-toast-texts';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { APP_EVENT_TYPE } from '@interfaces/panel';

export const useSessionManager = () => {
  const axiosHttp = AxiosHttpService.getInstance();
  const { session, user, company, appEvent, isDefaultPlan } = useGlobalFastFields([
    'session',
    'user',
    'company',
    'appEvent',
    'isDefaultPlan',
  ]);

  const handleSuccessfulLogin = (data: any) => {
    session.set(data.session as string);
    user.set(data?.user);
    company.set({
      ...EMPTY_COMPANY_CUSTOM,
      id: data.user.company_id || '',
      name: data.user.company_name || '',
    });
    toast.success(AUTH_TEXT.LOGIN_SUCCESS);
    appEvent.set(APP_EVENT_TYPE.USER_LOGGED_IN);
    isDefaultPlan.set(true);
    axiosHttp.updateUrlInstance();
    return data.user;
  };

  return { handleSuccessfulLogin };
};
