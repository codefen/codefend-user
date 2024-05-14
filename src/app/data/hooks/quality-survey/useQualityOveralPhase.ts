import { useFetcher } from "#commonHooks/useFetcher";
import { useUserData } from "#commonUserHooks/useUserData";
import { apiErrorValidation, companyIdIsNotNull } from "@/app/constants/validations";
import { useQualitySurveyStore } from "@stores/qualitySurvey.store";

export const useQualityOveralPhase =()=>{
    const { getCompany } = useUserData();
    const [fetcher] = useFetcher();
    const {orderId,referenceNumber} = useQualitySurveyStore();

    const sendOverallPhase = ( pollVal: string )=>{
        const companyID = getCompany();
		if (companyIdIsNotNull(companyID) || !pollVal) return;
         fetcher("post", {
            body: {
                model: "orders/review",
                phase: "overall_score",
                company_id: companyID,
                order_id: orderId,
                reference_number: referenceNumber,
                overall_score: pollVal
            }
         }).then(({data}:any)=>{
            if (data.isAnError || apiErrorValidation(data?.error, data?.response)) {
				throw new Error('An error has occurred on the server');
			}
         });
    }

    return sendOverallPhase;
}