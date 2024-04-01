import { useAuthStore, type AuthState } from "../../../";

export const useUserProvider = ()=>{
	const { userData: { accessRole } } = useAuthStore((state: AuthState) => state);
	const getRole = () => accessRole ?? '';
	const isHacker = () => getRole() === 'hacker';
	return { getRole, isHacker}
}