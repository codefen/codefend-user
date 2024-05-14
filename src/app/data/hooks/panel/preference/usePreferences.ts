import { useCallback, useState } from 'react';
import {  type Member } from '../../..';
import { verifySession } from '@/app/constants/validations';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useUserData } from '#commonUserHooks/useUserData';
import type { CompanyOrders, CompanyInfo } from '@interfaces/preferences';
import { EMPTY_COMPANY_CUSTOM } from '@/app/constants/empty';
import { apiErrorValidation, companyIdIsNotNull } from '@/app/constants/validations';

/* Custom Hook "usePreferences" to handle retrieving all user preferences*/
export const usePreferences = () => {
	const { logout } = useUserData();
	const { getCompany } = useUserData();
	const [fetcher, _, isLoading] = useFetcher(true);
	const [company, setCompany] = useState<CompanyInfo>(
		EMPTY_COMPANY_CUSTOM as CompanyInfo,
	);
	const [members, setMembers] = useState<Member[]>([]);
	const [orders, serOrders] = useState<CompanyOrders[]>([]);

	const fetchAll = useCallback((companyID: string) => {
		fetcher('post', {
			body: {
				model: 'companies/preferences',
				company_id: companyID,
			},
		}).then(({ data }: any) => {
			if (verifySession(data, logout)) return;
			if (apiErrorValidation(data?.error, data?.response)) {
				throw new Error('');
			}
			let members = data.company_members ? data.company_members : [];
			members = data.provided_accesses
				? members.concat(data.provided_accesses)
				: members;
			setCompany(data.company ? data.company : EMPTY_COMPANY_CUSTOM);
			setMembers(members);
			serOrders(data.company_orders ? data.company_orders : []);
		});
	}, []);

	const refetch = () => {
		const companyID = getCompany();
		if (companyIdIsNotNull(companyID)) return;

		fetchAll(companyID);
	};

	return { orders, company, members, isLoading, refetch };
};
