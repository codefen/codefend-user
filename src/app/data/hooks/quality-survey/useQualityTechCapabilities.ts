import { useFetcher } from "#commonHooks/useFetcher";
import { useUserData } from "#commonUserHooks/useUserData";
import { useQualitySurveyStore } from "@stores/qualitySurvey.store";

export const useQualityTechCapabilities =()=>{
    const { getCompany } = useUserData();
    const [fetcher] = useFetcher();
    const {orderId,referenceNumber} = useQualitySurveyStore();

    const sendIssueRelevance = ( pollVal: string )=>{
         fetcher("post", {
            body: {
                model: "orders/review",
                phase: "issues_relevance",
                company_id: getCompany(),
                order_id: orderId,
                reference_number: referenceNumber,
                issues_relevance: pollVal
            }
         }).then(({data}:any)=>{
            if(data.error != "0") throw new Error();
         });
    }

    return sendIssueRelevance;
}