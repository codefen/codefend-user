import { toast } from 'react-toastify';
import { AxiosHttpService } from '@services/axiosHTTP.service';
import { EMPTY_COMPANY_CUSTOM } from '@/app/constants/empty';
import { AUTH_TEXT } from '@/app/constants/app-toast-texts';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { APP_EVENT_TYPE, USER_LOGGING_STATE } from '@interfaces/panel';

export const useSessionManager = () => {
  const axiosHttp = AxiosHttpService.getInstance();
  const { session, user, company, appEvent, isDefaultPlan, userLoggingState } = useGlobalFastFields(
    ['session', 'user', 'company', 'appEvent', 'isDefaultPlan', 'userLoggingState']
  );

  const handleSuccessfulLogin = (data: any, showToast: boolean = true) => {
    session.set(data.session as string);
    user.set(data?.user);
    company.set({
      ...EMPTY_COMPANY_CUSTOM,
      id: data.user.company_id || '',
      name: data.user.company_name || '',
    });
    if (showToast) {
    toast.success(AUTH_TEXT.LOGIN_SUCCESS);
    }
    isDefaultPlan.set(true);
    appEvent.set(APP_EVENT_TYPE.USER_LOGGED_IN);
    userLoggingState.set(USER_LOGGING_STATE.LOGGED_IN);
    
    // 🚨 SOLUCIÓN: Actualizar el token directamente en lugar de depender de localStorage
    axiosHttp.updateSession(data.session as string);
    axiosHttp.updateUrlInstance();
    
    return data.user;
  };

  return { handleSuccessfulLogin };
};
