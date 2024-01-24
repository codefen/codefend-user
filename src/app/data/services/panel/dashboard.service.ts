import { fetchPOST, handleFetchError } from '../';

const getCompanyInfo = async (companyId: string | number) => {
	const { data } = (await fetchPOST({
		params: {
			model: 'companies/dashboard',
			company_id: companyId,
		},
	}).catch((error: any) => handleFetchError(error))) as any;

	return data;
};

export const DashboardService = {
	getCompanyInfo,
};
