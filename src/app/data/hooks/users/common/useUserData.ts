import { EMPTY_COMPANY_CUSTOM, EMPTY_GLOBAL_STATE, EMPTY_USER } from '@/app/constants/empty';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { useCallback, useMemo } from 'react';

export const useUserData = () => {
  const { user, session, company } = useGlobalFastFields(['user', 'session', 'company']);
  const getUserdata = useCallback(() => user.get, [user]);

  const getAccessToken = useCallback(() => session.get || '', [session.get]);

  const getCompany = useCallback(
    () => company.get?.id || user.get?.company_id,
    [company.get?.id, user.get?.company_id]
  );

  const getCompanyName = useCallback(() => company.get?.name, [company.get?.name]);

  const logout = useCallback(() => {
    session.set('');
  }, [session]);

  // 3) Calcular si está autenticado:
  //    solo depende de si session.get existe o no.
  const isAuth = useMemo(() => Boolean(session.get), [session.get]);

  return useMemo(
    () => ({
      getUserdata,
      getAccessToken,
      getCompany,
      getCompanyName,
      isAuth,
      logout,
      company,
      user,
    }),
    [getUserdata, getCompany, getCompanyName, isAuth, logout, company.get, user.get]
  );
};
