import { useCallback, useState } from 'react';
import { useAuthState } from '../useAuthState';
import { mapGetCompanyToCompanyData } from '../../utils/mapper';
import {
	type DashboardProps,
	useAdminCompanyStore,
	verifySession,
} from '../..';
import { toast } from 'react-toastify';
import { useFetcher } from '../util/useFetcher';

export const useDashboard = () => {
	const { getCompany, logout } = useAuthState();
	const [fetcher, cancelRequest, isLoading] = useFetcher();
	const [companyData, setCompanyResources] = useState<DashboardProps>(
		{} as DashboardProps,
	);
	const { selectCompany } = useAdminCompanyStore((state) => state);

	//Refetch web app func
	const refetch = () => {
		const companyID = getCompany();
		if (!companyID) {
			toast.error('User information was not found');
			return;
		}
		setCompanyResources({} as DashboardProps);
		fetcher<any>('post', {
			body: { company_id: companyID, model: 'companies/dashboard' }
		})?.then(({ data }) => {
			verifySession(data, logout);
			selectCompany(data.company, true);
			setCompanyResources(mapGetCompanyToCompanyData(data));
		});
	};

	return { isLoading, companyData, refetch };
};
