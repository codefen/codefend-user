import { type Fetcher } from '#commonHooks/useFetcher.ts';
import { apiErrorValidation, companyIdIsNull } from '@/app/constants/validations';

export const useAddIssueMessage = (message: string, setMessage: (updated: string)=>void, fetcher: Fetcher, getCompany: ()=>any) => {

	const fetchSend = (
		selectedID: string,
		onDone: (newCs?: any) => void,
		textAreaValue: string,
		companyID: string,
	) => {
		fetcher<any>('post', {
			body: {
				model: 'issues/cs',
				ac: 'add',
				company_id: companyID,
				issue_cs_body: !message.trim() ? textAreaValue : message,
				issue_id: selectedID,
			},
		}).then(({data}) => {
			if(apiErrorValidation(data?.error, data?.response))
				throw new Error("");
			setMessage('');
			onDone(data?.issues_cs);
		});
	};

	const handleIssueSubmit = (
		selectedID: string,
		onDone: () => void,
		textAreaValue: string,
	) => {
		const companyID = getCompany();
		if (companyIdIsNull(companyID)) return;
		fetchSend(selectedID, onDone, textAreaValue, companyID);
	};

	return { handleIssueSubmit };
};
