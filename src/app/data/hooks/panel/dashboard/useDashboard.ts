import { useState } from 'react';
import { toast } from 'react-toastify';
import { verifySession } from '@/app/constants/validations';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useUserData } from '#commonUserHooks/useUserData.ts';
import { EMPTY_DASHBOARD_PROPS } from '@mocks/empty.ts';
import type { DashboardPropsV2 } from '@interfaces/dashboard';
import { apiErrorValidation } from '@/app/constants/validations';

export const useDashboard = () => {
	const { getCompany, logout } = useUserData();
	const [fetcher, _, isLoading] = useFetcher(true);
	const [companyData, setCompanyResources] = useState<DashboardPropsV2>(
		EMPTY_DASHBOARD_PROPS,
	);

	const refetch = () => {
		const companyID = getCompany();
		if (!companyID) {
			toast.error('User information was not found');
			return;
		}
		fetcher<any>('post', {
			body: { company_id: companyID, model: 'companies/dashboard' },
		}).then(({ data }) => {
			if(verifySession(data, logout)) return;
			if (apiErrorValidation(data?.error, data?.response)) {
				throw new Error('');
			}
			setCompanyResources(
				data
					? {
						issues: data.issues ? data.issues : [],
						issues_condicion: data.issues_condicion,
						issues_share: data.issues_share,
						members: data.members ? data.members : [],
						resources: data.resources,
					  }
					: EMPTY_DASHBOARD_PROPS,
			);
		});
	};

	return { isLoading, companyData, refetch };
};
