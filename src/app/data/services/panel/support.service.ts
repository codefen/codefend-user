import { fetchPOST, handleFetchError } from '../';

const getAll = async (companyID: string) => {
	const { data } = (await fetchPOST({
		params: {
			model: 'cs/index',
			ac: 'view_all',
			company_id: companyID,
		},
	}).catch((error: any) => handleFetchError(error))) as any;

	return data;
};

const getOne = async (ticketId: string, companyID: string) => {
	const { data } = (await fetchPOST({
		params: {
			model: 'cs/index',
			ac: 'view_one',
			company_id: companyID,
			id: ticketId,
		},
	}).catch((error: any) => handleFetchError(error))) as any;

	return data;
};

const add = async (params: any, userID: string, companyID: string) => {
	const { data } = (await fetchPOST({
		params: {
			model: 'cs/index',
			ac: 'add',
			user_id: userID,
			company_id: companyID,
			...params,
		},
	}).catch((error: any) => handleFetchError(error))) as any;

	return data;
};

const modify = async (params: any, userID: string, companyID: string) => {
	const { data } = (await fetchPOST({
		params: {
			model: 'cs/index',
			ac: 'mod',
			dad_id: '',
			id: '',
			user_id: userID,
			company_id: companyID,
			...params,
		},
	}).catch((error: any) => handleFetchError(error))) as any;

	return data;
};

const deleteTicket = async (ticketID: string, companyID: string) => {
	const { data } = (await fetchPOST({
		params: {
			model: 'cs/index',
			ac: 'del',
			id: ticketID,
			company_id: companyID,
		},
	}).catch((error: any) => handleFetchError(error))) as any;

	return data;
};

export const CustomerSupportService = {
	getAll,
	getOne,
	add,
	modify,
	delete: deleteTicket,
};
