import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuthState } from '../..';
import { verifySession } from '../../..';
import { useFetcher } from '#commonHooks/useFetcher.ts';

interface CompanyInfo {
	id: string;
	name: string;
	web: string;
	mercado: string;
	size: string;
	pais: string;
	pais_code: string;
	pais_provincia: string;
	pais_ciudad: string;
	address: string;
	owner_fname: string;
	owner_lname: string;
	owner_role: string;
	owner_email: string;
	owner_phone: string;
	profile_media: string;
	orders_size: string;
	eliminado: string;
	creacion: string;
}

interface MemberInfo {
	id: string;
	company_id: string;
	fname: string;
	lname: string;
	role: string;
	email: string;
	phone: string;
	profile_media: string;
	pais: string;
	pais_code: string;
	pais_provincia: string;
	pais_ciudad: string;
	eliminado: string;
	creacion: string;
}

/* Custom Hook "usePreferences" to handle retrieving all user preferences*/
export const usePreferences = () => {
	const { getCompany, logout } = useAuthState();
	const [fetcher, cancelRequest, isLoading] = useFetcher();
	const [company, setCompany] = useState<CompanyInfo | ''>('');
	const [members, setMembers] = useState<MemberInfo[]>([]);
	const [orders, serOrders] = useState<any[]>([]);

	const fetchAll = useCallback((companyID: string) => {
		fetcher("post", {
			body: {
				model: 'companies/preferences',
				company_id: companyID,
			}
		}).then(({ data }: any) => {
				verifySession(data, logout);
				setCompany(data.company);
				setMembers(data.company_members);
				serOrders(data.company_orders);
			});
	}, []);

	const refetch = () => {
		const companyID = getCompany();
		if (!companyID) {
			toast.error('User information was not found');
			return;
		}

		fetchAll(companyID);
	}

	useEffect(() => {
		refetch();
		return ()=> cancelRequest();
	}, []);

	return { loading: isLoading, company, members, refetch, orders };
};
