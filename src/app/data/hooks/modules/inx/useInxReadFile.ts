import { useRef, useState } from 'react';
import { useFetcher } from '#commonHooks/useFetcher';

export const useInxReadFile = () => {
  const [fullDataLoading, setFullDataLoading] = useState<boolean>(false);
  const [fetcher] = useFetcher();
  const selectedResult = useRef<any>(null);
  const fileName = useRef<string>('');
  const fileType = useRef<string>('');
  const setSelectedResult = (updated: any) => {
    selectedResult.current = updated;
  };
  const readFile = (intel: any, companyID: string) => {
    setFullDataLoading(true);
    fetcher('post', {
      body: {
        model: 'modules/inx',
        ac: 'read',
        company_id: companyID,
        sid: intel.storageid,
        bid: intel.bucket,
      },
    })
      .then(({ data }: any) => {
        selectedResult.current = data;
        fileName.current = intel.name;
        fileType.current = intel.bucket;
      })
      .finally(() => setFullDataLoading(false));
  };

  return { fullDataLoading, selectedResult, fileName, fileType, setSelectedResult, readFile };
};
