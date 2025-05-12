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
import { useGlobalFastField, useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { DownloadsCard } from './DownloadsCard';

export const MobileSelectedDetails = ({ listSize }: { listSize: number }) => {
  const { data, isLoading, refetch } = useGetOneMobile();
  const onRefetch = () => refetch(selectedAppStored.get?.id);
  const { selectedApp: selectedAppStored, planPreference } = useGlobalFastFields([
    'selectedApp',
    'planPreference',
  ]);
  useEffect(() => {
    if (selectedAppStored.get) onRefetch();
    const downloads = selectedAppStored.get?.app_android_downloads;
    const cleaned = downloads?.replace?.(/&[A-Za-z]+;/g, '').replace(/[^\dKMkmBb.]/g, '');
    const match = cleaned?.match?.(/^([\d.]+)([KMkmBb])?$/);

    let number = parseFloat(match?.[1]);
    const unit = match?.[2]?.toUpperCase?.();
    if (unit === 'K') {
      number = number * 1000;
      if (number >= 15000) {
        planPreference.set('advanced');
      } else if (number >= 5000) {
        planPreference.set('medium');
      } else {
        planPreference.set('small');
      }
    } else if (unit === 'M') {
      planPreference.set('advanced');
    } else if (unit === 'B') {
      planPreference.set('advanced');
    } else {
      planPreference.set('medium');
    }
  }, [selectedAppStored.get, planPreference.get]);

  if (isLoading) {
    return <PageLoader />;
  }

  // Obtener los datos de la aplicación desde el estado seleccionado
  const appData = selectedAppStored.get || {};

  // Pasar todos los datos de descargas al componente
  const downloadsData = {
    total_downloads: selectedAppStored.get?.total_downloads,
    app_android_downloads: selectedAppStored.get?.app_android_downloads,
    app_ios_downloads: selectedAppStored.get?.app_ios_downloads,
  };

  return (
    <>
      <div>
        <AppCardInfo
          type={RESOURCE_CLASS.MOBILE}
          selectedApp={selectedAppStored.get}
          issueCount={appData.issues ? appData.issues.length : 0}
        />
        {/* Mostrar siempre la tarjeta de descargas */}
        <DownloadsCard appData={downloadsData} />
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
            plan={planPreference.get}
          />
        </div>
      </div>
      <VulnerabilityRisk vulnerabilityByRisk={data?.issues_share || {}} isLoading={isLoading} />
      {/* <section className="card table">
      
        <IssuesPanelMobileAndCloud isLoading={isLoading} issues={data?.issues || []} />
      </section> */}
    </>
  );
};
