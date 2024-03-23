import { fetchPOST, handleFetchError } from ".";


const getTotalResourceCount = async (companyID: string) => {
    const { data } = (await fetchPOST({
        params: {
            model: "resources/index",
            size: "full",
            company_id: companyID
        }
    }).catch((error: any) => handleFetchError(error))) as any;

    return data;
}

const sendOrderScope = async (companyID: string, resourceClass: string, resources_ids: string) => {
    const { data } = (await fetchPOST({
        params: {
            model: "orders/add",
            phase: "scope",
            company_id: companyID,
            resources_class: resourceClass,
            resources_ids: resources_ids
        }
    }).catch((error: any) => handleFetchError(error))) as any;

    return data;
}

const sendMemberShip = async (companyID: string, referenceNumber: string, membership: string) => {
    const { data } = (await fetchPOST({
        params: {
            model: "orders/add",
            phase: "membership",
            company_id: companyID,
            reference_number: referenceNumber,
            membership
        }
    }).catch((error: any) => handleFetchError(error))) as any;

    return data;
}

const getCurrentPrices = async (companyID: string) => {
    const { data } = (await fetchPOST({
        params: {
            model: "orders/add",
            phase: "plan",
            company_id: companyID,
            show: "prices"
        }
    }).catch((error: any) => handleFetchError(error))) as any;

    return data;
}

const sendOrderPlan = async (companyID: string, referenceNumber: string, chosenPrice: string, chosenPlan: string) => {
    const { data } = (await fetchPOST({
        params: {
            model: "orders/add",
            phase: "plan",
            company_id: companyID,
            reference_number: referenceNumber,
            chosen_plan: chosenPlan,
            chosen_plan_price: chosenPrice
        }
    }).catch((error: any) => handleFetchError(error))) as any;

    return data;
}

const sendOrderConfirm = async (companyID: string, referenceNumber: string) => {
    const { data } = (await fetchPOST({
        params: {
            model: "orders/add",
            phase: "confirm",
            company_id: companyID,
            reference_number: referenceNumber,
        }
    }).catch((error: any) => handleFetchError(error))) as any;

    return data;
}

const getCurrentProviders = async (companyID: string, referenceNumber: string) => {
    const { data } = (await fetchPOST({
        params: {
            model: "orders/add",
            phase: "providers",
            company_id: companyID,
            reference_number: referenceNumber,
        }
    }).catch((error: any) => handleFetchError(error))) as any;

    return data;
}

const sendOrderProvider = async (companyID: string, referenceNumber: string, providerID: string) => {
    const { data } = (await fetchPOST({
        params: {
            model: "orders/add",
            phase: "providers",
            company_id: companyID,
            reference_number: referenceNumber,
            provider_class: "user",
            provider_id: providerID
        }
    }).catch((error: any) => handleFetchError(error))) as any;

    return data;
}

const sendOrderEnvironment = async (companyID: string, referenceNumber: string, environment: string) => {
    const { data } = (await fetchPOST({
        params: {
            model: "orders/add",
            phase: "environment",
            company_id: companyID,
            reference_number: referenceNumber,
            environment: environment
        }
    }).catch((error: any) => handleFetchError(error))) as any;

    return data;
}

const sendOrderProviderInfo= async (companyID: string, referenceNumber: string, providerInfo: string) => {
    const { data } = (await fetchPOST({
        params: {
            model: "orders/add",
            phase: "provider_info",
            company_id: companyID,
            reference_number: referenceNumber,
            provider_info: providerInfo
        }
    }).catch((error: any) => handleFetchError(error))) as any;

    return data;
}

export const OrderService = {
    getTotalResourceCount, getCurrentPrices, getCurrentProviders, sendOrderScope, sendMemberShip, sendOrderPlan, sendOrderConfirm, sendOrderProvider, sendOrderEnvironment, sendOrderProviderInfo
}