import { useFetcher } from "#commonHooks/useFetcher";
import { useUserData } from "#commonUserHooks/useUserData";
import { QualitySurveyPhase } from "@interfaces/quality-feedback";
import { useQualitySurveyStore } from "@stores/qualitySurvey.store";

export const useQualitySurveyStart =()=>{
    const { getCompany } = useUserData();
    const [fetcher] = useFetcher();
    const {updateProvider} = useQualitySurveyStore();

    const startPoll = (orderId: string, referenceNumber:string)=>{
         fetcher("post", {
            body: {
                model: "orders/review",
                phase: "start",
                company_id: getCompany(),
                order_id: orderId,
                reference_number: referenceNumber,
            }
         }).then(({data}:any)=>{
            if(data.error != "0") throw new Error();
         });
    }

    return startPoll;
}