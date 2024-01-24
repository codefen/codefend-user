import { fetchPOST } from ".";

const getAll = async (companyID: string) => {
	try {
		const { data } = await fetchPOST({
			params: {
				model: "companies/dashboard",
				company_id: companyID
			}
		})
		return data
	} catch (error) {
		console.error('Error: ', error);
		return { success: false };
	}
}

export const companyServices = {
	getAll
}