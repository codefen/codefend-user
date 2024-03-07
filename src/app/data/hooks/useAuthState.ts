import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { LoginParams, RegisterParams, User } from '..';
import type { AuthState } from '../store/auth.store';
import useAuthStore from '../store/auth.store';

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

export const useAuthState = () => {
	const authStore = useAuthStore((state: AuthState) => state);
	const navigate = useNavigate();
	const getUserdata = () => authStore.userData;

	const getAccessToken = () =>
		authStore.accessToken ? authStore.accessToken : '';

	const getCompany = () => {
		const companySelectedFromLocalStorage = localStorage.getItem('companySelected');
		return companySelectedFromLocalStorage !== null
		? JSON.parse(companySelectedFromLocalStorage).id
		: getUserdata()?.companyID;
	}

	const isAuth = () => authStore.isAuth;

	const signInUser = (params: LoginParams): Promise<boolean> => {
		return authStore
			.login(params)
			.then((response: any) => {
				if (response.error) {
					throw new Error(response.message);
				}
				toast.success(`Login successful`);
				return true;
			})
			.catch((error: any) => {
				toast.error(
					error.message && error.message !== undefined
						? error.message
						: 'An unexpected error has occurred on the server',
				);
				return false;
			});
	};

	const signUpUser = async (params: RegisterParams): Promise<boolean> => {
		return authStore
			.register(params)
			.then((response: any) => {
				if (response.error) {
					toast.error('An unexpected error has occurred on the server');
					return false
				} else {
					toast.success(`Signup phase one successful`);
				}
				return true;
			})
			.catch((error: Error) => {
				toast.error(
					error.message && error.message !== undefined
						? error.message
						: 'An unexpected error has occurred on the server',
				);
				return false;
			});
	};

	const signUpFinish = async (params: any): Promise<boolean> => {
		return authStore
			.registerFinish(params)
			.then((response: any) => {
				if (response.error) throw new Error(response.message);
				navigate('/auth/signin');
				return true;
			})
			.catch((error: Error) => {
				toast.error(
					error.message && error.message !== undefined
						? error.message
						: 'An unexpected error has occurred on the server',
				);
				return false;
			});
	};

	const updateUserData = (updatedUser: User)=> {
		authStore.updateUser(updatedUser);
	}

	return {
		getUserdata,
		getAccessToken,
		isAuth,
		signInUser,
		signUpUser,
		signUpFinish,
		updateUserData,
		getCompany,
		updateToken: authStore.updateToken,
		logout: authStore.logout
	};
};
