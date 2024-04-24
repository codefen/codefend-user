import { useFetcher } from "#commonHooks/useFetcher";
import { useUserData } from "#commonUserHooks/useUserData";
import { useQualitySurveyStore } from "@stores/qualitySurvey.store";

export const useQualityFinding =()=>{
    const { getCompany } = useUserData();
    const [fetcher] = useFetcher();
    const {orderId,referenceNumber} = useQualitySurveyStore();

    const sendFinding = ( pollVal: string )=>{
         fetcher("post", {
            body: {
                model: "orders/review",
                phase: "issues_volume",
                company_id: getCompany(),
                order_id: orderId,
                reference_number: referenceNumber,
                issues_volume: pollVal
            }
         }).then(({data}:any)=>{
            if(data.error != "0" || data.response == "error") throw new Error();
         });
    }

    return sendFinding;
}