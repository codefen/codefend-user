import { useAuthState } from '../..';
import { toast } from 'react-toastify';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useState } from 'react';

export const useResellerDashboard = ()=>{
    const [fetcher, _, isLoading] = useFetcher();
    const { getCompany } = useAuthState();
    const [reseller, setResellerProfile] = useState();

    const getResellerProfile =  ()=>{
        const companyID = getCompany();
		if (!companyID) {
			toast.error('User information was not found');
			return;
		}
        fetcher("post", {
            body: {
                model: "resellers/dashboard",
                company_id: getCompany(),
            }
        }).then(({data}: any)=>{
            console.log({data});
        })
    }

    return [reseller, {getResellerProfile, isLoading}] as const;
}