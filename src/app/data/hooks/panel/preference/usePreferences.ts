import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { verifySession } from '../../..';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useUserData } from '#commonUserHooks/useUserData';
import type { CompanyOrders, MemberInfo, CompanyInfo } from '@interfaces/preferences';
import { EMPTY_COMPANY_CUSTOM } from '@mocks/empty';

/* Custom Hook "usePreferences" to handle retrieving all user preferences*/
export const usePreferences = () => {
	const { logout } = useUserData();
	const { getCompany} = useUserData();
	const [fetcher, _, isLoading] = useFetcher(true);
	const [company, setCompany] = useState<CompanyInfo>(EMPTY_COMPANY_CUSTOM as CompanyInfo);
	const [members, setMembers] = useState<MemberInfo[]>([]);
	const [orders, serOrders] = useState<CompanyOrders[]>([]);

	const fetchAll = useCallback((companyID: string) => {
		fetcher("post", {
			body: {
				model: 'companies/preferences',
				company_id: companyID,
			}
		}).then(({ data }: any) => {
				verifySession(data, logout);
				setCompany(data.company ? data.company : EMPTY_COMPANY_CUSTOM);
				setMembers(data.company_members ? data.company_members : []);
				serOrders(data.company_orders ? data.company_orders : []);
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

	return { orders, company, members, isLoading, refetch };
};
