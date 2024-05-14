import { useRef } from 'react';
import { useOrderStore, ResourcesTypes } from '../../..';
import { apiErrorValidation, companyIdIsNotNull, verifySession } from '@/app/constants/validations';
import { useUserData } from '#commonUserHooks/useUserData';
import { AxiosHttpService } from '@services/axiosHTTP.service';
import useSWR from 'swr';

const fetcher = ([model, {company, logout}]:any) =>{
	if (companyIdIsNotNull(company)) return Promise.reject([]);
	return AxiosHttpService.getInstance()
		.post<any>({
			body: {model: model,
			ac: 'view_all',
			company_id: company
		}}).then(({ data }) =>{
			if(verifySession(data, logout)) return;
			if (apiErrorValidation(data?.error, data?.response)) throw new Error('');
			return data?.disponibles || [];
		});
}

/* Custom Hook "useSocial" to handle GET data in Social page*/
export const useSocial = () => {
	const { updateState,setScopeTotalResources } = useOrderStore((state) => state);
	const { getCompany, logout} = useUserData();
	const swrKeYRef = useRef<any>(["resources/se", {company: getCompany(), logout}]);
	const { data, mutate, isLoading } = useSWR(
		swrKeYRef.current,
		(key:any)=> fetcher(key),
		{
			keepPreviousData: true,
			revalidateOnReconnect: true,
            revalidateOnFocus: false,	
			revalidateOnMount: false,
			fallbackData: [],
			onSuccess: ()=>{
				setScopeTotalResources(data.length);
				updateState("resourceType", ResourcesTypes.SOCIAL);
			}
		}
	);

	return { members: data, isLoading, refetch: ()=> mutate(swrKeYRef.current) };
};
