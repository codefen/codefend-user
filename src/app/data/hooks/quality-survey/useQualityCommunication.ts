import { useFetcher } from "#commonHooks/useFetcher";
import { useUserData } from "#commonUserHooks/useUserData";
import { useQualitySurveyStore } from "@stores/qualitySurvey.store";

export const useQualityCommunication =()=>{
    const { getCompany } = useUserData();
    const [fetcher] = useFetcher();
    const {orderId,referenceNumber} = useQualitySurveyStore();

    const sendCommunication = ( pollVal: string )=>{
         fetcher("post", {
            body: {
                model: "orders/review",
                phase: "process_speed",
                company_id: getCompany(),
                order_id: orderId,
                reference_number: referenceNumber,
                process_speed: pollVal
            }
         }).then(({data}:any)=>{
            if(data.error != "0") throw new Error();
         });
    }

    return sendCommunication;
}