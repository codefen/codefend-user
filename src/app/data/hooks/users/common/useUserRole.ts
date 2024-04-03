import useAuthStore, { type AuthState } from "@stores/auth.store";

export const useUserRole = ()=>{
	const { userData: { accessRole },accessToken,
    isAuth } = useAuthStore((state: AuthState) => state);
	const getRole = () => accessRole || '';
	const isNormalUser = () => getRole() === 'user';
	const isAdmin = () => getRole() === 'admin';
	const isProvider = () => getRole() === 'hacker';
	const isReseller = () => getRole() === 'reseller';

    const isCurrentAuthValid = () => isAuth;
	const getAccessToken = () => accessToken;

	return { getRole, isProvider, isReseller, isAdmin, isNormalUser, getAccessToken, isCurrentAuthValid}
}