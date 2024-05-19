import { useFetcher } from "#commonHooks/useFetcher";
import { useUserData } from "#commonUserHooks/useUserData";
import { apiErrorValidation, companyIdIsNull } from "@/app/constants/validations";
import type { FullOrder } from "@/app/data";
import { useRef, useState } from "react";

export const useCurrentOrders = ()=>{
    const { getCompany } = useUserData();
    const [fetcher,_, isLoading] = useFetcher();
    const [currentOrders, setCurrentOrders] = useState<FullOrder[]>([]);

    const getConfirmOrders = ()=>{
        const companyID = getCompany();
		if (companyIdIsNull(companyID)) return;
        fetcher("post", {
            body: {
                model: "providers/orders/index/confirmed",
                company_id: companyID,
            }
        }).then(({data}:any)=>{
            if (data.isAnError || apiErrorValidation(data?.error, data?.response)) {
                throw new Error('An error has occurred on the server');
             }
            setCurrentOrders(data.orders ? data.orders : []);
        })
    }

    return [currentOrders, {setCurrentOrders,getConfirmOrders, isLoading}] as const;
}