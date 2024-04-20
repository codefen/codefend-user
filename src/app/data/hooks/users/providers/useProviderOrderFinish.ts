import { useFetcher } from "#commonHooks/useFetcher";
import { useUserData } from "#commonUserHooks/useUserData";
import { toast } from "react-toastify";

export const useProviderOrderFinish = ()=>{
    const { getCompany } = useUserData();
    const [fetcher] = useFetcher();

    const finishOrder = (orderId:string)=>{
      const companyID = getCompany();
		if (!companyID) {
			toast.error('User information was not found');
			return;
		}
        return fetcher("post", {
           body: {
               model: "providers/orders/finish",
               company_id: getCompany(),
               order_id: orderId,
           }
        }).then(({data}:any)=>{
           toast.success("You have finished the order");
        }).catch((err:any)=>{
           toast.error("An unexpected error has occurred, when rejecting the order try again later");
        });
   }
   return finishOrder;
}