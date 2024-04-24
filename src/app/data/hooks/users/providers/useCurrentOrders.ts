import { useFetcher } from "#commonHooks/useFetcher";
import { useUserData } from "#commonUserHooks/useUserData";
import type { FullOrder } from "@/app/data";
import { useRef, useState } from "react";

export const useCurrentOrders = ()=>{
    const { getCompany } = useUserData();
    const [fetcher,_, isLoading] = useFetcher();
    const [currentOrders, setCurrentOrders] = useState<FullOrder[]>([]);

    const getConfirmOrders = ()=>{
        fetcher("post", {
            body: {
                model: "providers/orders/index/confirmed",
                company_id: getCompany(),
            }
        }).then(({data}:any)=>{
            if(data.error != "0" || data.response == "error") throw new Error();
            setCurrentOrders(data.orders ? data.orders : []);
        })
    }

    return [currentOrders, {setCurrentOrders,getConfirmOrders, isLoading}] as const;
}