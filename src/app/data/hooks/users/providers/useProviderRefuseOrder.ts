import { useFetcher } from "#commonHooks/useFetcher";
import { useUserData } from "#commonUserHooks/useUserData";
import { useProviderRefuseStore } from "@stores/providerOrder.store";
import { toast } from "react-toastify";

export const useProviderRefuseOrder = ()=>{
    const { getCompany } = useUserData();
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