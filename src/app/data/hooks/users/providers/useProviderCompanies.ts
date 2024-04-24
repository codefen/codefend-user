import { useFetcher } from "#commonHooks/useFetcher";
import { useUserData } from "#commonUserHooks/useUserData";
import useAdminCompanyStore from "@stores/adminCompany.store";

export const useProviderCompanies = ()=>{
    const { getUserdata } = useUserData();
    const [fetcher,_, isLoading] = useFetcher();
    const {updateCompanies} = useAdminCompanyStore();
    
    const getProviderCompanyAccess = ()=>{
        
        fetcher("post", {
            body: {
                model: "providers/companies/access",
                company_id: getUserdata().company_id,
            }
        }).then(({ data }: any)=>{
            if(data.error != "0" || data.response == "error") throw new Error();
            
            if(data.accessible_companies && data.accessible_companies.length > 0){
                const companies = data.accessible_companies.filter((comapny:any) => comapny!== null);
                updateCompanies(companies ? companies : []);
            }
        });
    }

    return {getProviderCompanyAccess, isLoading};
}