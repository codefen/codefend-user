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
    // console.log('🔐 useSessionManager: Starting login process', {
    //   hasSession: !!data.session,
    //   hasUser: !!data?.user,
    //   userId: data?.user?.id,
    //   companyId: data?.user?.company_id,
    //   timestamp: new Date().toISOString(),
    // });

    // Store login timestamp FIRST to help detect timing issues
    localStorage.setItem('last_login_timestamp', Date.now().toString());

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

    // Update axios instance with new session
    axiosHttp.updateUrlInstance();

    // Use setTimeout to check state after React processes the setters
    setTimeout(() => {
      // console.log('✅ useSessionManager: Login completed successfully (after React update)', {
      //   sessionSet: !!session.get,
      //   userSet: !!user.get,
      //   companySet: !!company.get?.id,
      //   sessionValue: session.get ? `${session.get.substring(0, 10)}...` : 'null',
      //   userId: user.get?.id,
      //   companyId: company.get?.id,
      //   timestamp: new Date().toISOString(),
      // });

      // Verify everything is set correctly
      if (!session.get || !user.get || !company.get?.id) {
        console.error('🚨 useSessionManager: Critical - State not set correctly after login!');
      } else {
        console.log('✅ useSessionManager: All state verified successfully');
      }
    }, 100); // Give React time to process the setters

    return data.user;
  };

  return { handleSuccessfulLogin };
};
