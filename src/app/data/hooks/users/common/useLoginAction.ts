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
					throw new Error(data.info);
				}
				selectCompany({
					id: data.company_id,
					name: data.company_name,
					sub_class: "",
					web: '',
					size: '',
					pais_code: '',
					pais: '',
					pais_provincia: '',
					pais_ciudad: '',
					owner_fname: '',
					owner_lname: '',
					owner_role: '',
					owner_email: '',
					owner_phone: '',
					orders_size: '',
					profile_media: '',
					mercado: '',
					isDisabled: false,
					createdAt: '',
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
