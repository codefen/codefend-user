import { useEffect } from 'react';

import { IssuesPanelMobileAndCloud } from '@/app/views/components/IssuesPanelMobileAndCloud/IssuesPanelMobileAndCloud';
import { AppCardInfo } from '@/app/views/components/AppCardInfo/AppCardInfo';
import { CredentialsModal } from '@modals/credentials/CredentialsModal.tsx';
import { ProvidedTestingCredentials } from '@/app/views/components/credential-card/ProvidedTestingCredentials';
import { VulnerabilityRisk } from '@/app/views/components/VulnerabilityRisk/VulnerabilityRisk';
import { VulnerabilitiesStatus } from '@/app/views/components/VulnerabilitiesStatus/VulnerabilitiesStatus';

import { PageLoader } from '@/app/views/components/loaders/Loader';
import { useGetOneCloud } from '@resourcesHooks/cloud/useGetOneCloud';
import { RESOURCE_CLASS } from '@/app/constants/app-texts';
import OpenOrderButton from '@/app/views/components/OpenOrderButton/OpenOrderButton';
import { ResourcesTypes } from '@interfaces/order';

export const CloudSelectedDetails = ({ listSize }: { listSize: number }) => {
  //const _userRoles = useUserRole();
  // const { appSelected } = useSelectedApp();
  const { data, isLoading, refetch } = useGetOneCloud();
  //const _orderSavedData = useOrderStore(state => state);

  // const onRefetch = () => refetch(appSelected?.id);
  // useEffect(() => {
  //   if (appSelected) onRefetch();
  // }, [appSelected]);

  if (!isLoading) {
    return (
      <>
        {/* <CredentialsModal onComplete={onRefetch} /> */}
        <CredentialsModal onComplete={() => {}} />
        <div>
          <AppCardInfo
            // selectedApp={appSelected || {}}
            selectedApp={{}}
            type={RESOURCE_CLASS.CLOUD}
            issueCount={data?.issues ? data.issues.length : 0}
          />
        </div>
        <div className="selected-content">
          <div className="selected-content-credentials">
            <ProvidedTestingCredentials
              credentials={data?.creds || []}
              isLoading={isLoading}
              resourceId={''}
              // resourceId={appSelected?.id || ''}
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
