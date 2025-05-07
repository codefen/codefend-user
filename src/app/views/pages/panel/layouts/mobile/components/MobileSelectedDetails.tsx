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
import { DownloadsCard } from './DownloadsCard';

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

  // Obtener los datos de la aplicación desde la API o del estado seleccionado
  const appData = data || selectedAppStored.get || {};

  // Mostrar todos los datos disponibles para depuración
  console.log('=== DATOS DE LA APLICACIÓN ===');
  console.log('Datos completos de la API (data):', data);
  console.log('Datos completos del estado (selectedAppStored.get):', selectedAppStored.get);
  console.log('Datos combinados (appData):', appData);

  // Verificar propiedades específicas en ambos objetos
  console.log('--- Datos de la API ---');
  console.log('data?.app_android_downloads:', data?.app_android_downloads);
  console.log('data?.downloads:', data?.downloads);
  console.log('data?.app_rank:', data?.app_rank);

  console.log('--- Datos del estado ---');
  console.log(
    'selectedAppStored.get?.app_android_downloads:',
    selectedAppStored.get?.app_android_downloads
  );
  console.log('selectedAppStored.get?.downloads:', selectedAppStored.get?.downloads);
  console.log('selectedAppStored.get?.app_rank:', selectedAppStored.get?.app_rank);

  console.log('--- Datos combinados ---');
  console.log('appData.app_android_downloads:', appData.app_android_downloads);
  console.log('appData.downloads:', appData.downloads);
  console.log('appData.app_rank:', appData.app_rank);
  console.log('==============================');

  // Obtener las descargas, buscando en diferentes propiedades posibles
  const getDownloadCount = () => {
    // Verificar en la respuesta de la API (data.unico)
    if (data?.unico?.app_android_downloads) return data.unico.app_android_downloads;
    if (data?.unico?.downloads) return data.unico.downloads;

    // Verificar en el objeto data directo
    if (data?.app_android_downloads) return data.app_android_downloads;
    if (data?.downloads) return data.downloads;

    // Verificar en el estado seleccionado
    if (selectedAppStored.get?.app_android_downloads)
      return selectedAppStored.get.app_android_downloads;
    if (selectedAppStored.get?.downloads) return selectedAppStored.get.downloads;

    // Si no hay datos, devolver 0
    return '0';
  };

  const downloadsData = {
    total_downloads: getDownloadCount(),
  };

  console.log('=== DATOS DE DESCARGAS ===');
  console.log('Datos de descargas a mostrar:', downloadsData);
  console.log('Datos completos de la API (data.unico):', data?.unico);
  console.log('Datos directos (data):', data);
  console.log('Datos del estado (selectedAppStored.get):', selectedAppStored.get);
  console.log('==========================');

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
