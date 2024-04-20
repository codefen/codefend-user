import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useUserData } from '#commonUserHooks/useUserData';

export const useDeleteLan = (onDone: () => void, close: () => void) => {
	const { getCompany } = useUserData();
	const [fetcher, _, isLoading] = useFetcher();
    const [selectedLanIdToDelete, setSelectedLanIdToDelete] = useState<
    string 
>("");

	/* Fetch LAN  Apps */
	const fetchDelete = useCallback((companyID: string, deletedId: string) => {
		fetcher('post', {
			body: {
				model: 'resources/lan',
				ac: 'del',
				id: deletedId,
				company_id: companyID
			},
		}).then(({ data }: any) => {
			if(data.error !== "0") throw new Error();
            close();
            onDone();
            toast.success('Successfully Deleted lan...');
		}).catch((e: Error)=> toast.error("An unexpected error has occurred with the server"));
	}, []);

	/* Refetch Function. */
	const refetch = (id: string) => {
		const companyID = getCompany();
		if (!companyID) {
			toast.error('User information was not found');
			return;
		}
	
		fetchDelete(companyID, id);
	};



	return {
		selectedLanIdToDelete,
        setSelectedLanIdToDelete,
        isLoading,
        refetch
	};
};