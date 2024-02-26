import { useCallback, useState } from 'react';
import { useAuthState } from '../../../';
import { IssueService } from '../../../services/panel/issues.service';
import { getTinyEditorContent } from '../../../../../editor-lib';
import { toast } from 'react-toastify';
import { useParams } from 'react-router';

export interface SaveIssue {
	issueName: string;
	score: string;
	issueClass: string;
	isAddingIssue: boolean;
}

export const useSaveIssue = () => {
	const { getUserdata } = useAuthState();
	const { type } = useParams();
	console.log({ type });
	const [newIssue, setNewIssue] = useState<SaveIssue>({
		issueName: '',
		score: '',
		issueClass: [
			'web',
			'mobile',
			'cloud',
			'lan',
			'source',
			'social',
			'research',
		].includes(type ?? '')
			? (type as string)
			: '',
		isAddingIssue: false,
	});

	const validateField = (value: string, message: string) => {
		if (!value.trim()) {
			toast.error(message);
			return false;
		}
		return true;
	};

	const validateNewIssue = (editorContent: string) => {
		if (!validateField(newIssue.score, 'Invalid score')) return false;
		if (!validateField(newIssue.issueName, 'Invalid name')) return false;
		if (
			![
				'web',
				'mobile',
				'cloud',
				'lan',
				'source',
				'social',
				'research',
			].includes(newIssue.issueClass)
		) {
			toast.error('Invalid issue type');
			return false;
		}
		if (
			!validateField(
				editorContent,
				'Invalid content, please add content using the editor',
			)
		)
			return false;
		return true;
	};

	const fetchSave = async (companyID: string) => {
		const _editorContent = getTinyEditorContent('issue');

		if (!validateNewIssue(_editorContent)) {
			return;
		}
		setNewIssue((prevIssue) => ({ ...prevIssue, isAddingIssue: true }));

		const params = {
			risk_score: newIssue.score,
			name: newIssue.issueName,
			resource_class: newIssue.issueClass,
			researcher_username: getUserdata()?.username,
			main_desc: _editorContent,
		};

		return IssueService.add(params, companyID)
			.then((response: any) => {
				console.log({ response });
				if (response.response === 'error') {
					throw new Error(
						'An unexpected error has occurred on the server',
					);
				}
				setNewIssue({
					issueName: '',
					score: '',
					issueClass: '',
					isAddingIssue: false,
				});
				toast.success('Successfully Added Issue...');

				return { id: response.new_issue.id };
			})
			.catch((error: Error) => {
				toast.error('An unexpected error has occurred on the server');
				return { error: 1 };
			})
			.finally(() =>
				setNewIssue((state: SaveIssue) => ({
					...state,
					isAddingIssue: false,
				})),
			);
	};

	const save = async () => {
		const companyID = getUserdata()?.companyID;
		if (!companyID) {
			toast.error('User information was not found');
			return;
		}
		return fetchSave(companyID);
	};

	const shouldDisableClass = Boolean(type && newIssue.issueClass);

	return { newIssue, dispatch: setNewIssue, save, shouldDisableClass, type };
};
