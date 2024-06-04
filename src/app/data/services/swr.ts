import {
	apiErrorValidation,
	companyIdIsNull,
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
	if (companyIdIsNull(company)) return Promise.reject([]);
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

export const resourcesFetcher = ([[model, childs], { company, logout }]: any) => {
	if (companyIdIsNull(company)) return Promise.reject([]);
	return AxiosHttpService.getInstance()
		.post<any>({
			body: { model: model, childs: childs, company_id: company },
		})
		.then(({ data }) => {
			if (
				verifySession(data, logout) ||
				apiErrorValidation(data?.error, data?.response)
			)
				throw new Error('');
			return data?.resources || [];
		})
		.catch(() => [] as any);
};

export const genericFetcher = ([model, params]: any) => {
	if (params?.company_id && companyIdIsNull(params?.company_id)) return Promise.reject({});

	return AxiosHttpService.getInstance()
		.post<any>({
			body: { model: model, ...params },
		})
		.then(({ data }) => {
			if (apiErrorValidation(data?.error, data?.response))
				throw new Error('');
			return data;
		})
		.catch(() => {});
};
