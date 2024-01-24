import { fetchPOST, handleFetchError } from '../';

const getAll = async (companyID: string) => {
	try {
		const { data } = await fetchPOST({
			params: {
				model: 'companies/preferences',
				company_id: companyID,
			},
		});
		return data;
	} catch (error) {
		console.error('Error: ', error);
		return { success: false };
	}
};

export const PreferenceServices = {
	getAll,
};
