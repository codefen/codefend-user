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
const getCompanies = async (companyID: number) => {
	try {
		const { data } = await fetchPOST({
			params: {
				model: "companies/index",
				company_id: companyID
			}
		})
		return data
	} catch (error) {
		console.error('Error: ', error);
		return { success: false };
	}
}

const createCompany = async (companyID: string) => {
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
	getAll,
	getCompanies
}