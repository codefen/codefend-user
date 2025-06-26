import { useEffect } from 'react';
import { WebApplicationResources } from './components/WebApplicationResources.tsx';
import { WebApplicationStatics } from './components/WebApplicationStatics.tsx';
import { WebApplicationTitle } from './components/WebApplicationTitle.tsx';
import { useShowScreen } from '#commonHooks/useShowScreen.ts';
import { useGetWebResources } from '@resourcesHooks/web/useGetWebResources.ts';
import { CredentialsModal } from '@modals/credentials/CredentialsModal.tsx';
import { ResourceByLocation } from '@/app/views/components/ResourceByLocation/ResourceByLocation.tsx';
import { RESOURCE_CLASS, webEmptyScreen } from '@/app/constants/app-texts.ts';
import EmptyLayout from '../EmptyLayout.tsx';
import OpenOrderButton from '@/app/views/components/OpenOrderButton/OpenOrderButton.tsx';
import { ResourcesTypes } from '@interfaces/order.ts';
import { useFlashlight } from '@/app/views/context/FlashLightContext.tsx';
import { DeleteWebResourceModal } from '@modals/delete-modals/DeleteWebResourceModal.tsx';
import AddDomainModal from '@modals/adding-modals/AddDomainModal.tsx';
import AddSubDomainModal from '@modals/adding-modals/AddSubDomainModal.tsx';
import { APP_EVENT_TYPE } from '@interfaces/panel.ts';
import { getCompanyAllMetrics } from '@utils/metric.service.ts';
import './webapplication.scss';
import { useInitialDomainStore } from '@stores/initialDomain.store.ts';
import { useGetWebResourcesv2 } from '@resourcesHooks/web/useGetWebResourcesv2.ts';

const WebApplicationView = () => {
  const { webResources, isLoading, refetch, domainCount, subDomainCount, uniqueIpCount, appEvent } =
    useGetWebResourcesv2();
  const [showScreen] = useShowScreen();
  const flashlight = useFlashlight();

  return (
    <EmptyLayout
      className="webapp"
      fallback={webEmptyScreen}
      event={refetch}
      showScreen={showScreen}
      isLoading={isLoading}
      dataAvailable={Boolean(webResources?.length)}>
      {/* *****MODALES WEB PAGE ***** */}
      <CredentialsModal />
      <DeleteWebResourceModal />
      <AddDomainModal appEvent={appEvent} />
      <AddSubDomainModal webResources={webResources} />
      {/* <div className="brightness variant-1"></div> */}

      {/* *****SECTION LEFT WEB PAGE ***** */}
      <section className="left">
        <WebApplicationResources isLoading={isLoading} webResources={webResources} />
      </section>

      {/* *****SECTION RIGHT WEB PAGE ***** */}
      <section className="right" ref={flashlight.rightPaneRef}>
        <WebApplicationTitle isLoading={isLoading} />
        <WebApplicationStatics
          domainCount={domainCount.get}
          subDomainCount={subDomainCount.get}
          uniqueIpCount={uniqueIpCount.get}
        />
        <OpenOrderButton
          className="pentest-btn"
          type={ResourcesTypes.WEB}
          resourceCount={webResources.length}
          isLoading={isLoading}
        />
        <ResourceByLocation
          isLoading={isLoading}
          resource={webResources}
          title="Web servers by location"
          type={RESOURCE_CLASS.WEB}
        />
      </section>
    </EmptyLayout>
  );
};

export default WebApplicationView;
