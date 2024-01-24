import { fetchPOST, handleFetchError } from '../';

const initializeVdbData = async (keyword: string, companyID: string) => {
	const { data } = (await fetchPOST({
		params: {
			model: 'offensive/vdb',
			ac: 'search',
			company_id: companyID,
			keyword,
		},
	}).catch((error: any) => handleFetchError(error))) as any;

	return data;
};

export const VdbService = {
	initializeVdbData,
};
