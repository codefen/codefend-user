import { toast } from 'react-toastify';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useRef } from 'react';
import type { Lead } from '@interfaces/lead';
import { useUserData } from '#commonUserHooks/useUserData';

export const useResellerLeads = ()=>{
    const [fetcher, _, isLoading] = useFetcher();
    const { getCompany } = useUserData();
    const leads = useRef<Lead[]>([]);

    const getResellerLeads =  ()=>{
        const companyID = getCompany();
		if (!companyID) {
			toast.error('User information was not found');
			return;
		}
        fetcher("post", {
            body: {
                model: "resellers/dashboard/leads",
                company_id: getCompany(),
            }
        }).then(({data}: any)=>{
            leads.current = data.leads; 
        })
    }

    return [leads, {getResellerLeads, isLoading}] as const;
}