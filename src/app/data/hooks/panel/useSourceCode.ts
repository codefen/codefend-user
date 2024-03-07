import { useCallback, useEffect, useState } from 'react';
import { mapSourceCode, useAuthState, verifySession } from '../..';
import { SourceCodeService } from '../../services/panel/sourcecode.service';
import { toast } from 'react-toastify';

export const useSourceCode = () => {
	const [sourceCode, setSource] = useState(null);
	const [isLoading, setLoading] = useState(false);
	const { getUserdata, getCompany, logout } = useAuthState();

	const fetcher = useCallback((companyID: string) => {
		setLoading(true);
		SourceCodeService.getAll(companyID)
			.then((res: any) => {
				verifySession(res, logout);

				setSource(
					res.disponibles ? res.disponibles.map((repo: any) => mapSourceCode(repo)) : []
				);
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	const refetch = useCallback(() => {
		const companyID = getCompany();
		fetcher(companyID);
	}, [getUserdata]);

	useEffect(() => {
		refetch();
	}, []);

	const getSource = useCallback((): any => {
		return isLoading ? ({} as any) : sourceCode;
	}, [sourceCode]);

	const deletedResource = useCallback(
		(id: string) => {
			setLoading(true);
			const companyID = getCompany();
			SourceCodeService.delete(id, companyID)
				.then((response: any) => {
					if (!response) {
					}

					toast.success('Successfully deleted sourcecode resources...');
					refetch();
				})
				.catch(() => {
					toast.error('An error has occurred on the server');
				})
				.finally(() => setLoading(false));
		},
		[getUserdata],
	);

	const addSourceCode = useCallback(
		(params: string) => {
			setLoading(true);
			const companyID = getCompany();
			return SourceCodeService.add(params, companyID)
				.then((response: any) => {
					if (!response) {
					}
					refetch();
					toast.success('Successfully repository is added');
				})
				.catch(() => {
					toast.error('An error has occurred on the server');
				})
				.finally(() => {
					setLoading(false);
				});
		},
		[getUserdata],
	);

	return { getSource, isLoading, deletedResource, addSourceCode };
};
