import { EMPTY_COMPANY, EMPTY_COMPANY_CUSTOM, EMPTY_GLOBAL_STATE } from '@/app/constants/empty';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { USER_LOGGING_STATE } from '@interfaces/panel';
import { useCallback } from 'react';

export const useUserData = () => {
  const { user, session, company, userLoggingState } = useGlobalFastFields([
    'user',
    'session',
    'company',
    'userLoggingState',
  ]);
  const getUserdata = useCallback(() => user.get, [user]);

  const getAccessToken = useCallback(() => session.get || '', [session.get]);

  const getCompany = useCallback(
    () => company.get?.id || user.get?.company_id,
    [company.get?.id, user.get?.company_id]
  );

  const getCompanyName = useCallback(() => company.get?.name, [company.get?.name]);

  const logout = () => {
    userLoggingState.set(USER_LOGGING_STATE.LOGGED_OUT);
    session.set('');
    user.set(null);
    company.set(EMPTY_COMPANY_CUSTOM);
    setTimeout(() => {
      localStorage.removeItem('globalStore');
      localStorage.setItem('globalStore', JSON.stringify(EMPTY_GLOBAL_STATE));
      window.location.reload();
    }, 350);
  };

  const isAuth = Boolean(session.get);

  return {
    getUserdata,
    getAccessToken,
    getCompany,
    getCompanyName,
    isAuth,
    logout,
    company,
    user,
  };
};
