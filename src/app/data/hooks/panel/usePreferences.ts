import { useCallback, useEffect, useState } from 'react';
import { useAuthState } from '..';
import { PreferenceServices } from '../../services';
import { User } from '../../';

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
	const { getCompany, getUserdata } = useAuthState();

	const [loading, setLoading] = useState<boolean>(false);
	const [company, setCompany] = useState<CompanyInfo | ''>('');
	const [members, setMembers] = useState<MemberInfo[]>([]);
	const [orders, serOrders] = useState<any[]>([]);

	const fetcher = useCallback(() => {
		const companyID = getCompany();
		setLoading(true);

		PreferenceServices.getAll(companyID)
			.then((response: any) => {
				setCompany(response.company);
				setMembers(response.company_members);
				serOrders(response.company_orders);
			})
			.finally(() => {
				setLoading(false);
			});
	}, [getUserdata, getCompany]);

	useEffect(() => {
		fetcher();
	}, []);

	const refetch = useCallback(() => fetcher(), []);

	return { loading, company, members, refetch, orders };
};
