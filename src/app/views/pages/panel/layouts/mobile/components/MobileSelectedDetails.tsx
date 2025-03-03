import { useEffect } from 'react';
import { IssuesPanelMobileAndCloud } from '@standalones/IssuesPanelMobileAndCloud.tsx';
import { AppCardInfo } from '@standalones/AppCardInfo.tsx';
import { CredentialsModal } from '@modals/credentials/CredentialsModal.tsx';
import { ProvidedTestingCredentials } from '@standalones/credential-card/ProvidedTestingCredentials';
import { VulnerabilityRisk } from '@standalones/VulnerabilityRisk.tsx';
import { VulnerabilitiesStatus } from '@standalones/VulnerabilitiesStatus.tsx';

import { PageLoader } from '@/app/components/loaders/Loader';
import { useGetOneMobile } from '@resourcesHooks/mobile/useGetOneMobile';
import { useSelectedApp } from '@resourcesHooks/useSelectedApp';
import { RESOURCE_CLASS } from '@/app/constants/app-texts';
import { ResourcesTypes } from '@interfaces/order';
import OpenOrderButton from '@standalones/OpenOrderButton';

export const MobileSelectedDetails = ({ listSize }: { listSize: number }) => {
  const { data, isLoading, refetch } = useGetOneMobile();
  const { appSelected } = useSelectedApp();
  const onRefetch = () => refetch(appSelected?.id);
  useEffect(() => {
    if (appSelected) onRefetch();
  }, [appSelected]);

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <>
      <div>
        <AppCardInfo
          type={RESOURCE_CLASS.MOBILE}
          selectedApp={appSelected}
          issueCount={data?.issues ? data.issues.length : 0}
        />
      </div>
      <div className="selected-content">
        <div className="selected-content-credentials">
          <CredentialsModal onComplete={onRefetch} />
          <ProvidedTestingCredentials
            credentials={data?.creds || []}
            isLoading={isLoading}
            resourceId={appSelected?.id || ''}
            type={RESOURCE_CLASS.MOBILE}
          />
        </div>
        <div className="selected-content-tables">
          <OpenOrderButton
            className="primary-full"
            type={ResourcesTypes.MOBILE}
            resourceCount={listSize}
            isLoading={isLoading}
          />

          <VulnerabilityRisk isLoading={isLoading} vulnerabilityByRisk={data?.issueShare || {}} />
          <VulnerabilitiesStatus vulnerabilityByShare={data?.issueCondition || {}} />
        </div>
      </div>

      <section className="card table">
        <IssuesPanelMobileAndCloud isLoading={isLoading} issues={data?.issues || []} />
      </section>
    </>
  );
};
