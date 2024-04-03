import { toast } from 'react-toastify';
import {useAdminCompanyStore } from '../..';
import type { AuthState } from '../../store/auth.store';
import useAuthStore from '../../store/auth.store';

export const useAuthState = () => {
	const authStore = useAuthStore((state: AuthState) => state);
    const {companySelected, reset} = useAdminCompanyStore((state)=> state);
    
    const getUserdata = () => authStore.userData;
    const getAccessToken = () =>
    authStore.accessToken ? authStore.accessToken : '';
    const getCompany = () => companySelected?.id || getUserdata().companyID;
    const isAuth = () => authStore.isAuth;

	const logout = ()=>{
		reset();
		authStore.logout();
	}

	return {
		getUserdata,
		getAccessToken,
		isAuth,
		updateUserData: authStore.updateUser,
		getCompany,
		updateToken: authStore.updateToken,
		logout
	};
};