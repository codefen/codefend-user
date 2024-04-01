import { useFetcher } from "#commonHooks/useFetcher";
import { toast } from "react-toastify";

export const useGetCompany = () => {
	const [fetcher, _, isLoading] = useFetcher();

	const fetchCompanyInfo = (companyID: string) => {
		return fetcher("post", {
			body: {
				model: "companies/index",
				company_id: companyID
			}
		});
	}

    const getCompany = (companyID: string) => {
		if (!companyID) {
			toast.error('User information was not found');
			return Promise.resolve(false);
		}
		return fetchCompanyInfo(companyID);
	};


	return { getCompany, loading: isLoading };
};
