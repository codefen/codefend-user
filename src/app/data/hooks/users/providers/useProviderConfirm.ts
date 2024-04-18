import { useAuthState } from "#commonHooks/useAuthState";
import { useFetcher } from "#commonHooks/useFetcher";
import { useRef, useState } from "react";
import { toast } from "react-toastify";

export const useProviderConfirm =()=>{
    const { getCompany } = useAuthState();
    const [fetcher,cancelRequest, isLoading] = useFetcher();
    const [requestId, setRequestId] = useState("");

    const confirmOrder = (orderId: string)=>{
      cancelRequest("refuseOrder");
      setRequestId("confirmOrder");
         fetcher("post", {
            body: {
                model: "providers/orders/confirm",
                company_id: getCompany(),
                order_id: orderId
            },
            requestId: "confirmOrder"
         }).then(({data}:any)=>{
            console.log({data});
            toast.success("You have accepted the order correctly");
         }).catch((err:any)=>{
            toast.error("The order could not be accepted correctly");
         })
    }
    const refuseOrder = (orderId: string)=>{
      cancelRequest("confirmOrder");
      setRequestId("refuseOrder");
      fetcher("post", {
         body: {
             model: "providers/orders/cancel",
             company_id: getCompany(),
             order_id: orderId
         },
         requestId: "refuseOrder"
      }).then(({data}:any)=>{
         console.log({data});
         toast.success("You have rejected the order");
      }).catch((err:any)=>{
         toast.error("An unexpected error has occurred, when rejecting the order try again later");
      })
 }

    return {confirmOrder, refuseOrder, isLoading, requestId};
}