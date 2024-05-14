import { useState } from 'react';
import { toast } from 'react-toastify';
import { useParams } from 'react-router';
import { getTinyEditorContent } from '../../../../../editor-lib';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useUserData } from '#commonUserHooks/useUserData';
import { apiErrorValidation, companyIdIsNotNull } from '@/app/constants/validations';

export interface SaveIssue {
	issueName: string;
	score: string;
	issueClass: string;
	resourceID?: number;
}

export const useIssuesValidations = () => {
	const validateField = (value: string, message: string) => {
		if (!value.trim()) {
			toast.error(message);
			return false;
		}
		return true;
	};

	const validateNewIssue = (newIssue: SaveIssue, editorContent: string) => {
		if (!validateField(newIssue.score, 'Invalid risk score. Add a risk score to the issue')) return false;
		if (!validateField(newIssue.issueName, 'Invalid issue name. Add a name to the issue')) return false;
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

	return [validateNewIssue] as const;
};

/* Custom Hook "useSaveIssue" to handle saving an issue*/
export const useSaveIssue = () => {
	const { getUserdata, getCompany } = useUserData();
	const [fetcher,_, isLoading] = useFetcher();
	const [validateNewIssue] = useIssuesValidations();
	const [newIssue, setNewIssue] = useState<SaveIssue>({
		issueName: '',
		score: '',
		issueClass: "",
		resourceID: 0,
	});

	const fetchSave = async (companyID: string) => {
		const _editorContent = getTinyEditorContent('issue');

		if (!validateNewIssue(newIssue, _editorContent)) {
			return;
		}

		return fetcher<any>('post', {
			body: {
				model: 'issues/add',
				company_id: companyID,
				risk_score: newIssue.score,
				name: newIssue.issueName,
				resource_class: newIssue.issueClass,
				researcher_username: getUserdata().username,
				main_desc: _editorContent,
				resource_id: newIssue.resourceID ? newIssue.resourceID : undefined,
			},
		})
			.then(({ data }: any) => {
				if (data.isAnError || apiErrorValidation(data?.error, data?.response)) {
					throw new Error(
						'An unexpected error has occurred on the server',
					);
				}

				setNewIssue({
					issueName: '',
					score: '',
					issueClass: '',
				});
				toast.success('Successfully Added Issue...');

				return { id: data.new_issue.id };
			})
			.catch((error: Error) => {
				toast.error('An unexpected error has occurred on the server');
				return { error: 1 };
			});
	};

	const save = async () => {
		const companyID = getCompany();
		if (companyIdIsNotNull(companyID)) return;
		return fetchSave(companyID);
	};

	return {
		newIssue,
		isAddingIssue: isLoading,
		dispatch: setNewIssue,
		save,
	};
};
