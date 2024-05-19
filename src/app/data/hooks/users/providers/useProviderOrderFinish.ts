import { useFetcher } from "#commonHooks/useFetcher";
import { useUserData } from "#commonUserHooks/useUserData";
import { apiErrorValidation, companyIdIsNull } from "@/app/constants/validations";
import { toast } from "react-toastify";

export const useProviderOrderFinish = ()=>{
    const { getCompany } = useUserData();
    const [fetcher] = useFetcher();

    const finishOrder = (orderId:string)=>{
      const companyID = getCompany();
		if (companyIdIsNull(companyID)) return;
        return fetcher("post", {
           body: {
               model: "providers/orders/finish",
               company_id: companyID,
               order_id: orderId,
           }
        }).then(({data}:any)=>{
         if (data.isAnError || apiErrorValidation(data?.error, data?.response)) {
				throw new Error('An error has occurred on the server');
			}
           toast.success("You have finished the order");
        }).catch((err:any)=>{
           toast.error("An unexpected error has occurred, when rejecting the order try again later");
        });
   }
   return finishOrder;
}