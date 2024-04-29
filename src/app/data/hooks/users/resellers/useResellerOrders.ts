import { toast } from 'react-toastify';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useRef } from 'react';
import { useUserData } from '#commonUserHooks/useUserData';
import type { FullOrder } from '@interfaces/order';

export const useResellerOrders = ()=>{
    const [fetcher, _, isLoading] = useFetcher();
    const { getCompany } = useUserData();
    const orders = useRef<FullOrder[]>([]);

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
            orders.current = data.orders ? data.orders : [];
        })
    }

    return [orders, {getResellerOrders, isLoading}] as const;
}