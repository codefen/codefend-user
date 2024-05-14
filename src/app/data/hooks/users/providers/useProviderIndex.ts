import { useFetcher } from "#commonHooks/useFetcher";
import { useUserData } from "#commonUserHooks/useUserData";
import { apiErrorValidation, companyIdIsNotNull } from "@/app/constants/validations";
import type { Provider } from "@interfaces/provider";
import { useRef } from "react";
import { toast } from "react-toastify";

export const useProviderIndex = ()=>{
    const { getCompany } = useUserData();
    const [fetcher,_, isLoading] = useFetcher();
    const providers = useRef<Provider[]>();

    const getProviders = ()=>{
        const companyID = getCompany();
		if (companyIdIsNotNull(companyID)) return;

        fetcher<any>('post', {
			body: {
				company_id: companyID,
				model: 'providers/profiles/index',
			}
		}).then(({ data }: any)=>{
            if (data.isAnError || apiErrorValidation(data?.error, data?.response)) {
				throw new Error('An error has occurred on the server');
			}
            providers.current = data?.providers ? data.providers : [];
        })
    }

    return [getProviders, {providers, isLoading}] as const; 
}