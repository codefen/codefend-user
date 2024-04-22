import { useFetcher } from "#commonHooks/useFetcher";
import { useUserData } from "#commonUserHooks/useUserData";
import { QualitySurveyPhase } from "@interfaces/quality-feedback";
import { useQualitySurveyStore } from "@stores/qualitySurvey.store";

export const useFindQualitySurvey =()=>{
    const { getCompany } = useUserData();
    const [fetcher] = useFetcher();
    const {updateIsOpen,updatePhase, updateProvider} = useQualitySurveyStore();

    const searchPoll = ()=>{
         fetcher("post", {
            body: {
                model: "poll/search",
                company_id: getCompany()
            }
         }).then(({data}:any)=>{
            if(data.error != "0") throw new Error();
            
            updatePhase(QualitySurveyPhase.INIT);
            updateIsOpen(true);
            //updateProvider(data.provider)
         });
    }

    return searchPoll;
}