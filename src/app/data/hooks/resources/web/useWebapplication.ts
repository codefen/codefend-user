import { useState } from 'react';
import {
	type WebapplicationProps,
	mapToWebresourceProps,
	useAuthState,
	useOrderStore,
	verifySession,
	type Company,
} from '../../..';
import { toast } from 'react-toastify';
import { useFetcher } from '#commonHooks/useFetcher.ts';

/* Custom Hook "useWebapplication" to manage the GET of web apps*/
export const useWebapplication = () => {
	const { getCompany, logout } = useAuthState();
	const [fetcher,_, isLoading] = useFetcher(true);
	const { setScopeTotalResources } = useOrderStore((state) => state);
	const [webResources, setWebResources] = useState<WebapplicationProps>(
		{company: {} as Company, resources: []}
	);

	//Refetch Data
	const refetch = () => {
		const companyID = getCompany();

		fetcher<any>('post', {
			body: {
				company_id: companyID,
				model: 'resources/web/index',
				childs: 'yes',
				resource_address_domain: 'clarin.com',
			},
		}).then(({ data }) => {
			verifySession(data, logout);

			const webResource = mapToWebresourceProps(data);
			setWebResources(webResource);
			setScopeTotalResources(webResource.resources.length);
		});
	};

	return { webResources, isLoading, refetch };
};

/* Custom Hook "useDeleteWebResource" to handle "deleting" web apps */
export const useDeleteWebResource = () => {
	const { getCompany } = useAuthState();
	const [fetcher, cancelRequest, isLoading] = useFetcher();

	const handleDelete = async (
		onDone: () => void | null,
		id: string,
	): Promise<any> => {
		const companyID = getCompany();
		if (!companyID) {
			toast.error('User information was not found');
			return;
		}
		fetcher<any>('post', {
			body: {
				model: 'resources/web/del',
				resource_id: id,
				company_id: companyID,
			},
		})
			.then(({ data: { response } }) => {
				if (
					response !== 'success' ||
					response.isAnError ||
					Number(response.error) > 0
				) {
					throw new Error('An error has occurred on the server');
				}

				toast.success('Successfully deleted Web resource...');
				if (onDone && onDone !== undefined) onDone();
			})
			.catch((error: any) => {
				toast.error(error.message);
				close?.();
			});
	};

	return { handleDelete, isDeletingResource: isLoading };
};

export const useAddWebResourcce = (onDone: () => void, onClose: () => void) => {
	const { getCompany } = useAuthState();
	const [fetcher, cancelRequest, isLoading] = useFetcher();
	const [domainName, setDomainName] = useState('');

	const verifyDomainName = () => {
		if (
			!domainName.trim() ||
			domainName.length === 0 ||
			domainName.length > 100
		) {
			toast.error('Invalid domain');
			return true;
		}
		return false;
	};

	const handleAddResource = () => {
		if (!domainName) return;
		if (verifyDomainName()) return;

		const companyID = getCompany();
		if (!companyID) {
			toast.error('User information was not found');
			return;
		}

		fetcher<any>('post', {
			body: {
				model: 'resources/web/add',
				company_id: companyID,
				resource_address_domain: domainName,
			},
		})
			.then(({ data }) => {
				if (data.isAnError || Number(data.error) > 0) {
					throw new Error('An error has occurred on the server');
				}
				setDomainName('');
				toast.success('Successfully Added Domain..');
				onDone();
			})
			.catch((error: any) => {
				toast.error(error.message);
				onClose();
			});
	};

	return { handleAddResource, isAddingDomain: isLoading, setDomainName };
};

export const useAddSubResource = (onDone: () => void, onClose: () => void) => {
	const { getCompany } = useAuthState();
	const [fetcher, cancelRequest, isLoading] = useFetcher();
	const [domainName, setDomainName] = useState('');
	const [ipAddress, setIpAddress] = useState('');
	const [mainDomainId, setMainDomainId] = useState('');

	const verifyDomainName = () => {
		if (
			!domainName.trim() ||
			domainName.length === 0 ||
			domainName.length > 100
		) {
			toast.error('Invalid domain');
			return true;
		}

		if (!mainDomainId || mainDomainId.length == 0) {
			toast.error('Invalid main resource');
			return true;
		}

		if (!domainName || domainName.length == 0 || domainName.length > 100) {
			toast.error('Invalid domain');
			return true;
		}

		return false;
	};

	const handleAddSubResource = () => {
		if (!domainName) return;
		if (verifyDomainName()) return;

		const companyID = getCompany();
		if (!companyID) {
			toast.error('User information was not found');
			return;
		}

		fetcher<any>('post', {
			body: {
				model: 'resources/web/add/child',
				company_id: companyID,
				resource_domain_dad: mainDomainId,
				resource_address_domain: domainName,
			},
		})
			.then((response: any) => {
				if (!response && !response.company)
					throw new Error('An error has occurred on the server');

				setDomainName('');
				onDone();
				toast.success('Successfully Added Domain..');
			})
			.catch((error: any) => {
				toast.error(error.message);
				onClose();
			});
	};

	return {
		handleAddSubResource,
		isAddingSubDomain: isLoading,
		setDomainName,
		setIpAddress,
		setMainDomainId,
		mainDomainId
	};
};
