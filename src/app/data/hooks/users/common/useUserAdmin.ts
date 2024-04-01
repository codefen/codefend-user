import { useAuthStore, type AuthState } from "../../../";

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