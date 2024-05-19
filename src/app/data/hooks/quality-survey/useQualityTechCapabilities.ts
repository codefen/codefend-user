import { useFetcher } from "#commonHooks/useFetcher";
import { useUserData } from "#commonUserHooks/useUserData";
import { apiErrorValidation, companyIdIsNull } from "@/app/constants/validations";
import { useQualitySurveyStore } from "@stores/qualitySurvey.store";

export const useQualityTechCapabilities =()=>{
    const { getCompany } = useUserData();
    const [fetcher] = useFetcher();
    const {orderId,referenceNumber} = useQualitySurveyStore();

    const sendIssueRelevance = ( pollVal: string )=>{
        const companyID = getCompany();
		if (companyIdIsNull(companyID) || !pollVal) return;
         fetcher("post", {
            body: {
                model: "orders/review",
                phase: "issues_relevance",
                company_id: companyID,
                order_id: orderId,
                reference_number: referenceNumber,
                issues_relevance: pollVal
            }
         }).then(({data}:any)=>{
            if (data.isAnError || apiErrorValidation(data?.error, data?.response)) {
				throw new Error('An error has occurred on the server');
			}
         });
    }

    return sendIssueRelevance;
}