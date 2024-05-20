import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useState } from 'react';
import { useUserData } from '#commonUserHooks/useUserData';
import { companyIdIsNull } from '@/app/constants/validations';

export const useResellerDashboard = ()=>{
    const [fetcher, _, isLoading] = useFetcher();
    const { getCompany } = useUserData();
    const [reseller, setResellerProfile] = useState();

    const getResellerProfile =  ()=>{
        const companyID = getCompany();
		if (companyIdIsNull(companyID)) return;
        fetcher("post", {
            body: {
                model: "resellers/dashboard",
                company_id: getCompany(),
            }
        }).then(({data}: any)=>{
        })
    }

    return [reseller, {getResellerProfile, isLoading}] as const;
}