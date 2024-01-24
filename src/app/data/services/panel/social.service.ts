import { fetchGET, fetchPOST } from '..';

const getAll = async (companyID: string) => {
	try {
		const { data } = await fetchPOST({
			params: {
				model: 'resources/se',
				ac: 'view_all',
				company_id: companyID,
			},
		});
		return data;
	} catch (error) {
		console.error('Error: ', error);
		return { success: false };
	}
};

const getOne = async (companyID: string) => {
	try {
		const { data } = await fetchGET({
			params: {
				model: 'resources/se',
				ac: 'view_one',
				company_id: companyID,
			},
		});
		return data;
	} catch (error) {
		console.error('Error: ', error);
		return { success: false };
	}
};

const add = async (params: any, companyID: string) => {
	try {
		const { data } = await fetchPOST({
			params: {
				model: 'resources/se',
				ac: 'add',
				company_id: companyID,
				...params,
			},
		});
		return data;
	} catch (error) {
		console.error('Error: ', error);
		return { success: false };
	}
};

const deleteOne = async (companyID: string) => {
	try {
		const { data } = await fetchPOST({
			params: {
				model: 'resources/se',
				ac: 'del',
				company_id: companyID,
			},
		});
		return data;
	} catch (error) {
		console.error('Error: ', error);
		return { success: false };
	}
};

export const SocialAplicationService = {
	add,
	deleteOne,
	getOne,
	getAll,
};
