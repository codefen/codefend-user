import { useState } from 'react';
import { mapGetCompanyToCompanyData } from '../../../utils/mapper';
import { type DashboardProps, verifySession } from '../../..';
import { toast } from 'react-toastify';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useUserData } from '#commonUserHooks/useUserData';
import { EMPTY_DASHBOARD_PROPS } from '@mocks/empty';
import type { DashboardPropsV2 } from '@interfaces/dashboard';

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
			verifySession(data, logout);
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
