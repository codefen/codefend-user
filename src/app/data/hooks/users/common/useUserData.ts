import { EMPTY_GLOBAL_STATE, MAX_SCAN_RETRIES } from '@/app/constants/empty';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { useScanRetriesStore } from '@stores/scanRetries.store';
import { useCallback } from 'react';

export const useUserData = () => {
  const { user, session, company, appEvent } = useGlobalFastFields([
    'user',
    'session',
    'company',
    'appEvent',
  ]);
  const { setScanRetries } = useScanRetriesStore();
  const getUserdata = useCallback(() => user.get, [user]);

  const getAccessToken = useCallback(() => session.get || '', [session.get]);

  const getCompany = useCallback(
    () => company.get?.id || user.get?.company_id,
    [company.get?.id, user.get?.company_id]
  );

  const getCompanyName = useCallback(() => company.get?.name, [company.get?.name]);

  const logout = useCallback(() => {
    setScanRetries(MAX_SCAN_RETRIES);
    localStorage.removeItem('globalStore');
    localStorage.setItem('globalStore', JSON.stringify(EMPTY_GLOBAL_STATE));
    localStorage.setItem('scanRetriesLocal', MAX_SCAN_RETRIES.toString());
    window.location.reload();
  }, [session.get, appEvent.get]);

  // 3) Calcular si está autenticado:
  //    solo depende de si session.get existe o no.
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
