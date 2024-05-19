import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useUserData } from '#commonUserHooks/useUserData';
import { apiErrorValidation, companyIdIsNull } from '@/app/constants/validations';

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
			if (apiErrorValidation(data?.error, data?.response))  throw new Error();
            close();
            onDone();
            toast.success('Successfully Deleted lan...');
		}).catch((e: Error)=> toast.error("An unexpected error has occurred with the server"));
	}, []);

	/* Refetch Function. */
	const refetch = (id: string) => {
		const companyID = getCompany();
		if (companyIdIsNull(companyID)) return;
	
		fetchDelete(companyID, id);
	};



	return {
		selectedLanIdToDelete,
        setSelectedLanIdToDelete,
        isLoading,
        refetch
	};
};