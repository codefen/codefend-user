import { useState } from 'react';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { toast } from 'react-toastify';
import { useUserData } from '#commonUserHooks/useUserData';

interface SocialData {
	fName: string;
	lName: string;
	mail: string;
	phone: string;
	role: string;
	isAddingMember: boolean;
}

export const useAddSocial = (onDone: () => void) => {
	const { getCompany } = useUserData();
	const [selectedId, setSelectedId] = useState<string>('');
	const [fetcher, _, isLoading] = useFetcher();


	const fetchDelete = (companyID: string) => {
		fetcher('post', {
			body: {
				model: 'resources/se',
				ac: 'del',
                id: selectedId,
                company_id: companyID
		
			},
		}).then(({ data }: any) => {
			if(data.error != "0" || data.response == "error"){
				throw new Error("");
			}
            toast.success('Successfully delete Member...');
			onDone();
            
		}).catch((err:Error)=> toast.error("Unexpected server error when trying to delete the social resource"));
	};

	const handleDeleteResource = () => {
		const companyID = getCompany();
		if (!companyID) {
			toast.error('User information was not found');
			return;
		}
		fetchDelete(companyID);
	};

	return [handleDeleteResource, { setSelectedId, isLoading}] as const;
};
