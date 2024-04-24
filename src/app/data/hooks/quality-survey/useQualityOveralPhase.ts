import { useFetcher } from "#commonHooks/useFetcher";
import { useUserData } from "#commonUserHooks/useUserData";
import { useQualitySurveyStore } from "@stores/qualitySurvey.store";

export const useQualityOveralPhase =()=>{
    const { getCompany } = useUserData();
    const [fetcher] = useFetcher();
    const {orderId,referenceNumber} = useQualitySurveyStore();

    const sendOverallPhase = ( pollVal: string )=>{
         fetcher("post", {
            body: {
                model: "orders/review",
                phase: "overall_score",
                company_id: getCompany(),
                order_id: orderId,
                reference_number: referenceNumber,
                overall_score: pollVal
            }
         }).then(({data}:any)=>{
            if(data.error != "0" || data.response == "error") throw new Error();
         });
    }

    return sendOverallPhase;
}