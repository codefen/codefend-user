import { fetchPOST	 } from './';

const getAll = async (companyID: string) => {
	const { data } = await fetchPOST({
		params: {
			model: 'resources/lan',
			ac: 'view_all',
			company_id: companyID,
		},
	});
	return data;
};

const getOne = async (lanId: string | number, companyID: number) => {
	try {
		const { data } = await fetchPOST({
			params: {
				model: 'resources/lan',
				ac: 'view_one',
				id: lanId,
				company_id: companyID,
			},
		});
		return data;
	} catch (error) {
		console.error('Error: ', error);
		return { success: false };
	}
};

const add = async (params: any, companyID: string | undefined) => {
	const { data } = await fetchPOST({
		params: {
			model: 'resources/lan',
			ac: 'add',
			company_id: companyID,
			...params,
		},
	});
	return data;
};

const deleteHandler = async (
	resourceId: string,
	companyID: string | number,
) => {
	try {
		const { data } = await fetchPOST({
			params: {
				model: 'resources/lan',
				ac: 'del',
				id: resourceId,
				company_id: companyID,
			},
		});
		console.log({ deleteInternalNetwork: data });

		return data;
	} catch (error) {
		console.error('Error: ', error);
		return { success: false };
	}
};

const modify = async (lanID: string | number) => {
	try {
		const { data } = await fetchPOST({
			params: {
				model: 'resource/lan',
				ac: 'mod',
				id: lanID,
			},
		});

		console.log({ modifyInterNetwork: data });

		return data;
	} catch (error) {
		console.error('Error: ', error);
		return { success: false };
	}
};

export const LanApplicationService = {
	getAll,
	getOne,
	add,
	delete: deleteHandler,
	modify,
};
