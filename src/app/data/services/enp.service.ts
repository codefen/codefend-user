import { fetchPOST, handleFetchError } from '.';

const getEndpoints = async (macAddress: string, companyID: string) => {
	const { data } = (await fetchPOST({
		params: {
			model: 'resources/devices',
			ac: 'view_one',
			mac_address: macAddress,
			company_id: companyID,
		},
	}).catch((error: any) => handleFetchError(error))) as any;

	return data;
};

const deleteEndpoint = async (enpId: string, companyID: string) => {
	const { data } = (await fetchPOST({
		params: {
			model: 'resources/devices',
			ac: 'del',
			id: enpId,
			company_id: companyID,
		},
	}).catch((error: any) => handleFetchError(error))) as any;
	return data;
};

export const EnpService = {
	getEndpoints,
	delete: deleteEndpoint,
};
