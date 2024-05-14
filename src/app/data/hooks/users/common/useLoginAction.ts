import { toast } from 'react-toastify';
import {
	type LoginParams,
	getFullCompanyFromUser,
	useAdminCompanyStore,
	useAuthStore,
	type AuthState,
} from '../../../';
import { EMPTY_COMPANY } from '@/app/constants/empty';

export const useLoginAction = () => {
	const { login } = useAuthStore((state: AuthState) => state);
	const { selectCompany } = useAdminCompanyStore((state) => state);

	const signInUser = (params: LoginParams): Promise<any> => {
		return login(params)
			.then((data: any) => {
				if (data?.error) {
					throw new Error(data.info);
				}
				selectCompany({
					...EMPTY_COMPANY,
					id: data.user.company_id || "",
					name: data.user.company_name || "",
				})
				toast.success(`Login successful`);
				return data.user;
			})
			.catch((error: any) => {
				toast.error(
					error.message
						? error.message
						: 'An unexpected error has occurred on the server',
				);
				return false;
			});
	};

    return { signInUser }
};
