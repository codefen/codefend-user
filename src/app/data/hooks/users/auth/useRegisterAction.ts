import { useFetcher } from '#commonHooks/useFetcher';
import { APP_MESSAGE_TOAST, AUTH_TEXT } from '@/app/constants/app-toast-texts';
import { apiErrorValidation } from '@/app/constants/validations';
import type { RegisterParams } from '@interfaces/auth';
import { toast } from 'react-toastify';

export const useRegisterAction = () => {
	const [fetcher, _, isLoading] = useFetcher();

	const signUpUser = async (params: RegisterParams) => {
		return fetcher('post', {
			body: {
				model: 'users/new',
				...params,
			},
			requestId: 'signUpReq',
		})
			.then(({ data }: any) => {
				if (
					data.email_error === '1' ||
					apiErrorValidation(data?.error, data?.response)
				) {
					if (data.error == '1') throw new Error(data.info);
					if (data.email_error === '1') throw new Error(data.email_info);
				}
				toast.success(AUTH_TEXT.REGISTER_PHASE_ONE);
				return true;
			})
			.catch((error: Error) => {
				toast.error(error.message);
				return false;
			});
	};

	const signUpFinish = async (params: any): Promise<boolean> => {
		return fetcher('post', {
			body: {
				model: 'users/new',
				phase: 2,
				...params,
			},
			requestId: 'signUpFinishReq',
		})
			.then(({ data }: any) => {
				if (
					data.email_error === '1' ||
					apiErrorValidation(data?.error, data?.response)
				) {
					throw new Error(data.info || APP_MESSAGE_TOAST.API_UNEXPECTED_ERROR);
				}
				toast.success(AUTH_TEXT.FINISH_REGISTER);
				return true;
			})
			.catch((e: Error) => {
				toast.error(e.message);
				return false;
			});
	};

	return { signUpUser, signUpFinish };
};
