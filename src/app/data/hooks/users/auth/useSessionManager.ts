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

    const loginCompany = {
      ...EMPTY_COMPANY_CUSTOM,
      id: data.user.company_id || '',
      name: data.user.company_name || '',
    };
    // Requests may start before the state persistor runs. Publish the new session
    // synchronously so newly mounted hooks never reload an empty or stale token.
    try {
      const saved = JSON.parse(localStorage.getItem('globalStore') || '{}');
      localStorage.setItem('globalStore', JSON.stringify({ ...saved, session: data.session, user: data.user, company: loginCompany }));
    } catch {
      localStorage.setItem('globalStore', JSON.stringify({ session: data.session, user: data.user, company: loginCompany }));
    }
    session.set(data.session as string);
    user.set(data?.user);
    company.set(loginCompany);

    if (showToast) {
      toast.success(AUTH_TEXT.LOGIN_SUCCESS);
    }
    isDefaultPlan.set(true);
    appEvent.set(APP_EVENT_TYPE.USER_LOGGED_IN);
    userLoggingState.set(USER_LOGGING_STATE.LOGGED_IN);

    // Update axios instance with new session
    axiosHttp.updateUrlInstance();
    axiosHttp.updateSession(data.session as string);

    // Robust state verification with exponential backoff
    const verifyStateWithRetry = (
      attempt: number = 1,
      maxAttempts: number = 10,
      baseDelay: number = 50
    ): Promise<void> => {
      return new Promise((resolve, reject) => {
        const checkState = () => {
          const sessionValue = session.get;
          const userValue = user.get;
          const companyValue = company.get;

          // Verify all critical state is properly set
          if (sessionValue && userValue && companyValue?.id) {
            console.log('✅ useSessionManager: All state verified successfully', {
              attempt,
              sessionPresent: !!sessionValue,
              userId: userValue?.id,
              companyId: companyValue?.id,
              timestamp: new Date().toISOString(),
            });
            resolve();
            return;
          }

          // If max attempts reached, log warning but don't fail
          if (attempt >= maxAttempts) {
            console.warn('⚠️ useSessionManager: State verification incomplete after max attempts', {
              attempt,
              sessionPresent: !!sessionValue,
              userPresent: !!userValue,
              companyPresent: !!companyValue?.id,
              timestamp: new Date().toISOString(),
            });
            // Don't reject, just resolve to prevent login failure
            resolve();
            return;
          }

          // Retry with exponential backoff
          const delay = baseDelay * Math.pow(1.5, attempt - 1);
          console.log(`🔄 useSessionManager: State not ready, retrying in ${delay}ms (attempt ${attempt}/${maxAttempts})`);
          
          setTimeout(() => {
            verifyStateWithRetry(attempt + 1, maxAttempts, baseDelay)
              .then(resolve)
              .catch(reject);
          }, delay);
        };

        checkState();
      });
    };

    // Start verification but don't block the login flow
    verifyStateWithRetry()
      .then(() => {
        console.log('🎯 useSessionManager: Login verification completed successfully');
      })
      .catch((error) => {
        console.error('❌ useSessionManager: Verification failed:', error);
      });

    return data.user;
  };

  return { handleSuccessfulLogin };
};
