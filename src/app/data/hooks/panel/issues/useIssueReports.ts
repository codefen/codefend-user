import { useRef, useState } from 'react';
import { mapIssueShareV2, mapMobileApp, mapCloudApp, mapReportIssues } from '@utils/mapper';
import { useUserData } from '#commonUserHooks/useUserData';
import { useFetcher } from '#commonHooks/useFetcher';
import { apiErrorValidation, companyIdIsNull } from '@/app/constants/validations';
import { RESOURCE_CLASS } from '@/app/constants/app-texts';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { useOrderStore } from '@stores/orders.store';
import { OrderSection, RESOURCE_PATH_TO_TYPE, ResourcesTypes } from '@interfaces/order';

export const useIssueReport = () => {
  const resources = useRef<any>(null);
  const issues = useRef<any>(null);
  const [share, setShare] = useState<any>(null);
  const [resourceDomainText, setDomainText] = useState('');
  const [fetcher] = useFetcher();

  const { getCompany } = useUserData();
  const { resourceID, resourceType, openModal } = useGlobalFastFields([
    'resourceID',
    'resourceType',
    'openModal',
  ]);
  const { updateState } = useOrderStore();

  const getReport = (companyID: string, issueID: string, resourceType: string) => {
    return fetcher('post', {
      body: {
        company_id: companyID,
        resource_id: issueID,
        resource_class: resourceType,
      },
      path: 'issues/inform',
    }).then(({ data }: any) => {
      if (apiErrorValidation(data?.error)) {
        openModal.set(false);
        updateState('open', true);
        updateState('orderStepActive', OrderSection.PAYWALL);
        updateState(
          'resourceType',
          RESOURCE_PATH_TO_TYPE[resourceType as keyof typeof RESOURCE_PATH_TO_TYPE]
        );
        return;
      }
      issues.current = data.issues ? data.issues.map((issue: any) => mapReportIssues(issue)) : [];

      setShare(mapIssueShareV2(data));
      if (resourceType === RESOURCE_CLASS.WEB) {
        resources.current = [data.resource];
      } else if (resourceType === RESOURCE_CLASS.MOBILE) {
        resources.current = mapMobileApp(data.resource);
      } else if (resourceType === RESOURCE_CLASS.CLOUD) {
        resources.current = mapCloudApp(data.resource);
      } else if (resourceType === 'lan') {
        resources.current = [data.resource];
      } else if (resourceType === RESOURCE_CLASS.SOURCE || resourceType === RESOURCE_CLASS.SOCIAL) {
        resources.current = data?.resource || {};
      }

      if (resources.current) {
        if (resourceType === RESOURCE_CLASS.WEB) {
          setDomainText(resources.current[0].resource_domain);
        } else if (
          resourceType === RESOURCE_CLASS.MOBILE ||
          resourceType === RESOURCE_CLASS.CLOUD
        ) {
          setDomainText(resources.current.appName);
        } else if (resourceType === 'lan') {
          setDomainText(resources.current[0].device_ex_address);
        } else if (resourceType === RESOURCE_CLASS.SOURCE) {
          setDomainText(resources.current.name);
        } else if (resourceType === RESOURCE_CLASS.SOCIAL) {
          //setDomainText(`${resources.current.member_fname}  ${resources.current.member_lname}`);
          setDomainText(`Some Name`);
        }
      }

      return data;
    });
  };

  const fetchReport = () => {
    const companyID = getCompany();
    if (companyIdIsNull(companyID)) return Promise.resolve(false);

    return getReport(companyID, resourceID.get, resourceType.get);
  };

  return {
    fetchReport,
    resourceDomainText,
    resources: resources.current,
    issues: issues.current,
    share,
  };
};
