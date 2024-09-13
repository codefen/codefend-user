import React, { useEffect } from 'react';
import { IssuesPanelMobileAndCloud } from '@standalones/IssuesPanelMobileAndCloud.tsx';
import { AppCardInfo } from '@standalones/AppCardInfo.tsx';
import { CredentialsModal } from '@modals/credentials/CredentialsModal.tsx';
import { ProvidedTestingCredentials } from '@standalones/credential-card/ProvidedTestingCredentials';
import { VulnerabilityRisk } from '@standalones/VulnerabilityRisk.tsx';
import { VulnerabilitiesStatus } from '@standalones/VulnerabilitiesStatus.tsx';

import { useOrderStore } from '@stores/orders.store.ts';

import { PrimaryButton } from '@buttons/primary/PrimaryButton.tsx';
import Show from '@defaults/Show.tsx';
import { PageLoader } from '@defaults/loaders/Loader.tsx';
import { useUserRole } from '#commonUserHooks/useUserRole.ts';
import { useGetOneMobile } from '@resourcesHooks/mobile/useGetOneMobile';
import { useSelectedApp } from '@resourcesHooks/useSelectedApp';
import { RESOURCE_CLASS } from '@/app/constants/app-texts';

export const MobileSelectedDetails: React.FC = props => {
  const { isAdmin, isNormalUser } = useUserRole();
  const { data, isLoading, refetch } = useGetOneMobile();
  const { appSelected } = useSelectedApp();
  const { updateState, setScopeTotalResources } = useOrderStore(state => state);
  const onRefetch = () => refetch(appSelected?.id);
  useEffect(() => {
    if (appSelected) onRefetch();
  }, [appSelected]);

  if (isLoading) {
    return <PageLoader />;
  }

  const onOpenOrder = () => {
    updateState('open', true);
    setScopeTotalResources(1);
  };

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
          <Show when={isAdmin() || isNormalUser()}>
            <PrimaryButton
              text="START A PENTEST ON DEMAND"
              click={onOpenOrder}
              className="primary-full"
            />
          </Show>

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
