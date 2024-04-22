import { useFetcher } from "#commonHooks/useFetcher";
import { useUserData } from "#commonUserHooks/useUserData";
import { useQualitySurveyStore } from "@stores/qualitySurvey.store";

export const useQualityTechSupport =()=>{
    const { getCompany } = useUserData();
    const [fetcher] = useFetcher();
    const {orderId,referenceNumber} = useQualitySurveyStore();

    const sendTechSupport = ( pollVal: string )=>{
         fetcher("post", {
            body: {
                model: "orders/review",
                phase: "cs_provided",
                company_id: getCompany(),
                order_id: orderId,
                reference_number: referenceNumber,
                cs_provided: pollVal
            }
         }).then(({data}:any)=>{
            if(data.error != "0") throw new Error();
         });
    }

    return sendTechSupport;
}