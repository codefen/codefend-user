import { useFetcher } from "#commonHooks/useFetcher";
import { useUserData } from "#commonUserHooks/useUserData";
import { apiErrorValidation, companyIdIsNull } from "@/app/constants/validations";
import type { FullOrder } from "@interfaces/order";
import { verifySession } from '@/app/constants/validations';
import { useRef, useState } from "react";
import { toast } from "react-toastify";

export const useProviderOrders = ()=>{
    const { getCompany,logout } = useUserData();
    const [fetcher,_, isLoading] = useFetcher();
    const [orders, setOrders] = useState<FullOrder[]>([]);

    const getProviderOrders =  ()=>{
        const companyID = getCompany();
		if (companyIdIsNull(companyID)) return;
        fetcher<any>("post", {
            body: {
                model: "providers/orders/index/unconfirmed",
                company_id: companyID
            }
        }).then(({data}:any)=>{
            if(verifySession(data, logout)) return;
            if (data.isAnError || apiErrorValidation(data?.error, data?.response)) {
				throw new Error('An error has occurred on the server');
			}
            setOrders(data.orders ? data.orders : []);
        }).catch(()=> toast.error("An unexpected error has occurred with the server"));
    }

    return [orders, {setOrders, getProviderOrders, isLoading}] as const;
};