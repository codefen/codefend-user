import { useFetcher } from "#commonHooks/useFetcher";
import { useUserData } from "#commonUserHooks/useUserData";
import type { Provider } from "@interfaces/provider";
import { useRef } from "react";

export const useProviderOrderScope = ()=>{
    const { getCompany } = useUserData();
    const [fetcher,_, isLoading] = useFetcher();
    const providers = useRef<Provider[]>();
    
    const getProviderOrder = (orderId: string)=>{
        fetcher("post", {
            body: {
                model: "providers/orders/view",
                company_id: getCompany(),
                order_id:orderId
            }
        }).then(({ data }: any) => {
            
        })
    };

    return getProviderOrder;
}