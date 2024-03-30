import type { User } from '../../../';
import { type Fetcher } from '../../util/useFetcher';
import { toast } from 'react-toastify';

export const useAddSupportMessage = (
	message: string,
	setMessage: (updated: string) => void,
	fetcher: Fetcher,
	getCompany: () => any,
	getUserdata: () => User,
) => {
	const fetchSend = (
		selectedID: string,
		onDone: () => void,
		textAreaValue: string,
		companyID: string,
	) => {
		fetcher('post', {
			body: {
				model: 'cs/index',
				ac: 'add',
				user_id: getUserdata().id,
				company_id: companyID,
				cs_body: !message.trim() ? textAreaValue : message,
				dad_id: selectedID,
			},
		}).then(() => {
			setMessage('');
			onDone();
		});
	};

	const handleSupportSubmit = (
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

	return { handleSupportSubmit };
};
