import { fetchPOST, handleFetchError } from "..";

const initialSnsData = async (sns: any, companyID: string) =>{
	const { data } = (await fetchPOST({
		params: {
            model: 'modules/sns',
            ac: 'search',
            company_id: companyID,
            ...sns,
		},
	}).catch((error: any) => handleFetchError(error))) as any;

	return data;
};

export const SnsService = {
    initialSnsData
}