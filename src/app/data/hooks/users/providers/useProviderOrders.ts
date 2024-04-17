import { useAuthState } from "#commonHooks/useAuthState";
import { useFetcher } from "#commonHooks/useFetcher";
import type { FullOrder } from "@interfaces/order";
import { useRef } from "react";
import { toast } from "react-toastify";

export const useProviderOrders = ()=>{
    const { getCompany } = useAuthState();
    const [fetcher,_, isLoading] = useFetcher();
    const orders = useRef<FullOrder[]>([]);

    const getProviderOrders =  ()=>{
        fetcher("post", {
            body: {
                model: "providers/orders",
                company_id: getCompany()
            }
        }).then(({data}:any)=>{
            if(data.error != "0") throw new Error();
            orders.current = data.orders ? data.orders : [];
        }).catch(()=> toast.error("An unexpected error has occurred with the server"));
    }

    return [orders, {getProviderOrders, isLoading}] as const;
};