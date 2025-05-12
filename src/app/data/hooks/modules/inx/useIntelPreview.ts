import { useRef } from 'react';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { apiErrorValidation, companyIdIsNull } from '@/app/constants/validations';

export const useIntelPreview = () => {
  const [fetcher, cancelRequest, isLoading] = useFetcher();
  const intelPreview = useRef<any[]>([]);
  const setIntelPreview = (updated: any) => {
    intelPreview.current = updated;
  };

  const fetchPreview = async (params: any, companyID: string) => {
    return fetcher('post', {
      body: {
        ac: 'preview',
        company_id: companyID,
        ...params,
      },
      path: 'modules/inx',
      requestId: `p-${params.sid}-${params.bid}`,
    }).then(({ data }: any) => {
      if (apiErrorValidation(data)) return false;

      const intelPreviewData = intelPreview.current;
      intelPreviewData.push({
        id: params.sid,
        preview: data,
      });
      setIntelPreview(intelPreviewData);
      return true;
    });
  };

  const refetchPreview = (params: any, companyID: string) => {
    if (companyIdIsNull(companyID)) return;
    return fetchPreview(params, companyID);
  };

  return {
    intelPreview: intelPreview.current,
    isLoadingPreview: isLoading,
    setIntelPreview,
    refetchPreview,
    cancelRequest,
  };
};
