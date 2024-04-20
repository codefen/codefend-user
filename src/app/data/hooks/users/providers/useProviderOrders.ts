import { useFetcher } from "#commonHooks/useFetcher";
import { useUserData } from "#commonUserHooks/useUserData";
import type { FullOrder } from "@interfaces/order";
import { useRef } from "react";
import { toast } from "react-toastify";

export const useProviderOrders = ()=>{
    const { getCompany } = useUserData();
    const [fetcher,_, isLoading] = useFetcher();
    const orders = useRef<FullOrder[]>([]);

    const getProviderOrders =  ()=>{
        fetcher("post", {
            body: {
                model: "providers/orders/index/unconfirmed",
                company_id: getCompany()
            }
        }).then(({data}:any)=>{
            if(data.error != "0") throw new Error();
            orders.current = data.orders ? data.orders : [];
        }).catch(()=> toast.error("An unexpected error has occurred with the server"));
    }

    return [orders, {getProviderOrders, isLoading}] as const;
};