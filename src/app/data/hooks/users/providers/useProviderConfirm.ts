import { useFetcher } from "#commonHooks/useFetcher";
import { useUserData } from "#commonUserHooks/useUserData";
import { apiErrorValidation, companyIdIsNull } from "@/app/constants/validations";

import { toast } from "react-toastify";

export const useProviderConfirm =()=>{
    const { getCompany } = useUserData();
    const [fetcher,_, isLoading] = useFetcher();

    const confirmOrder = (orderId: string)=>{
      const companyID = getCompany();
		if (companyIdIsNull(companyID)) return;
         fetcher("post", {
            body: {
                model: "providers/orders/confirm",
                company_id: companyID,
                order_id: orderId
            },
            requestId: "confirmOrder"
         }).then(({data}:any)=>{
            if (data.isAnError || apiErrorValidation(data?.error, data?.response)) {
               throw new Error('An error has occurred on the server');
            }
            toast.success("You have accepted the order correctly");
         }).catch((err:any)=>{
            toast.error("The order could not be accepted correctly");
         })
    }

    return {confirmOrder, isLoading};
}