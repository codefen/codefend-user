import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useUserData } from '#commonUserHooks/useUserData';
import useResellerHeaderStore from '@stores/resellerHeader.store';
import { apiErrorValidation, companyIdIsNotNull } from '@/app/constants/validations';

export const useResellerDashboardHeader = ()=>{
    const [fetcher, _, isLoading] = useFetcher();
    const { getCompany } = useUserData();
    const {company,reseller_header,setCompany,setResellerHeader} = useResellerHeaderStore()

    const getResellerHeader =  ()=>{
        const companyID = getCompany();
		if (companyIdIsNotNull(companyID)) return;
        fetcher("post", {
            body: {
                model: "resellers/dashboard/header",
                company_id: getCompany(),
            }
        }).then(({data}: any)=>{
            if (apiErrorValidation(data?.error, data?.response)) {
				throw new Error('An error has occurred on the server');
			}
            setResellerHeader(data.reseller_header);
            setCompany(data.company);
        });
    }

    return [reseller_header,company, {getResellerHeader, isLoading}] as const;
}