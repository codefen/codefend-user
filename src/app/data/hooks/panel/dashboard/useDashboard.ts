import { useRef } from 'react';
import { companyIdIsNotNull, verifySession } from '@/app/constants/validations';
import { useUserData } from '#commonUserHooks/useUserData.ts';
import { EMPTY_DASHBOARD_PROPS } from '@/app/constants/empty';
import { apiErrorValidation } from '@/app/constants/validations';
import { AxiosHttpService } from '@services/axiosHTTP.service';
import useSWR from 'swr';

const fetcher = ([model, {company, logout}]:any) =>{
	if (companyIdIsNotNull(company)) return Promise.reject(EMPTY_DASHBOARD_PROPS);
	const axiosHttp = AxiosHttpService.getInstance();
	axiosHttp.updateUrlInstance();
	return axiosHttp
		.post<any>({
			body: {company_id: company, model}
		})
		.then(({ data }) =>{
			if(verifySession(data, logout)) return;
			if (apiErrorValidation(data?.error, data?.response)) {
				throw new Error('');
			}
			return data
			? {
				issues: data.issues ? data.issues : [],
				issues_condicion: data.issues_condicion,
				issues_share: data.issues_share,
				members: data.members ? data.members : [],
				resources: data.resources,
			  }
			: EMPTY_DASHBOARD_PROPS;
		}
		);
}
	
		
export const useDashboard = () => {
	const { getCompany, logout } = useUserData();
	const swrKeYRef = useRef<any>(["companies/dashboard", {company: getCompany(), logout}]);
	const { data, isLoading } = useSWR(
		swrKeYRef.current,
		(key:any)=> fetcher(key),
		{
			keepPreviousData: true,
			revalidateOnReconnect: true,
            revalidateOnFocus: true,	
			revalidateOnMount: true,
			fallbackData: EMPTY_DASHBOARD_PROPS,
		}
	);

	return { 
		isLoading, 
		data
	};
};
