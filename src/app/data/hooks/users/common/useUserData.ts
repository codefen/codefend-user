import { useAuthStore, type AuthState, useAdminCompanyStore } from "../../..";


export const useUserData = ()=>{
    const authStore = useAuthStore((state: AuthState) => state);
    const {companySelected, reset} = useAdminCompanyStore((state)=> state);
    
    const getUserdata = () => authStore.userData;

    const getAccessToken = () =>
    authStore.accessToken ? authStore.accessToken : '';

    const getCompany = () => companySelected.id || getUserdata().company_id;

    const isAuth = () => authStore.isAuth;

	const logout = ()=>{
		reset();
		authStore.logout();
	}

    return {getUserdata, getAccessToken, getCompany, isAuth, logout, updateUserData: authStore.updateUser, updateToken: authStore.updateToken,};
}