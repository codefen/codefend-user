import { useState } from 'react';
import { toast } from 'react-toastify';
import { IssueService, useAuthState } from '..';
import { CustomerSupportService } from '../services/panel/support.service';

const useChatbox = () => {
	const [message, setMessage] = useState('');
	const [isAdding, setIsAdding] = useState(false);
	const { getUserdata } = useAuthState();
	const companyID = getUserdata()?.companyID as string;
	const userID = getUserdata()?.id as string;

	const handleIssueSubmit = (
		selectedID: string,
		onDone: () => void,
		textAreaValue: string,
	) => {
		setIsAdding(true);

		const requestParams = {
			issue_cs_body: !message.trim() ? textAreaValue : message,
			issue_id: selectedID,
		};
		const companyID = getUserdata()?.companyID as string;
		IssueService.addCSMessage(requestParams, companyID)
			.then(() => {
				setMessage('');
				onDone();
			})
			.finally(() => {
				setIsAdding(false);
			});
	};

	const handleSupportSubmit = (
		selectedID: string,
		onDone: () => void,
		textAreaValue: string,
	) => {
		const params = {
			cs_body: !message.trim() ? textAreaValue : message,
			dad_id: selectedID,
		};

		CustomerSupportService.add(params, userID, companyID)
			.then(() => {
				setMessage('');
				onDone();
			})
			.catch((error: any) => {
				console.log(error.response);
				toast.error(error.response);
			})
			.finally(() => {
				setIsAdding(false);
			});
	};

	return {
		message,
		setMessage,
		isAdding,
		handleIssueSubmit,
		handleSupportSubmit,
	};
};

export default useChatbox;
