import { EMPTY_COMPANY_CUSTOM, EMPTY_GLOBAL_STATE, EMPTY_USER } from '@/app/constants/empty';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';

export const useUserData = () => {
  const { user, session, company } = useGlobalFastFields(['user', 'session', 'company']);
  const getUserdata = () => user.get;
  const getAccessToken = () => session.get || '';
  const getCompany = () => company.get?.id || getUserdata()?.company_id;
  const getCompanyName = () => company.get.name;

  const logout = () => {
    user.set(EMPTY_USER);
    session.set('');
    company.set(EMPTY_COMPANY_CUSTOM);
    localStorage.clear();
    localStorage.setItem('globalStore', JSON.stringify(EMPTY_GLOBAL_STATE));
  };

  return {
    getUserdata,
    getAccessToken,
    getCompany,
    getCompanyName,
    isAuth: !!session.get,
    logout,
    company,
    user,
  };
};
