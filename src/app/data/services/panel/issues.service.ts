import { fetchPOST, handleFetchError } from '../';

const getAll = async (companyID: string) => {
	const { data } = (await fetchPOST({
		params: {
			model: 'issues/index',
			company_id: companyID,
			resource_address_domain: 'clarin.com',
		},
	}).catch((error: any) => handleFetchError(error))) as any;

	return data;
};

const getOne = async (issueId: string, companyID: string) => {
	const { data } = (await fetchPOST({
		params: {
			model: 'issues/view',
			issue_id: issueId,
			company_id: companyID,
		},
	}).catch((error: any) => handleFetchError(error))) as any;

	return data;
};

const addCSMessage = async (params: any, companyID: string) => {
	const { data } = (await fetchPOST({
		params: {
			model: 'issues/cs',
			ac: 'add',
			company_id: companyID,
			...params,
		},
	}).catch((error: any) => handleFetchError(error))) as any;

	return data;
};

const add = async (params: any, companyID: string) => {
	const { data } = (await fetchPOST({
		params: {
			model: 'issues/add',
			company_id: companyID,
			...params,
		},
	}).catch((error: any) => handleFetchError(error))) as any;

	return data;
};

const modify = async (params: any, companyID: string) => {
	const { data } = (await fetchPOST({
		params: {
			model: 'issues/mod',
			resource_id: 1,
			company_id: companyID,
			resource_address_domain: 'clarin.com',
		},
		body: {
			...params,
		},
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
	}).catch((error: any) => handleFetchError(error))) as any;

	return data;
};

const deleteIssue = async (issueId: string, companyID: string) => {
	const { data } = (await fetchPOST({
		params: {
			model: 'issues/del',
			company_id: companyID,
			id: issueId,
		},
	}).catch((error: any) => handleFetchError(error))) as any;

	return data;
};

export const IssueService = {
	getAll,
	delete: deleteIssue,
	modify,
	add,
	addCSMessage,
	getOne,
};
