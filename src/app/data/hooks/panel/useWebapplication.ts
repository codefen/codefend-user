import { useCallback, useState } from 'react';
import { WebApplicationService } from '../../services/panel/webapplication.service';
import {
	User,
	WebapplicationProps,
	mapToWebresourceProps,
	useAuthState,
} from '../..';
import { toast } from 'react-toastify';

/* Custom Hook "useWebapplication" to manage the GET of web apps*/
export const useWebapplication = () => {
	const { getCompany } = useAuthState();
	const [isLoading, setLoading] = useState<boolean>(false);
	const [webResources, setWebResources] = useState<WebapplicationProps>(
		{} as WebapplicationProps,
	);

	//GET Webresourcer from API
	const fetchWeb = useCallback((companyID: string) => {
		setLoading(true);

		WebApplicationService.get(companyID)
			.then((response: any) =>
				setWebResources(mapToWebresourceProps(response)),
			)
			.finally(() => {
				setLoading(false);
			});
	}, []);

	//Refetch Data
	const refetch = () => {
		const companyID = getCompany();
		fetchWeb(companyID);
	};

	return { webResources, isLoading, refetch };
};

/* Custom Hook "useDeleteWebResource" to handle "deleting" web apps */
export const useDeleteWebResource = () => {
	const [isDeletingResource, setIsDeletingResource] = useState<boolean>(false);
	const { getCompany } = useAuthState();

	const handleDelete = async (
		onDone: () => void | null,
		id: string,
	): Promise<any> => {
		setIsDeletingResource(true);
		const companyID = getCompany();
		if (!companyID) {
			console.error("Error: 'companyID' no está definido en userData.");
			toast.error('User information was not found');
			return;
		}
		return WebApplicationService.deleteResource(id, companyID)
			.then(({ response }) => {
				if (
					response !== 'success' ||
					response.isAnError ||
					Number(response.error) > 0
				) {
					throw new Error('An error has occurred on the server');
				}

				toast.success('Successfully Deleted Web Resource...');
				if (onDone && onDone !== undefined) onDone();
			})
			.catch((error: any) => {
				toast.error(error.message);
				close?.();
			})
			.finally(() => setIsDeletingResource(false));
	};

	return { handleDelete, isDeletingResource };
};
