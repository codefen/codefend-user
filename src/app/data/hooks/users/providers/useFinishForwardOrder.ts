import { useFetcher } from "#commonHooks/useFetcher";
import { useUserData } from "#commonUserHooks/useUserData";
import { useRef, useState } from "react";

export const useFinishForwardOrder = ()=>{
    const { getCompany } = useUserData();
    const [fetcher,_, isLoading] = useFetcher();
    const [transferProvider, setTransfer] = useState<string>('');
    
    const finishForwardOrder = (order_id: any)=>{
        return fetcher("post", {
            body: {
                model: "providers/orders/forward",
                company_id: getCompany(),
                chosen_provider_id: transferProvider,
                order_id
            }
        }).then(({ data }: any) => {
            if(data.error != "0" || data.response == "error") throw new Error();
            return true;
        }).catch(()=>{
            return false;
        })
    };

    return [transferProvider,isLoading, {finishForwardOrder,setTransfer}] as const;
}