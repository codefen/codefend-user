import { useCallback, useState } from 'react';
import { useAuthState } from '../../../';
import { IssueService } from '../../../services/panel/issues.service';
import { getTinyEditorContent } from '../../../../../editor-lib';
import { toast } from 'react-toastify';

export interface SaveIssue {
	issueName: string;
	score: string;
	issueClass: string;
	isAddingIssue: boolean;
}

const validateNewIssue = (validate: boolean, message: string) => {
	if (validate) {
		toast.error(message);
		return false;
	}
	return true;
};

export const useSaveIssue = () => {
	const { getUserdata } = useAuthState();
	const [newIssue, dispatch] = useState<SaveIssue>({
		issueName: '',
		score: '',
		issueClass: '',

		isAddingIssue: false,
	});

	const fetchSave = useCallback(
		(companyID: string) => {
			const _editorContent = getTinyEditorContent('issue');
			if (
				!validateNewIssue(
					!_editorContent.trim(),
					'Invalid content, please add content using the editor',
				)
			) {
				return;
			}
			if (!validateNewIssue(!newIssue.score.trim(), 'Invalid score')) {
				return;
			}

			if (
				!validateNewIssue(
					!newIssue.issueName.trim() || newIssue.issueName.length > 100,
					'Invalid name',
				)
			) {
				return;
			}

			if (
				!validateNewIssue(
					![
						'web',
						'mobile',
						'cloud',
						'lan',
						'source',
						'social',
						'research',
					].includes(newIssue.issueClass),
					'Invalid issue type',
				)
			) {
				return;
			}

			dispatch((state: SaveIssue) => ({
				...state,
				isAddingIssue: true,
			}));
			const params = {
				risk_score: newIssue.score,
				name: newIssue.issueName,
				resource_class: newIssue.issueClass,
				researcher_username: getUserdata()?.username,
				main_desc: _editorContent,
			};
			return IssueService.add(params, companyID)
				.then((response: any) => {
					if (response.response === 'error') {
						throw new Error(response.message);
					}
					dispatch({
						issueName: '',
						score: '',
						issueClass: '',
						isAddingIssue: false,
					});
					toast.success('Successfully Added Issue...');

					return { id: response.new_issue.id };
				})
				.catch((error: Error) => {
					toast.error(error.message);
				})
				.finally(() =>
					dispatch((state: SaveIssue) => ({
						...state,
						isAddingIssue: false,
					})),
				);
		},
		[newIssue],
	);

	const save = async () => {
		const companyID = getUserdata()?.companyID;
		if (!companyID) {
			toast.error('User information was not found');
			return;
		}
		return fetchSave(companyID);
	};

	return { newIssue, dispatch, save };
};
