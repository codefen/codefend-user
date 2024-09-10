import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useRef, useState } from 'react';
import { useUserData } from '#commonUserHooks/useUserData';
import { companyIdIsNull } from '@/app/constants/validations';

export const useEnpGetVulns = () => {
  const { getCompany } = useUserData();
  const [fetcher, _, isLoading] = useFetcher();
  const dataRef = useRef<any[]>([]);
  const selectedEndpointRef = useRef<any>();
  const [vulnFilter, setVulnFilter] = useState({
    type: 'p',
    order: 1,
  });

  const fetchEnd = async (code_name: string, application_name: string, companyID: string) => {
    fetcher('post', {
      body: {
        model: 'modules/vdb_new',
        ac: 'search',
        keyword: code_name,
        fullname: application_name,
        company_id: companyID,
      },
    }).then(({ data }: any) => {
      if (data.length && data[0].id) {
        dataRef.current = data;
      } else {
        dataRef.current = [];
      }
    });
  };

  const refetch = async () => {
    const companyID = getCompany();
    if (companyIdIsNull(companyID)) return;
    fetchEnd(
      selectedEndpointRef.current?.code_name,
      selectedEndpointRef.current?.application_name,
      companyID
    );
  };

  const setSelectedEndpoint = (updated: any) => {
    selectedEndpointRef.current = updated;
  };
  const setVuln = (updated: any) => {
    dataRef.current = updated;
  };

  return {
    vuln: dataRef.current,
    selectedEndpoint: selectedEndpointRef.current,
    vulnFilter,
    setVulnFilter,
    setSelectedEndpoint,
    setVuln,
    refetch,
  };
};
