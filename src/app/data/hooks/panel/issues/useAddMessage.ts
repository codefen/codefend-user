import { type Fetcher } from '../../util/useFetcher';
import { toast } from 'react-toastify';

export const useAddIssueMessage = (message: string, setMessage: (updated: string)=>void, fetcher: Fetcher, getCompany: ()=>any) => {

	const fetchSend = (
		selectedID: string,
		onDone: () => void,
		textAreaValue: string,
		companyID: string,
	) => {
		fetcher('post', {
			body: {
				model: 'issues/cs',
				ac: 'add',
				company_id: companyID,
				issue_cs_body: !message.trim() ? textAreaValue : message,
				issue_id: selectedID,
			},
		}).then(() => {
			setMessage('');
			onDone();
		});
	};

	const handleIssueSubmit = (
		selectedID: string,
		onDone: () => void,
		textAreaValue: string,
	) => {
		const companyID = getCompany();
		if (!companyID) {
			toast.error('User information was not found');
			return;
		}
		fetchSend(selectedID, onDone, textAreaValue, companyID);
	};

	return { handleIssueSubmit };
};
