import { useFetcher } from "#commonHooks/useFetcher";
import { useUserData } from "#commonUserHooks/useUserData";
import { useRef } from "react";

export const useForwardOrder = ()=>{
    const { getCompany } = useUserData();
    const [fetcher,_, isLoading] = useFetcher();
    
    const forwardOrder = (order_id: any)=>{
        return fetcher("post", {
            body: {
                model: "providers/orders/forward",
                company_id: getCompany(),
                order_id
            }
        }).then(({ data }: any) => {
            if(data.error != "0" || data.response == "error") throw new Error();
            return {res: true, providers: data.providers};
        }).catch(()=>{
            return {res: false, providers: []};
        })
    };

    return [forwardOrder, isLoading] as const;
}