import { useState } from 'react';
import { IssueService, useAuthState } from '../../../';
import { toast } from 'react-toastify';
import { getTinyEditorContent } from '../../../../../editor-lib';

export interface UpdateIssue {
	id: string;
	issueName: string;
	score: string;

	isAddingIssue: boolean;
}

const validateNewIssue = (validate: boolean, message: string) => {
	if (validate) {
		toast.error(message);
		return false;
	}
	return true;
};

export const useUpdateIssue = () => {
	const { getCompany } = useAuthState();
	const [updatedIssue, dispatch] = useState<UpdateIssue>({
		id: '',
		issueName: '',
		score: '',

		isAddingIssue: false,
	});

	const fetchSave = (companyID: string) => {
		const _editorContent = getTinyEditorContent('issue');
		if (
			!validateNewIssue(
				!_editorContent.trim(),
				'Invalid content, please add content using the editor',
			)
		) {
			return;
		}

		dispatch((state: UpdateIssue) => ({
			...state,
			isAddingIssue: true,
		}));
		const params = {
			id: updatedIssue.id,
			main_desc: _editorContent,
			name: updatedIssue.issueName,
			risk_score: updatedIssue.score,
		};

		return IssueService.modify(params, companyID)
			.then((response: any) => {
				if (response.response === 'error' || response.isAnError)
					throw new Error(
						response.message ?? 'An unexpected error has occurred',
					);

				toast.success('Successfully Added Issue...');
				return { updatedIssue };
			})
			.catch((error: Error) => {
				toast.error("An unexpected error has occurred on the server");
			})
			.finally(() =>
				dispatch((state: UpdateIssue) => ({
					...state,
					isAddingIssue: false,
				})),
			);
	};

	const update = async () => {
		const companyID = getCompany();
		if (!companyID) {
			toast.error('User information was not found');
			return;
		}

		return fetchSave(companyID);
	};

	return { updatedIssue, dispatch, update };
};
