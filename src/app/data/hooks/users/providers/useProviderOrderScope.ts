import { useFetcher } from "#commonHooks/useFetcher";
import { useUserData } from "#commonUserHooks/useUserData";
import { apiErrorValidation } from "@/app/constants/validations";
import type { Provider } from "@interfaces/provider";
import { verifySession } from '@/app/constants/validations';
import { useRef } from "react";

export const useProviderOrderScope = ()=>{
    const { getCompany,logout } = useUserData();
    const [fetcher,_, isLoading] = useFetcher();
    const providers = useRef<Provider[]>();
    
    const getProviderOrder = (orderId: string)=>{
        fetcher("post", {
            body: {
                model: "providers/orders/view",
                company_id: getCompany(),
                order_id:orderId
            }
        }).then(({ data }: any) => {
            if(verifySession(data, logout)) return;
            if (data.isAnError || apiErrorValidation(data?.error, data?.response)) {
				throw new Error('An error has occurred on the server');
			}
        });
    };

    return getProviderOrder;
}