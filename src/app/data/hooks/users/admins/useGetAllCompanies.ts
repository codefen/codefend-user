import { useCallback, useEffect, useState } from 'react';
import { type CompanyInfo} from '@interfaces/panel.ts';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useUserData } from '#commonUserHooks/useUserData';
import { apiErrorValidation, companyIdIsNotNull } from '@/app/constants/validations';
import { verifySession } from '@utils/helper';

const useGetAllCompanies = () => {
	const [fetcher, _, isLoading] = useFetcher();
	const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
	const { getCompany,logout } = 	useUserData();


	const fetchCompanyInfo = useCallback(() => {
		const companyID = getCompany();
		if (companyIdIsNotNull(companyID)) return;
		fetcher("post", {
			body: {
				model: "companies/dashboard",
				company_id: companyID
			}
		}).then(({ data }: any) => {
			if(verifySession(data, logout)) return;
			if (data.isAnError || apiErrorValidation(data?.error, data?.response)) {
				throw new Error('An error has occurred on the server');
			}
			setCompanyInfo(data);
		});
	}, []);

	useEffect(() => {
		fetchCompanyInfo();
	}, []);

	return { companyInfo, loading: isLoading };
};

export default useGetAllCompanies;