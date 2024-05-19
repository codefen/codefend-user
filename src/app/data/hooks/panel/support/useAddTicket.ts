import { toast } from 'react-toastify';
import { useRef } from 'react';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useUserData } from '#commonUserHooks/useUserData';
import { apiErrorValidation, companyIdIsNull } from '@/app/constants/validations';

const validators = (title: string, shortDescription: string) => {
	if (!title.trim()) {
		toast.error('Invalid ticket title');
		return true;
	}
	if (!shortDescription.trim()) {
		toast.error('Invalid short description');
		return true;
	}
	return false;
}

export const useAddTicket = () => {
	const [fetcher,_, isLoading] = useFetcher();
	const title = useRef<HTMLInputElement>(null);
	const shortDescription = useRef<HTMLTextAreaElement>(null);
	const { getUserdata, getCompany } = useUserData();

	const fetchAdd = async (params: any, userID: string, companyID: string) => {
		return fetcher('post', {
			body: {
				model: 'cs/index',
				ac: 'add',
				user_id: userID,
				company_id: companyID,
				...params,
			},
		}).then(({data}:any) => {
			if(apiErrorValidation(data?.error, data?.response)){return;}
			toast.success('Successfully Added Ticket...');
		});
	};


	const addTicket = (): any => {
		const companyID = getCompany();
		const userID = getUserdata().id;
		if (companyIdIsNull(companyID) || validators(title.current?.value || "", shortDescription.current?.value || "")) return Promise.reject(false);
		
		const params = {
			condicion: 'open',
			cs_header: title.current?.value || "",
			cs_body: shortDescription.current?.value || "",
		};
		return fetchAdd(params, userID, companyID);
	};

	return { isAddingTicket: isLoading, addTicket, title, shortDescription };
};