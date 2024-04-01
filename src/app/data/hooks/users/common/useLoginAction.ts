import { toast } from 'react-toastify';
import {
	type LoginParams,
	getFullCompanyFromUser,
	useAdminCompanyStore,
	useAuthStore,
	type AuthState,
} from '../../../';

export const useLoginAction = () => {
	const { login } = useAuthStore((state: AuthState) => state);
	const { selectCompany } = useAdminCompanyStore((state) => state);

	const signInUser = (params: LoginParams): Promise<any> => {
		return login(params)
			.then((data: any) => {
				if (data?.error) {
					throw new Error(data.message);
				}
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
			})
			.finally(() => selectCompany(getFullCompanyFromUser()));
	};

    return { signInUser }
};
