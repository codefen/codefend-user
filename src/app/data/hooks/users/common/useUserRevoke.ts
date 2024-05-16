import { useFetcher } from "#commonHooks/useFetcher";
import { apiErrorValidation, companyIdIsNotNull } from "@/app/constants/validations";
import { useUserData } from "./useUserData";
import { toast } from "react-toastify";


export const useUserRevoke = ()=>{
    const { getCompany } = useUserData();
    const [fetcher,_, isLoading] = useFetcher();

    const revokeAccessUser = (userID: string)=>{
        const companyID = getCompany();
		if (companyIdIsNotNull(companyID)) return Promise.reject(false);
        
        return fetcher<any>("post", {
            body: {
                model: "users/revoke",
                company_id: companyID,
                revoke_id: userID
            }
        }).then(({data}:any)=>{
            if (data.isAnError || apiErrorValidation(data?.error, data?.response)) {
                throw new Error('An error has occurred on the server');
             }
             toast.success("Access has been successfully revoked");
        });
    }

    return {revokeAccessUser, isLoading};
}