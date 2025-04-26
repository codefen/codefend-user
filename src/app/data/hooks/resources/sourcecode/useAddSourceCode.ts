import { toast } from 'react-toastify';

import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useUserData } from '#commonUserHooks/useUserData';
import { apiErrorValidation, companyIdIsNull, isNotEmpty } from '@/app/constants/validations';
import { useRef } from 'react';
import { APP_MESSAGE_TOAST, SOURCE_PANEL_TEXT } from '@/app/constants/app-toast-texts';

const validations = (
  repositoryName: string,
  repositoryUrl: string,
  sourceCode: string,
  visibility: string
) => {
  if (!isNotEmpty(repositoryName) || repositoryName.length > 150) {
    toast.error(SOURCE_PANEL_TEXT.EMPTY_NAME);
    return true;
  }

  if (!isNotEmpty(repositoryUrl)) {
    toast.error(SOURCE_PANEL_TEXT.EMPTY_REPOSITORY_URL);
    return true;
  }

  if (!isNotEmpty(sourceCode) || sourceCode.length > 40) {
    toast.error(SOURCE_PANEL_TEXT.EMPTY_SOURCE_CODE_LANGUAGE);
    return true;
  }

  if (!isNotEmpty(visibility)) {
    toast.error(SOURCE_PANEL_TEXT.EMPTY_REPO_VISIBILITY);
    return true;
  }
  return false;
};

export const useAddSourceCode = () => {
  const { getCompany } = useUserData();
  const [fetcher, _, isLoading] = useFetcher(true);
  const repositoryName = useRef<HTMLInputElement>(null);
  const repositoryUrl = useRef<HTMLInputElement>(null);
  const sourceCode = useRef<HTMLInputElement>(null);
  const visibility = useRef<HTMLSelectElement>(null);

  const fetchAdd = (params: any, companyID: string) => {
    return fetcher('post', {
      body: {
        company_id: companyID,
        ...params,
      },
      path: 'resources/source/add',
    })
      .then(({ data }: any) => {
        if (apiErrorValidation(data?.error, data?.response)) {
          throw new Error(APP_MESSAGE_TOAST.API_UNEXPECTED_ERROR);
        }
        toast.success(SOURCE_PANEL_TEXT.ADD_SOURCE);
      })
      .catch((e: Error) => {
        toast.error(e.message);
      });
  };

  const addSourceCode = () => {
    const companyID = getCompany();
    const name = repositoryName.current?.value || '';
    const access_link = repositoryUrl.current?.value || '';
    const source_code = sourceCode.current?.value || '';
    const is_public = visibility.current?.value || '';
    if (companyIdIsNull(companyID) || validations(name, access_link, source_code, is_public))
      return Promise.reject(false);

    const requestParams = {
      name,
      access_link,
      source_code,
      is_public: is_public === 'public' ? 'yes' : 'no',
    };
    return fetchAdd(requestParams, companyID);
  };
  return { isLoading, addSourceCode, repositoryName, repositoryUrl, sourceCode, visibility };
};
