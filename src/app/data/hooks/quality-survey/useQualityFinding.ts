import { useFetcher } from "#commonHooks/useFetcher";
import { useUserData } from "#commonUserHooks/useUserData";
import { apiErrorValidation, companyIdIsNotNull } from "@/app/constants/validations";
import { useQualitySurveyStore } from "@stores/qualitySurvey.store";

export const useQualityFinding =()=>{
    const { getCompany } = useUserData();
    const [fetcher] = useFetcher();
    const {orderId,referenceNumber} = useQualitySurveyStore();

    const sendFinding = ( pollVal: string )=>{
        const companyID = getCompany();
		if (companyIdIsNotNull(companyID) || !pollVal) return;
         fetcher("post", {
            body: {
                model: "orders/review",
                phase: "issues_volume",
                company_id: companyID,
                order_id: orderId,
                reference_number: referenceNumber,
                issues_volume: pollVal
            }
         }).then(({data}:any)=>{
            if (data.isAnError || apiErrorValidation(data?.error, data?.response)) {
				throw new Error('An error has occurred on the server');
			}
         });
    }

    return sendFinding;
}