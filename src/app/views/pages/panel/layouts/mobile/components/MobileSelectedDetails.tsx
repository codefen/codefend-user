import { useEffect } from 'react';
import { IssuesPanelMobileAndCloud } from '@/app/views/components/IssuesPanelMobileAndCloud/IssuesPanelMobileAndCloud';
import { AppCardInfo } from '@/app/views/components/AppCardInfo/AppCardInfo';
import { CredentialsModal } from '@modals/credentials/CredentialsModal.tsx';
import { ProvidedTestingCredentials } from '@/app/views/components/credential-card/ProvidedTestingCredentials';
import { VulnerabilityRisk } from '@/app/views/components/VulnerabilityRisk/VulnerabilityRisk';
import { VulnerabilitiesStatus } from '@/app/views/components/VulnerabilitiesStatus/VulnerabilitiesStatus';

import { PageLoader } from '@/app/views/components/loaders/Loader';
import { useGetOneMobile } from '@resourcesHooks/mobile/useGetOneMobile';
import { useSelectedApp } from '@resourcesHooks/global/useSelectedApp';
import { RESOURCE_CLASS } from '@/app/constants/app-texts';
import { OrderSection, ResourcesTypes } from '@interfaces/order';
import OpenOrderButton from '@/app/views/components/OpenOrderButton/OpenOrderButton';
import { useGlobalFastField } from '@/app/views/context/AppContextProvider';

export const MobileSelectedDetails = ({ listSize }: { listSize: number }) => {
  const { data, isLoading, refetch } = useGetOneMobile();
  const onRefetch = () => refetch(selectedAppStored.get?.id);
  const selectedAppStored = useGlobalFastField('selectedApp');
  useEffect(() => {
    // if (appSelected) onRefetch();
    if (selectedAppStored.get) onRefetch();
  }, [selectedAppStored.get]);
  // }, [appSelected]);

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <>
      <div>
        <AppCardInfo
          type={RESOURCE_CLASS.MOBILE}
          selectedApp={selectedAppStored.get}
          issueCount={data?.issues ? data.issues.length : 0}
        />
      </div>
      <div className="selected-content">
        {/* <div className="selected-content-credentials">
          <CredentialsModal onComplete={onRefetch} />
          <ProvidedTestingCredentials
            credentials={data?.creds || []}
            isLoading={isLoading}
            resourceId={selectedAppStored.get?.id || ''}
            type={RESOURCE_CLASS.MOBILE}
          />
        </div> */}
        <div className="selected-content-tables">
          {/* <VulnerabilityRisk isLoading={isLoading} vulnerabilityByRisk={data?.issueShare || {}} /> */}
          <VulnerabilitiesStatus vulnerabilityByShare={data?.issueCondition || {}} />

          <OpenOrderButton
            className="primary-full"
            type={ResourcesTypes.MOBILE}
            resourceCount={listSize}
            isLoading={isLoading}
            scope={OrderSection.MOBILE_SCOPE}
          />
        </div>
      </div>

      {/* <section className="card table">
      
        <IssuesPanelMobileAndCloud isLoading={isLoading} issues={data?.issues || []} />
      </section> */}
    </>
  );
};
