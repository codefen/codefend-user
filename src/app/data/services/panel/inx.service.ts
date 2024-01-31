import { fetchPOST, handleFetchError } from '../';
const getPreviousSearches = async (companyID: string) => {
	const { data } = (await fetchPOST({
		params: {
			model: 'offensive/inx',
			ac: 'view_previous',
			company_id: companyID,
		},
	}).catch((error: any) => handleFetchError(error))) as any;

	return data;
};

const initializeSearch = async (term: string, companyID: string) => {
	const { data } = (await fetchPOST({
		params: {
			model: 'offensive/inx',
			ac: 'init_search',
			term: term,
			company_id: companyID,
		},
	}).catch((error: any) => handleFetchError(error))) as any;

	return data;
};

const search = async (params: any, companyID: string) => {
	try {
		const { data } = await fetchPOST({
			params: {
				model: 'offensive/inx',
				ac: 'search',
				company_id: companyID,
				...params,
			},
	})
			return data
	} catch (error) {
		 handleFetchError(error) as any;
	}
};

const preview = async (params: any, companyID: string) => {
	const { data } = (await fetchPOST({
		params: {
			model: 'offensive/inx',
			ac: 'preview',
			company_id: companyID,
			...params,
		},
	}).catch((error: any) => handleFetchError(error))) as any;

	return data;
};

const read = async (params: any, companyID: string) => {
	const { data } = (await fetchPOST({
		params: {
			model: 'offensive/inx',
			ac: 'read',
			company_id: companyID,
			...params,
		},
	}).catch((error: any) => handleFetchError(error))) as any;

	return data;
};

export const InxServices = {
	getPreviousSearches,
	initializeSearch,
	search,
	preview,
	read,
};
