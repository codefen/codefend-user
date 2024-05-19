import { useEffect, useRef } from 'react';
import { companyIdIsNull, verifySession } from '@/app/constants/validations';
import { useUserData } from '#commonUserHooks/useUserData.ts';
import { apiErrorValidation } from '@/app/constants/validations';
import { AxiosHttpService } from '@services/axiosHTTP.service';
import useSWR from 'swr';
import { useQualitySurveyStore } from '@stores/qualitySurvey.store';
import { useQualitySurveyStart } from './useQualitySurveyStart';

const fetcher = ([model, {company,user, logout}]:any) =>{
	if (companyIdIsNull(company)) return Promise.reject(false);
	return AxiosHttpService.getInstance()
		.post<any>({
			body: {company_id: company, user_id: user, model}
		})
		.then(({ data }) =>{
			if(verifySession(data, logout)) return;
			if (apiErrorValidation(data?.error, data?.response)) {
				throw new Error('');
			}
			return data.communiques ? data.communiques : [];
		}
		);
}
	
		
export const useUserHavePollActive = () => {
	const { getUserdata, getCompany, logout } = useUserData();
    const { isOpen,updateIsOpen, updateOrderId, updateReferenceNumber } =
		useQualitySurveyStore();
    const startPoll = useQualitySurveyStart();
	const swrKeYRef = useRef<any>(["users/communiques/index", {company: getCompany(), user: getUserdata().id, logout}]);
	const { data, isLoading,isValidating } = useSWR(
		swrKeYRef.current,
		(key:any)=> fetcher(key),
		{
			keepPreviousData: false,
            refreshInterval: 213000,
			revalidateOnReconnect: false,
            revalidateOnFocus: false,	
			revalidateOnMount: false,
            fallbackData: [],
		}
	);

    useEffect(()=>{
        const orderComunique = data.length > 0 ? data.find((item:any) => item.solved == "unsolved" && item.model === 'order_finished') : undefined;
        if(!isOpen && orderComunique) {   
            startPoll(orderComunique.order_id, orderComunique.order_reference_number)?.finally(()=>{
                
                updateIsOpen(true);
                updateOrderId(orderComunique.order_id);
                updateReferenceNumber(orderComunique.order_reference_number);
            });
        }
    }, [data,isLoading,isValidating]);

};
