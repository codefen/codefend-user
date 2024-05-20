import { toast } from 'react-toastify';
import {
	type LoginParams,
	useAdminCompanyStore,
	useAuthStore,
	type AuthState,
} from '../../../';
import { EMPTY_COMPANY } from '@/app/constants/empty';
import { AxiosHttpService } from '@services/axiosHTTP.service';
import { APP_MESSAGE_TOAST, AUTH_TEXT } from '@/app/constants/app-toast-texts';

export const useLoginAction = () => {
	const { login } = useAuthStore((state: AuthState) => state);
	const { selectCompany } = useAdminCompanyStore((state) => state);
	const axiosHttp = AxiosHttpService.getInstance();
	const signInUser = (params: LoginParams): Promise<any> => {
		return login(params)
			.then((data: any) => {
				if (data?.error) {
					throw new Error(data?.info || APP_MESSAGE_TOAST.API_UNEXPECTED_ERROR);
				}
				selectCompany({
					...EMPTY_COMPANY,
					id: data.user.company_id || "",
					name: data.user.company_name || "",
				})
				toast.success(AUTH_TEXT.LOGIN_SUCCESS);
				axiosHttp.updateUrlInstance();
				return data.user;
			})
			.catch((e: any) => {
				toast.error(
					e.message
				);
				return false;
			});
	};

    return { signInUser }
};
