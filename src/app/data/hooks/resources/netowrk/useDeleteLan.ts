import { useCallback, useRef, useState } from 'react';
import { type Device, useAuthState } from '../../..';
import { toast } from 'react-toastify';
import { useFetcher } from '#commonHooks/useFetcher.ts';

export const useDeleteLan = (onDone: () => void, close: () => void) => {
	const { getCompany } = useAuthState();
	const [fetcher, _, isLoading] = useFetcher();
    const [selectedLanIdToDelete, setSelectedLanIdToDelete] = useState<
    string | null
>(null);

	/* Fetch LAN  Apps */
	const fetchOne = useCallback((companyID: string) => {
		fetcher('post', {
			body: {
				model: 'resources/lan',
				ac: 'del',
				id: selectedLanIdToDelete,
				company_id: companyID
			},
		}).then(({ data }: any) => {
            close();
            onDone();
            toast.success('Successfully Deleted lan...');
		});
	}, []);

	/* Refetch Function. */
	const refetch = () => {
		const companyID = getCompany();
		if (!companyID) {
			toast.error('User information was not found');
			return;
		}
	
		fetchOne(companyID);
	};



	return {
		selectedLanIdToDelete,
        setSelectedLanIdToDelete,
        isLoading,
        refetch
	};
};