import { useAuthState } from "#commonHooks/useAuthState";
import { useFetcher } from "#commonHooks/useFetcher";

import { toast } from "react-toastify";

export const useProviderConfirm =()=>{
    const { getCompany } = useAuthState();
    const [fetcher,_, isLoading] = useFetcher();

    const confirmOrder = (orderId: string)=>{
         fetcher("post", {
            body: {
                model: "providers/orders/confirm",
                company_id: getCompany(),
                order_id: orderId
            },
            requestId: "confirmOrder"
         }).then(({data}:any)=>{
            if(data.error != "0") throw new Error();
            toast.success("You have accepted the order correctly");
         }).catch((err:any)=>{
            toast.error("The order could not be accepted correctly");
         })
    }

    return {confirmOrder, isLoading};
}