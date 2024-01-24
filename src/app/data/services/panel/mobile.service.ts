import { fetchPOST, handleFetchError } from '../';

const getAll = async (companyID: string) => {
	const { data } = (await fetchPOST({
		params: {
			model: 'resources/mobile',
			ac: 'view_all',
			company_id: companyID,
		},
	}).catch((error: any) => handleFetchError(error))) as any;

	return data;
};

const getMobileByID = async (ID: string, companyID: string) => {
	const { data } = (await fetchPOST({
		params: {
			model: 'resources/mobile',
			ac: 'view_one',
			id: ID,
			company_id: companyID,
		},
	}).catch((error: any) => handleFetchError(error))) as any;

	return data;
};

const deleteApp = async (mobileId: string, companyID: string) => {
	const { data } = (await fetchPOST({
		params: {
			model: 'resources/mobile',
			ac: 'del',
			id: mobileId,
			company_id: companyID,
		},
	}).catch((error: any) => handleFetchError(error))) as any;

	return data;
};

const add = async (
	androidAddress: string,
	iosAddress: string,
	companyID: string,
) => {
	const { data } = (await fetchPOST({
		params: {
			model: 'resources/mobile',
			ac: 'add',
			app_android_link: androidAddress,
			app_apple_link: iosAddress,
			company_id: companyID,
		},
	}).catch((error: any) => handleFetchError(error))) as any;

	return data;
};

export const MobileService = {
	getAll,
	deleteApp,
	getMobileByID,
	add,
};
