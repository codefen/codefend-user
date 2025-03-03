import { useEffect } from 'react';

import { IssuesPanelMobileAndCloud } from '@standalones/IssuesPanelMobileAndCloud.tsx';
import { AppCardInfo } from '@standalones/AppCardInfo.tsx';
import { CredentialsModal } from '@modals/credentials/CredentialsModal.tsx';
import { ProvidedTestingCredentials } from '@standalones/credential-card/ProvidedTestingCredentials';
import { VulnerabilityRisk } from '@standalones/VulnerabilityRisk.tsx';
import { VulnerabilitiesStatus } from '@standalones/VulnerabilitiesStatus.tsx';

import { PageLoader } from '@/app/components/loaders/Loader';
import { useSelectedApp } from '@resourcesHooks/useSelectedApp';
import { useGetOneCloud } from '@resourcesHooks/cloud/useGetOneCloud';
import { RESOURCE_CLASS } from '@/app/constants/app-texts';
import OpenOrderButton from '@standalones/OpenOrderButton';
import { ResourcesTypes } from '@interfaces/order';

export const CloudSelectedDetails = ({ listSize }: { listSize: number }) => {
  //const _userRoles = useUserRole();
  const { appSelected } = useSelectedApp();
  const { data, isLoading, refetch } = useGetOneCloud();
  //const _orderSavedData = useOrderStore(state => state);

  const onRefetch = () => refetch(appSelected?.id);
  useEffect(() => {
    if (appSelected) onRefetch();
  }, [appSelected]);

  if (!isLoading) {
    return (
      <>
        <CredentialsModal onComplete={onRefetch} />
        <div>
          <AppCardInfo
            selectedApp={appSelected || {}}
            type={RESOURCE_CLASS.CLOUD}
            issueCount={data?.issues ? data.issues.length : 0}
          />
        </div>
        <div className="selected-content">
          <div className="selected-content-credentials">
            <ProvidedTestingCredentials
              credentials={data?.creds || []}
              isLoading={isLoading}
              resourceId={appSelected?.id || ''}
              type={RESOURCE_CLASS.CLOUD}
            />
          </div>
          <div className="selected-content-tables">
            <OpenOrderButton
              className="primary-full"
              type={ResourcesTypes.CLOUD}
              resourceCount={listSize}
              isLoading={isLoading}
            />
            <VulnerabilityRisk
              isLoading={isLoading}
              vulnerabilityByRisk={data?.issues_share || {}}
            />
            <VulnerabilitiesStatus vulnerabilityByShare={data?.issues_condicion || {}} />
          </div>
        </div>

        <section className="card table">
          <IssuesPanelMobileAndCloud isLoading={isLoading} issues={data?.issues || []} />
        </section>
      </>
    );
  } else {
    return <PageLoader />;
  }
};
