import { apiErrorValidation, companyIdIsNull, verifySession } from '@/app/constants/validations';
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
      body: { ac: ac, company_id: company },
      path: model,
    })
    .then(({ data }) => {
      if (verifySession(data, logout) || apiErrorValidation(data?.error, data?.response))
        throw new Error('');
      return { disponibles: data?.disponibles || [], company: data?.company || null };
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
      if (verifySession(data, logout) || apiErrorValidation(data?.error, data?.response))
        throw new Error('');
      return data?.resources || [];
    })
    .catch(() => [] as any);
};

export const genericFetcher = ([model, params]: any) => {
  const { logout, ...body } = params;
  if (body?.company_id && companyIdIsNull(body?.company_id)) return Promise.reject({});
  return AxiosHttpService.getInstance()
    .post<any>({
      body,
      path: model,
    })
    .then(({ data }) => {
      if (verifySession(data, params?.logout) || apiErrorValidation(data?.error, data?.response))
        throw new Error('');
      return data;
    })
    .catch(() => {});
};
