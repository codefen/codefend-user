import { fetchPOST, handleFetchError } from '../';

const get = async (companyID: string | number) => {
	const { data } = (await fetchPOST({
		params: {
			model: 'resources/web/index',
			childs: 'yes',
			resource_address_domain: 'clarin.com',
			company_id: companyID,
		},
	}).catch((error: any) => handleFetchError(error))) as any;

	return data;
};

const addResource = async (newResource: string, companyID: string) => {
	const { data } = (await fetchPOST({
		params: {
			model: 'resources/web/add',
			company_id: companyID,
			resource_address_domain: newResource,
		},
	}).catch((error: any) => handleFetchError(error))) as any;

	return data;
};

const deleteResource = async (resourceId: string, companyID: string) => {
	const { data } = (await fetchPOST({
		params: {
			model: 'resources/web/del',
			resource_id: resourceId,
			company_id: companyID,
		},
	}).catch((error: any) => handleFetchError(error))) as any;

	return data;
};

const addSubresource = async (
	id: string,
	resourceName: string,
	companyID: string,
) => {
	const { data } = (await fetchPOST({
		params: {
			model: 'resources/web/add/child',
			company_id: companyID,
			resource_domain_dad: id,
			resource_address_domain: resourceName,
		},
	}).catch((error: any) => handleFetchError(error))) as any;

	return data;
};

export const WebApplicationService = {
	get,
	addResource,
	deleteResource,
	addSubresource,
};
