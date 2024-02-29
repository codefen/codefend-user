import { useCallback, useState } from 'react';
import { useAuthState } from '../useAuthState';
import { DashboardService } from '../../services/panel/dashboard.service';
import { mapGetCompanyToCompanyData } from '../../utils/mapper';
import { DashboardProps} from '../..';
import { toast } from 'react-toastify';

export const useDashboard = () => {
	const { getCompany, getUserdata } = useAuthState();
	const [isLoading, setLoading] = useState(false);
	const [companyData, setCompanyResources] = useState<DashboardProps>(
		{} as DashboardProps,
	);
	const fetchWeb = useCallback((companyID: string) => {
		setLoading(true);

		DashboardService.getCompanyInfo(companyID)
			.then((response) => {
				setCompanyResources(mapGetCompanyToCompanyData(response));
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	const refetch = () => {
		const companyID = getCompany();
		if (!companyID) {
			toast.error('User information was not found');
			return;
		}
		setCompanyResources({} as DashboardProps);
		fetchWeb(companyID);
	};

	return { isLoading, companyData, refetch };
};
