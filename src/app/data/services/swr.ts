import {
	apiErrorValidation,
	companyIdIsNotNull,
	verifySession,
} from '@/app/constants/validations';
import { AxiosHttpService } from './axiosHTTP.service';

export const defaultConfig = {
	keepPreviousData: true,
	revalidateOnReconnect: true,
	revalidateOnFocus: false,
	revalidateOnMount: false,
	revalidateIfStale: true,
	fallbackData: [],
};

export const disponibleFetcher = ([[model, ac], { company, logout }]: any) => {
	if (companyIdIsNotNull(company)) return Promise.reject([]);
	return AxiosHttpService.getInstance()
		.post<any>({
			body: { model: model, ac: ac, company_id: company },
		})
		.then(({ data }) => {
			if (
				verifySession(data, logout) ||
				apiErrorValidation(data?.error, data?.response)
			)
				throw new Error('');
			return data?.disponibles || [];
		})
		.catch(() => [] as any);
};
