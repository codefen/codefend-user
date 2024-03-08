import { fetchPOST, handleFetchError } from '..';

const getEndpoints = async (scan_id: number, companyID: string) => {
	const { data } = (await fetchPOST({
		params: {
			model: 'modules/epm/devices',
			ac: 'get',
			scan_id: scan_id,
			company_id: companyID,
		},
	})
		.catch((error: any) => handleFetchError(error))) as any;

	return data;
};

const getScans = async (companyID: string) => {
	const { data } = (await fetchPOST({
		params: {
			model: 'modules/epm/devices',
			ac: 'get_scans',
			company_id: companyID,
		},
	})
		.catch((error: any) => handleFetchError(error))) as any;
	return data;
};

const getVulns = async (code_name: string, companyID: string) => {
	const { data } = (await fetchPOST({
		params: {
			model: 'modules/epm/devices',
			ac: 'get_vuln',
			code_name: code_name,
			company_id: companyID,
		},
	})
		.catch((error: any) => handleFetchError(error))) as any;

	return data;
};


export const EnpService = {
	getEndpoints,
	getScans,
	getVulns
};
