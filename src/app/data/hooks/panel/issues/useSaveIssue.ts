import { useState } from 'react';
import { toast } from 'react-toastify';
import { getTinyEditorContent } from '../../../../../editor-lib';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useUserData } from '#commonUserHooks/useUserData';
import { apiErrorValidation, companyIdIsNull } from '@/app/constants/validations';
import { APP_MESSAGE_TOAST, ISSUE_PANEL_TEXT } from '@/app/constants/app-toast-texts';
import { RESOURCE_CLASS } from '@/app/constants/app-texts';

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
		if (!validateField(newIssue.score, ISSUE_PANEL_TEXT.EMPTY_ISSUE_RISK)) return false;
		if (!validateField(newIssue.issueName, ISSUE_PANEL_TEXT.EMPTY_ISSUE_NAME)) return false;
		if (
			![
				RESOURCE_CLASS.WEB,
				RESOURCE_CLASS.MOBILE,
				RESOURCE_CLASS.CLOUD,
				'lan',
				RESOURCE_CLASS.SOURCE,
				RESOURCE_CLASS.SOCIAL,
				RESOURCE_CLASS.RESEARCH,
			].includes(newIssue.issueClass)
		) {
			toast.error(ISSUE_PANEL_TEXT.EMPTY_ISSUE_CLASS);
			return false;
		}
		if (
			!validateField(
				editorContent,
				ISSUE_PANEL_TEXT.EMPTY_ISSUE_CONT
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
						APP_MESSAGE_TOAST.API_UNEXPECTED_ERROR
					);
				}

				setNewIssue({
					issueName: '',
					score: '',
					issueClass: '',
				});
				toast.success(ISSUE_PANEL_TEXT.ADD_ISSUE);

				return { id: data.new_issue.id };
			})
			.catch((e: Error) => {
				toast.error(e.message);
				return { error: 1 };
			});
	};

	const save = async () => {
		const companyID = getCompany();
		if (companyIdIsNull(companyID)) return;
		return fetchSave(companyID);
	};

	return {
		newIssue,
		isAddingIssue: isLoading,
		dispatch: setNewIssue,
		save,
	};
};
