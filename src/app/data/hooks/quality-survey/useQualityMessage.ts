import { useFetcher } from "#commonHooks/useFetcher";
import { useUserData } from "#commonUserHooks/useUserData";
import { useQualitySurveyStore } from "@stores/qualitySurvey.store";

export const useQualityMessage =()=>{
    const { getCompany } = useUserData();
    const [fetcher] = useFetcher();
    const {orderId,referenceNumber} = useQualitySurveyStore();

    const sendMessage = ( message: string )=>{
         fetcher("post", {
            body: {
                model: "orders/review",
                phase: "provider_review",
                company_id: getCompany(),
                order_id: orderId,
                reference_number: referenceNumber,
                provider_review: message
            }
         }).then(({data}:any)=>{
            if(data.error != "0") throw new Error();
         });
    }

    return sendMessage;
}