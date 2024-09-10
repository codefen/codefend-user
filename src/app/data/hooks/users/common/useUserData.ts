import { useAuthStore, type AuthState, useAdminCompanyStore } from '../../..';

export const useUserData = () => {
  const {
    accessToken,
    isAuth,
    logout: logoutFn,
    userData,
    updateUser,
    updateToken,
    updateAuth,
  } = useAuthStore((state: AuthState) => state);
  const { companySelected, reset } = useAdminCompanyStore(state => state);

  const getUserdata = () => userData;

  const getAccessToken = () => (accessToken ? accessToken : '');

  const getCompany = () => companySelected?.id || getUserdata().company_id;

  const logout = () => {
    reset();
    logoutFn();
  };

  return {
    getUserdata,
    getAccessToken,
    getCompany,
    isAuth,
    logout,
    updateUserData: updateUser,
    updateToken: updateToken,
    updateAuth,
  };
};
