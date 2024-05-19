import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useRef } from 'react';
import { useUserData } from '#commonUserHooks/useUserData';
import { apiErrorValidation, companyIdIsNull } from '@/app/constants/validations';
import { verifySession } from '@/app/constants/validations';

export const useResellerCompanies = ()=>{
    const [fetcher, _, isLoading] = useFetcher();
    const { getCompany,logout} = useUserData();
    const companies = useRef<any[]>([]);

    const getResellerCompanies =  ()=>{
        const companyID = getCompany();
		if (companyIdIsNull(companyID)) return;
        
        fetcher("post", {
            body: {
                model: "resellers/dashboard/companies",
                company_id: getCompany(),
            }
        }).then(({data}: any)=>{
            if(verifySession(data, logout)) return;
            if (apiErrorValidation(data?.error, data?.response)) {
				throw new Error('An error has occurred on the server');
			}
            companies.current = data.companies;
        });
    }

    return [companies, {getResellerCompanies, isLoading}] as const;
}