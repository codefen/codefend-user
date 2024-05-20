import { useState } from 'react';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { toast } from 'react-toastify';
import { useUserData } from '#commonUserHooks/useUserData';
import { APP_MESSAGE_TOAST, SOCIAL_PANEL_TEXT } from '@/app/constants/app-toast-texts';
import { companyIdIsNull } from '@/app/constants/validations';

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
				throw new Error(APP_MESSAGE_TOAST.API_UNEXPECTED_ERROR);
			}
            toast.success(SOCIAL_PANEL_TEXT.DELETED_SOCIAL);
			onDone();
            
		}).catch((e:Error)=> toast.error(e.message));
	};

	const handleDeleteResource = () => {
		const companyID = getCompany();
		if (companyIdIsNull(companyID)) return;
		fetchDelete(companyID);
	};

	return [handleDeleteResource, { setSelectedId, isLoading}] as const;
};
