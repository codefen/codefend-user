import { LoginParams, LoginResponse, User, mapLoginResponseToUser } from '..';
import { useAuthState } from '../hooks/useAuthState';
import { logout } from '../redux/slices/auth.slice';
import { clearAuth } from '../utils/helper';
import { decodePayload } from './decodedToken';
import { fetchPOST, handleFetchError } from './fetchAPI';

const register = async (registerParams: any) => {
	const { data, status } = (await fetchPOST({
		params: {
			model: 'users/new',
			...registerParams,
		},
	}).catch((error: any) => handleFetchError(error))) as any;

	return { success: status, data };
};

const registerFinish = async (registerParams: any): Promise<any> => {
	const { data, status } = (await fetchPOST({
		params: {
			model: 'users/new',
			phase: 2,
			...registerParams
		},
	}).catch((error: any) => handleFetchError(error))) as any;

	return { data, status };
};

const login = async (loginParams: LoginParams): Promise<LoginResponse> => {
	const { data } = (await fetchPOST({
		params: {
			model: 'users/access',
			provided_email: loginParams.email,
			provided_password: loginParams.password,
		},
	}).catch((error: any) => handleFetchError(error))) as any;
	const response = data.response as string;
	if (response === 'success') {
		const token = data.session as string;
		let user = {} as User;
		if (token || response !== 'success') {
			const decodedToken = decodePayload(token);
			user = {
				...mapLoginResponseToUser(data.user),
				exp: decodedToken.exp ?? 0,
			};
		}
		return { user, token, response };
	}

	return { response, message: data.message as string };
};

const logout2 = async () => {
	clearAuth();
	logout();
};

const verifyAuth: () => boolean = () => {
	const { getUserdata, isAuth } = useAuthState();

	return !getUserdata() || !isAuth();
};

export const AuthServices = {
	register,
	registerFinish,
	login,
	logout2,
	verifyAuth,
};
