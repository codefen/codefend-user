import { toast } from 'react-toastify';
import {
	useAdminCompanyStore,
	useAuthStore,
	type AuthState,
	decodePayload,
} from '../../../';
import { EMPTY_COMPANY } from '@/app/constants/empty';
import { AxiosHttpService } from '@services/axiosHTTP.service';
import { APP_MESSAGE_TOAST, AUTH_TEXT } from '@/app/constants/app-toast-texts';
import { useFetcher } from '#commonHooks/useFetcher';
import { apiErrorValidation } from '@/app/constants/validations';

export const useLoginAction = () => {
	const [fetcher, _, isLoading] = useFetcher();
	const { updateUser,updateAuth,updateToken } = useAuthStore((state: AuthState) => state);
	const { selectCompany } = useAdminCompanyStore((state) => state);
	const axiosHttp = AxiosHttpService.getInstance();
	
	const signInUser = (email: string, password: string): Promise<any> => {
		return fetcher('post', {
			body: {
				provided_password: password,
				provided_email: email,
				model: 'users/access',
			},
		})
			.then(({ data }: any) => {
				if (apiErrorValidation(data?.error, data?.response) || !data.user) {
					throw new Error(
						data?.info || APP_MESSAGE_TOAST.API_UNEXPECTED_ERROR,
					);
				}
				const token = data.session as string;
				const decodedToken = decodePayload(token || '');
				const user = {
					...data.user,
					exp: decodedToken?.exp || 0,
				};
				updateUser(user);
				updateToken(token);
				updateAuth();
				selectCompany({
					...EMPTY_COMPANY,
					id: data.user.company_id || '',
					name: data.user.company_name || '',
				});
				toast.success(AUTH_TEXT.LOGIN_SUCCESS);
				axiosHttp.updateUrlInstance();
				return user;
			})
			.catch((e: any) => {
				toast.error(e.message);
				return false;
			});
	};

	return { signInUser,isLoading };
};
