import { useFetcher } from "#commonHooks/useFetcher";
import { useUserData } from "#commonUserHooks/useUserData";
import type { FullOrder } from "@/app/data";
import { useRef } from "react";

export const useCurrentOrders = ()=>{
    const { getCompany } = useUserData();
    const [fetcher,_, isLoading] = useFetcher();
    const currentOrders = useRef<FullOrder[]>([]);

    const getConfirmOrders = ()=>{
        fetcher("post", {
            body: {
                model: "providers/orders/index/confirmed",
                company_id: getCompany(),
            }
        }).then(({data}:any)=>{
            if(data.error != "0") throw new Error();
            currentOrders.current = data.orders ? data.orders : [];
        })
    }

    return [currentOrders, {getConfirmOrders, isLoading}] as const;
}