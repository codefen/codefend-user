import { useCallback, useEffect, useState } from 'react';
import { type CompanyInfo, companyServices, useAuthState } from '..';

const useCompany = () => {
	const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
	const [loading, setLoading] = useState(true);
	const { getCompany, getUserdata } = useAuthState();

	const fetchCompanyInfo = useCallback(() => {
		const companyID = getCompany();
		setLoading(true);

		companyServices.getAll(companyID).then((response: any) => {
			setCompanyInfo(response);
		});
	}, []);

	useEffect(() => {
		fetchCompanyInfo();
	}, [fetchCompanyInfo]);

	return { companyInfo, loading };
};

export default useCompany;