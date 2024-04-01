import { toast } from 'react-toastify';
import { type LoginParams, type RegisterParams, type User, getFullCompanyFromUser, useAdminCompanyStore } from '../..';
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

	const signUpFinish = async (params: any): Promise<boolean> => {
		return authStore
			.registerFinish(params)
			.then((res: any) => {
				if (res.response !== "success" || res.response === "error") throw new Error("");

				toast.success(
					"Now you're registered! You can log in"
				);
				
				return true;
			})
			.catch((error: Error) => {
				toast.error(
					'An unexpected error has occurred on the server'
				);
				return false;
			});
	};

	return {
		getUserdata,
		getAccessToken,
		isAuth,
		updateUserData: authStore.updateUser,
		signUpFinish,
		getCompany,
		updateToken: authStore.updateToken,
		logout
	};
};

export const useUserAdmin = () => {
	const {
		userData: { accessRole },
		accessToken,
		isAuth
	} = useAuthStore((state: AuthState) => state);

	const getRole = () => accessRole ?? '';
	const isCurrentAuthValid = () => isAuth;
	const getAccessToken = () => accessToken;
	const isAdmin = () => getRole() === 'admin';

	return { isCurrentAuthValid, isAdmin, getAccessToken };
};

export const useUserProvider = ()=>{
	const { userData: { accessRole } } = useAuthStore((state: AuthState) => state);
	const getRole = () => accessRole ?? '';
	const isHacker = () => getRole() === 'hacker';
	return { getRole, isHacker}
}