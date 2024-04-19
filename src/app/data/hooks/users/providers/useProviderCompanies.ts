import { useAuthState } from "#commonHooks/useAuthState";
import { useFetcher } from "#commonHooks/useFetcher";
import useAdminCompanyStore from "@stores/adminCompany.store";

export const useProviderCompanies = ()=>{
    const { getCompany } = useAuthState();
    const [fetcher,_, isLoading] = useFetcher();
    const {updateCompanies} = useAdminCompanyStore();
    
    const getProviderCompanyAccess = ()=>{
        fetcher("post", {
            body: {
                model: "providers/companies/access",
                company_id: getCompany(),
            }
        }).then(({ data }: any)=>{
            if(data.error != "0") throw new Error();
            
            if(data.accessible_companies && data.accessible_companies.length > 0){
                const companies = data.accessible_companies.filter((comapny:any) => comapny!== null);
                updateCompanies(companies ? companies : []);
            }
        });
    }

    return {getProviderCompanyAccess, isLoading};
}