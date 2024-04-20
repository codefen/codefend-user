import { toast } from 'react-toastify';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useRef } from 'react';
import { useUserData } from '#commonUserHooks/useUserData';

export const useResellerOrders = ()=>{
    const [fetcher, _, isLoading] = useFetcher();
    const { getCompany } = useUserData();
    const orders = useRef<any[]>([]);

    const getResellerOrders =  ()=>{
        const companyID = getCompany();
		if (!companyID) {
			toast.error('User information was not found');
			return;
		}
        fetcher("post", {
            body: {
                model: "resellers/dashboard/orders",
                company_id: getCompany(),
            }
        }).then(({data}: any)=>{
            console.log({data});
        })
    }

    return [orders, {getResellerOrders, isLoading}] as const;
}