import { useFetcher } from "#commonHooks/useFetcher";
import { apiErrorValidation } from "@/app/constants/validations";

export const usePasswordRecovery = ()=>{
    const [fetcher,_, isLoading] = useFetcher(true);
    
    const sendEmailForRecovery = (email: string)=>{
        return fetcher("post", {
            body: {
                model: "users/password/recover",
                provided_email: email
            }
        }).then(({data}:any)=>{
            return data;
        })
    }
    const passwordRecover = (email: string, referenceNumber: string, newPassowrd: string)=>{
        return fetcher("post", {
            body: {
                model: "users/password/recover/hash",
                provided_email: email,
                password_recover_hash: referenceNumber,
                new_password: newPassowrd
            }
        }).then(({data}:any)=>{
            if (data.isAnError || apiErrorValidation(data?.error, data?.response)) {
				throw new Error('An error has occurred on the server');
			}
            return data;
        })
    }

    return {
        sendEmailForRecovery,
        passwordRecover,
        isLoading
    }
}