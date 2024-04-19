import { useAuthState } from "#commonHooks/useAuthState";
import { useFetcher } from "#commonHooks/useFetcher";
import type { Provider } from "@interfaces/provider";
import { useRef } from "react";

export const useProviderOrderScope = ()=>{
    const { getCompany } = useAuthState();
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