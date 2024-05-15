import { toast } from 'react-toastify';

import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useUserData } from '#commonUserHooks/useUserData';
import {
	apiErrorValidation,
	companyIdIsNotNull,
	isNotEmpty,
} from '@/app/constants/validations';
import { useState } from 'react';

interface RepositoryModel {
	repositoryName: string;
	repositoryUrl: string;
	sourceCode: string;
	visibility: string;
}

export const useAddSourceCode = () => {
	const { getCompany } = useUserData();
	const [fetcher, _, isLoading] = useFetcher(true);

	const [sourceCodeForm, setSourceCode] = useState<RepositoryModel>({
		repositoryName: '',
		repositoryUrl: '',
		sourceCode: '',
		visibility: '',
	});

	const validations = () => {
		const { repositoryName, repositoryUrl, sourceCode, visibility } =
			sourceCodeForm;
		if (!isNotEmpty(repositoryName) || repositoryName.length > 150) {
			toast.error('Invalid name');

			return true;
		}

		if (!isNotEmpty(repositoryUrl)) {
			toast.error('Invalid url');

			return true;
		}

		if (!isNotEmpty(sourceCode) || sourceCode.length > 40) {
			toast.error('Invalid language');

			return true;
		}

		if (!isNotEmpty(visibility)) {
			toast.error('Select visibility');
			return true;
		}
		return false;
	};

	const fetchAdd = (params: any, companyID: string) => {
		return fetcher('post', {
			body: {
				model: 'resources/source',
				ac: 'add',
				company_id: companyID,
				...params,
			},
		})
			.then(({ data }: any) => {
				if (apiErrorValidation(data?.error, data?.response)) {
					throw new Error('');
				}
				toast.success('Successfully repository is added');
			})
			.catch(() => {
				toast.error('An error has occurred on the server');
			});
	};

	const addSourceCode = () => {
		const companyID = getCompany();
		if (companyIdIsNotNull(companyID)) return Promise.reject(false);
		if(validations())return Promise.reject(false);
		
		const requestParams = {
			name: sourceCodeForm.repositoryName,
			access_link: sourceCodeForm.repositoryUrl,
			source_code: sourceCodeForm.sourceCode,
			is_public: sourceCodeForm.visibility === 'public' ? 'yes' : 'no',
		};
		return fetchAdd(requestParams, companyID);
	};
	return [sourceCodeForm, { isAddingSource:isLoading, addSourceCode, setSourceCode }] as const;
};
