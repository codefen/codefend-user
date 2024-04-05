import { useAuthState } from "#commonHooks/useAuthState";
import { useFetcher } from "#commonHooks/useFetcher";
import type { Provider } from "@interfaces/provider";
import { useRef } from "react";
import { toast } from "react-toastify";

export const useProviderIndex = ()=>{
    const { getCompany } = useAuthState();
    const [fetcher,_, isLoading] = useFetcher();
    const providers = useRef<Provider[]>();

    const getProviders = ()=>{
        const companyID = getCompany();

		if (!companyID) {
			toast.error('User information was not found');
			return;
		}

        fetcher<any>('post', {
			body: {
				company_id: companyID,
				model: 'providers/profiles/index',
			},
            insecure: true
		}).then(({ data }: any)=>{
            providers.current = data?.providers ? data.providers : [];
        })
    }

    return [getProviders, {providers, isLoading}] as const; 
}