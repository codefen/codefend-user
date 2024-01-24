import { fetchPOST, handleFetchError } from '../';

const getAll = async (companyID: string) => {
	const { data } = (await fetchPOST({
		params: {
			model: 'resources/source',
			ac: 'view_all',
			company_id: companyID,
		},
	}).catch((error: any) => handleFetchError(error))) as any;

	return data;
};

const deleteSource = async (sourceId: String, companyID: string) => {
	const { data } = (await fetchPOST({
		params: {
			model: 'resources/source',
			ac: 'del',
			id: sourceId,
			company_id: companyID,
		},
	}).catch((error: any) => handleFetchError(error))) as any;

	return data;
};

const add = async (params: any, companyID: string) => {
	const { data } = (await fetchPOST({
		params: {
			model: 'resources/source',
			ac: 'add',
			company_id: companyID,
			...params,
		},
	}).catch((error: any) => handleFetchError(error))) as any;

	return data;
};

const modify = async (sourceId: string, companyID: string) => {
	const { data } = (await fetchPOST({
		params: {
			model: 'resources/source',
			ac: 'mod',
			id: sourceId,
			company_id: companyID,
		},
	}).catch((error: any) => handleFetchError(error))) as any;

	return data;
};

export const SourceCodeService = {
	getAll,
	delete: deleteSource,
	add,
	modify,
};
