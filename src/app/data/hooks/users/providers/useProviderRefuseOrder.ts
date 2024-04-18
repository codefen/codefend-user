import { useAuthState } from "#commonHooks/useAuthState";
import { useFetcher } from "#commonHooks/useFetcher";
import { useProviderRefuseStore } from "@stores/providerOrder.store";
import { useRef, useState } from "react";
import { toast } from "react-toastify";

export const useProviderRefuseOrder = ()=>{
    const { getCompany } = useAuthState();
    const [fetcher,cancelRequest,_] = useFetcher();
    const { isRefusing } = useProviderRefuseStore();

    const refuseOrder = (selectedReason: string, reason: string,orderId:string)=>{
        return fetcher("post", {
           body: {
               model: "providers/orders/cancel",
               company_id: getCompany(),
               order_id: orderId,
               canceled_reason: selectedReason,
               canceled_reason_desc: reason
           },
           requestId: "refuseOrder"
        }).then(({data}:any)=>{
           console.log({data});
           toast.success("You have rejected the order");
        }).catch((err:any)=>{
           toast.error("An unexpected error has occurred, when rejecting the order try again later");
        });
   }
   const cancelConfirm = ()=>cancelRequest("confirmRequest");
   return {
       refuseOrder,
       cancelConfirm,
       isRefusing
   }
}