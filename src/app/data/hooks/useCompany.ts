import { useCallback, useEffect, useState } from 'react';
import { CompanyInfo, User, companyServices, useAuthState } from '..';

const useCompany = () => {
	const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
	const [loading, setLoading] = useState(true);
	const { getUserdata } = useAuthState();

	const fetchCompanyInfo = useCallback(() => {
		const user = getUserdata() as User;
		const companyID = user?.companyID;
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