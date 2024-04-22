import { useFetcher } from "#commonHooks/useFetcher";
import { useUserData } from "#commonUserHooks/useUserData";
import { useQualitySurveyStore } from "@stores/qualitySurvey.store";

export const useQualityReporting =()=>{
    const { getCompany } = useUserData();
    const [fetcher] = useFetcher();
    const {orderId,referenceNumber} = useQualitySurveyStore();

    const sendReporting = ( pollVal: string )=>{
         fetcher("post", {
            body: {
                model: "orders/review",
                phase: "inform_clearness",
                company_id: getCompany(),
                order_id: orderId,
                reference_number: referenceNumber,
                inform_clearness: pollVal
            }
         }).then(({data}:any)=>{
            if(data.error != "0") throw new Error();
         });
    }

    return sendReporting;
}