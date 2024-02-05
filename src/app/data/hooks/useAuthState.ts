import { toast } from 'react-toastify';
import {
	useAppSelector,
	useAppDispatch,
	LoginParams,
	RegisterParams,
	AuthState,
} from '..';
import {
	loginThunk,
	registerThunk,
	registerFinishThunk,
} from '../redux/thunks/auth.thunk';
import { useNavigate } from 'react-router';

export const useUserAdmin = () => {
	const authState = useAppSelector(
		(state: any) => state.authState as AuthState,
	);

	const getRole = () => authState.userData?.accessRole ?? '';
	const isAuth = () => authState.isAuth;
	const getAccessToken = () => authState.accessToken;
	const isAdmin = () => getRole() === 'admin';

	return { isAuth, isAdmin, getAccessToken };
};

export const useAuthState = () => {
	const authState = useAppSelector(
		(state: any) => state.authState as AuthState,
	);
	const navigate = useNavigate();
	const getUserdata = () => authState.userData;
	const dispatch = useAppDispatch();

	const getAccessToken = () =>
		authState.accessToken ? authState.accessToken : '';

	const isAuth = () => authState.isAuth;

	const signInUser = async (params: LoginParams): Promise<boolean> => {
		return dispatch(loginThunk(params))
			.then((response: any) => {
				const { meta } = response;
				console.log(meta)
				if (meta.rejectedWithValue || meta.requestStatus === 'rejected')
					throw Error(response.payload);
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
		return dispatch(registerThunk(params))
			.then((response: any) => {
				const { meta } = response;
				if (meta.rejectedWithValue) throw Error(response.payload);
				toast.success(`Signup phase one successful`);
				return true;
			})
			.catch((error: Error) => {
				console.error('Error during registration:', error);
				toast.error(
					error.message && error.message !== undefined
						? error.message
						: 'An unexpected error has occurred on the server',
				);
				return false;
			});
	};

	const signUpFinish = async (params: any): Promise<boolean> => {
		return dispatch(registerFinishThunk(params))
			.then((response: any) => {
				const { meta, payload } = response;
				if (meta.rejectedWithValue) throw Error(payload);

				navigate('/auth/signin');
				return true;
			})
			.catch((error: Error) => {
				console.error('Error during registration:', error);
				toast.error(
					error.message && error.message !== undefined
						? error.message
						: 'An unexpected error has occurred on the server',
				);
				return false;
			});
	};

	return {
		getUserdata,
		getAccessToken,
		isAuth,
		signInUser,
		signUpUser,
		signUpFinish,
	};
};
