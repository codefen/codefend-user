import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
	ResourcesTypes,
	mapSourceCode,
	useAuthState,
	useOrderStore,
	verifySession,
} from '../../..';
import { useFetcher } from '#commonHooks/useFetcher.ts';

export const useSourceCode = () => {
	const [fetcher,_, isLoading] = useFetcher();
	const [sourceCode, setSource] = useState(null);
	const { getCompany, logout } = useAuthState();
	const { updateState, setScopeTotalResources } = useOrderStore(
		(state) => state,
	);

	const fetchAll = useCallback((companyID: string) => {
		fetcher('post', {
			body: {
				model: 'resources/source',
				ac: 'view_all',
				company_id: companyID,
			},
		})
			.then(({ data }: any) => {
				verifySession(data, logout);

				const sourceCodeResource = data.disponibles
					? data.disponibles.map((repo: any) => mapSourceCode(repo))
					: [];
				setSource(sourceCodeResource);
				setScopeTotalResources(sourceCodeResource.length);
			})
			.finally(() => updateState('resourceType', ResourcesTypes.CODE));
	}, []);

	const refetch = () => {
		const companyID = getCompany();
		if (!companyID) {
			toast.error('User information was not found');
			return;
		}

		fetchAll(companyID);
	};

	useEffect(() => {
		refetch();
	}, []);

	const getSource = useCallback((): any => {
		return isLoading ? ({} as any) : sourceCode;
	}, [sourceCode]);

	const fetDeleteResources = (id: string, companyID: string) => {
		fetcher('post', {
			body: {
				model: 'resources/source',
				ac: 'del',
				id: id,
				company_id: companyID,
			},
		})
			.then(({ data }: any) => {
				toast.success('Successfully deleted sourcecode resources...');
				refetch();
			})
			.catch(() => {
				toast.error('An error has occurred on the server');
			});
	};

	const refetchDelete = (id: string) => {
		const companyID = getCompany();
		if (!companyID) {
			toast.error('User information was not found');
			return;
		}

		return fetDeleteResources(id, companyID);
	};

	const addSourceCode = (params: any, companyID: string) => {
		return fetcher('post', {
			body: {
				model: 'resources/source',
				ac: 'add',
				company_id: companyID,
				...params,
			},
		})
			.then(({ params }: any) => {
				if (!params) {
				}
				refetch();
				toast.success('Successfully repository is added');
			})
			.catch(() => {
				toast.error('An error has occurred on the server');
			});
	};

	const refetchAdd = (params: string) => {
		const companyID = getCompany();
		if (!companyID) {
			toast.error('User information was not found');
			return;
		}

		return addSourceCode(params, companyID);
	};

	return {
		getSource,
		isLoading,
		deletedResource: refetchDelete,
		addSourceCode: refetchAdd,
	};
};
