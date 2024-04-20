import { toast } from 'react-toastify';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useRef } from 'react';
import { useUserData } from '#commonUserHooks/useUserData';

export const useResellerCompanies = ()=>{
    const [fetcher, _, isLoading] = useFetcher();
    const { getCompany } = useUserData();
    const companies = useRef<any[]>([]);

    const getResellerCompanies =  ()=>{
        const companyID = getCompany();
		if (!companyID) {
			toast.error('User information was not found');
			return;
		}
        fetcher("post", {
            body: {
                model: "resellers/dashboard/companies",
                company_id: getCompany(),
            }
        }).then(({data}: any)=>{
            console.log({data});
        })
    }

    return [companies, {getResellerCompanies, isLoading}] as const;
}