import { useFetcher } from "#commonHooks/useFetcher";
import { useUserData } from "#commonUserHooks/useUserData";
import { QualitySurveyPhase } from "@interfaces/quality-feedback";
import { useQualitySurveyStore } from "@stores/qualitySurvey.store";

export const useQualityOveralPhase =()=>{
    const { getCompany } = useUserData();
    const [fetcher] = useFetcher();
    const {} = useQualitySurveyStore();

    const sendOverallPhase = (referenceNumber:string, overallVal: string)=>{
         fetcher("post", {
            body: {
                model: "poll/index",
                phase: "overall",
                company_id: getCompany(),
                over_val: overallVal
            }
         }).then(({data}:any)=>{
            if(data.error != "0") throw new Error();
         });
    }

    return sendOverallPhase;
}