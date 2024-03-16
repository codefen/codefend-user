import { fetchGET, fetchPOST, handleFetchError } from ".";
import { getToken } from "..";

const addUserCompany = async (data: any) => {
    const { res } = (await fetchPOST({
        params: data,
        path: '/v1/approval/addusercompany',
        headers: {
            'Content-Type': 'application/json'
        }
    }).catch((error: any) => handleFetchError(error))) as any;

    return res;
}

const approveUser = async (data: any) => {
    const { res } = (await fetchPOST({
        params: data,
        path: '/v1/approval/userapproval',
        headers: {
            'Content-Type': 'application/json'
        }
    }).catch((error: any) => handleFetchError(error))) as any;

    return res;
}

const getPanelUsersApproval = async () => {
    const token = getToken();
    const data= (await fetchGET({
        path: '/v1/approval/getusers',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    }).catch((error: any) => handleFetchError(error))) as any;

    return data;
}

const getPanelCompanies = async () => {
    const token = getToken();
    const data= (await fetchGET({
        path: '/v1/approval/getcompanies',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    }).catch((error: any) => handleFetchError(error))) as any;

    return data;
}

const getPanelUsers = async () => {
    const token = getToken();
    const data= (await fetchGET({
        path: '/v1/approval/getuserlist',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    }).catch((error: any) => handleFetchError(error))) as any;

    return data;
}

const createCompanyHandler = async (body: any) => {
    const token = getToken();
    const res= (await fetchPOST({
        path: '/v1/approval/createCompany',
        body,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    }).catch((error: any) => handleFetchError(error))) as any;

    return res;
}

export const AdminService = {
    addUserCompany,
    approveUser,
    getPanelUsersApproval
}