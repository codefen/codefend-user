import { useCallback, useEffect, useState } from 'react';
import { type CompanyInfo, useAuthState } from '../../..';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { toast } from 'react-toastify';

const useGetAllCompanies = () => {
	const [fetcher, _, isLoading] = useFetcher();
	const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
	const { getCompany } = useAuthState();

	const fetchCompanyInfo = useCallback(() => {
		const companyID = getCompany();
		if (!companyID) {
			toast.error('User information was not found');
			return;
		}
		fetcher("post", {
			body: {
				model: "companies/dashboard",
				company_id: companyID
			}
		}).then(({ data }: any) => {
			setCompanyInfo(data);
		});
	}, []);

	useEffect(() => {
		fetchCompanyInfo();
	}, []);

	return { companyInfo, loading: isLoading };
};

export default useGetAllCompanies;