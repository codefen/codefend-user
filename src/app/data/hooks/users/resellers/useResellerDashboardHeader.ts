import { toast } from 'react-toastify';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useState } from 'react';
import { useUserData } from '#commonUserHooks/useUserData';
import useResellerHeaderStore from '@stores/resellerHeader.store';

export const useResellerDashboardHeader = ()=>{
    const [fetcher, _, isLoading] = useFetcher();
    const { getCompany } = useUserData();
    const {company,reseller_header,setCompany,setResellerHeader} = useResellerHeaderStore()

    const getResellerHeader =  ()=>{
        const companyID = getCompany();
		if (!companyID) {
			toast.error('User information was not found');
			return;
		}
        fetcher("post", {
            body: {
                model: "resellers/dashboard/header",
                company_id: getCompany(),
            }
        }).then(({data}: any)=>{
            setResellerHeader(data.reseller_header);
            setCompany(data.company)
        });
    }

    return [reseller_header,company, {getResellerHeader, isLoading}] as const;
}