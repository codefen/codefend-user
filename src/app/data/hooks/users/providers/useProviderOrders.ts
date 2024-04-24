import { useFetcher } from "#commonHooks/useFetcher";
import { useUserData } from "#commonUserHooks/useUserData";
import type { FullOrder } from "@interfaces/order";
import { useRef, useState } from "react";
import { toast } from "react-toastify";

export const useProviderOrders = ()=>{
    const { getCompany } = useUserData();
    const [fetcher,_, isLoading] = useFetcher();
    const [orders, setOrders] = useState<FullOrder[]>([]);

    const getProviderOrders =  ()=>{
        fetcher("post", {
            body: {
                model: "providers/orders/index/unconfirmed",
                company_id: getCompany()
            }
        }).then(({data}:any)=>{
            if(data.error != "0" || data.response == "error") throw new Error();
            setOrders(data.orders ? data.orders : []);
        }).catch(()=> toast.error("An unexpected error has occurred with the server"));
    }

    return [orders, {setOrders, getProviderOrders, isLoading}] as const;
};