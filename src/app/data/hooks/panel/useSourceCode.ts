import { useCallback, useEffect, useState } from 'react';
import { SourceCode, mapSourceCode, useAuthState } from '../..';
import { SourceCodeService } from '../../services/panel/sourcecode.service';
import { toast } from 'react-toastify';

export const useSourceCode = () => {
	const [sourceCode, setSource] = useState(null);
	const [isLoading, setLoading] = useState(false);
	const { getUserdata } = useAuthState();

	const fetcher = useCallback((companyID: string) => {
		setLoading(true);
		SourceCodeService.getAll(companyID)
			.then((response: any) => {
				if (response.error !== '0') {
				}
				setSource(
					response.disponibles.map((repo: any) => mapSourceCode(repo)),
				);
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	const refetch = useCallback(() => {
		const companyID = getUserdata()?.companyID as string;
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
			const companyID = getUserdata()?.companyID as string;
			SourceCodeService.delete(id, companyID)
				.then((response: any) => {
					if (!response) {
					}
					toast.success('Successfully Deleted Web Resource...');
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
			const companyID = getUserdata()?.companyID as string;
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
