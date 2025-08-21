import { EMPTY_COMPANY, EMPTY_COMPANY_CUSTOM, EMPTY_GLOBAL_STATE } from '@/app/constants/empty';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { USER_LOGGING_STATE } from '@interfaces/panel';
import { useCallback, useEffect, useRef } from 'react';

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
    localStorage.removeItem('globalStore');
    localStorage.setItem('globalStore', JSON.stringify(EMPTY_GLOBAL_STATE));
  };

  const isAuth = Boolean(session.get);

  // Debug logging for authentication state (optimized)
  const prevAuthState = useRef({ isAuth: false, sessionId: null, userId: null });
  
  useEffect(() => {
    const currentState = {
      isAuth,
      sessionId: session.get?.id || null,
      userId: user.get?.id || null,
    };
    
    // Solo logear si hay un cambio real en el estado
    if (
      currentState.isAuth !== prevAuthState.current.isAuth ||
      currentState.sessionId !== prevAuthState.current.sessionId ||
      currentState.userId !== prevAuthState.current.userId
    ) {
      console.log('Auth state changed:', currentState);
      prevAuthState.current = currentState;
    }
  }, [isAuth, session.get?.id, user.get?.id]);

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
