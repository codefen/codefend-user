import { useState } from 'react';
import { useAuthState } from '../../../';
import { toast } from 'react-toastify';
import { getTinyEditorContent } from '../../../../../editor-lib';
import { useFetcher } from '#commonHooks/useFetcher.ts';

export interface UpdateIssue {
	id: string;
	issueName: string;
	score: string;
	resourceID: number | undefined;
}

const validateNewIssue = (validate: boolean, message: string) => {
	if (validate) {
		toast.error(message);
		return false;
	}
	return true;
};

/* Custom Hook "useUpdateIssue" to handle updating an issue*/
export const useUpdateIssue = () => {
	const { getCompany } = useAuthState();
	const [fetcher,_, isLoading] = useFetcher();
	const [updatedIssue, dispatch] = useState<UpdateIssue>({
		id: '',
		issueName: '',
		score: '',
		resourceID: 1
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

		return fetcher('post', {
			body: {
				model: 'issues/mod',
				company_id: companyID,
				resource_address_domain: 'clarin.com',
				id: updatedIssue.id,
				main_desc: _editorContent,
				name: updatedIssue.issueName,
				resource_id: updatedIssue.resourceID || 1,
				risk_score: updatedIssue.score,
			},
		}).then(({ data }: any) => {
				if (data.response === 'error' || data.isAnError)
					throw new Error(
						data.message ?? 'An unexpected error has occurred',
					);

				toast.success('Successfully Added Issue...');
				return { updatedIssue };
			})
			.catch((error: Error) => {
				toast.error('An unexpected error has occurred on the server');
			});
	};

	const update = async () => {
		const companyID = getCompany();
		if (!companyID) {
			toast.error('User information was not found');
			return;
		}

		return fetchSave(companyID);
	};

	return { updatedIssue, isAddingIssue: isLoading, dispatch, update };
};
