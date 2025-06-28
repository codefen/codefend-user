import { useEffect, useRef, useState } from 'react';
import { WebApplicationResources } from './components/WebApplicationResources.tsx';
import { WebApplicationStatics } from './components/WebApplicationStatics.tsx';
import { WebApplicationTitle } from './components/WebApplicationTitle.tsx';
import { useShowScreen } from '#commonHooks/useShowScreen.ts';
import { useGetWebResources } from '@resourcesHooks/web/useGetWebResources.ts';
import { CredentialsModal } from '@modals/credentials/CredentialsModal.tsx';
import { ServerGeolocationMap } from '@/app/views/components/ServerGeolocationMap/ServerGeolocationMap.tsx';
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
  const { webResources, isLoading, refetch, domainCount, subDomainCount, uniqueIpCount, appEvent, mapResources } =
    useGetWebResourcesv2();
  const [showScreen] = useShowScreen();
  const flashlight = useFlashlight();

  // --- Lógica para expandir la sección derecha si hay scroll ---
  const rightSectionRef = useRef<HTMLElement>(null);
  const [expandOnScroll, setExpandOnScroll] = useState(false);

  useEffect(() => {
    const el = rightSectionRef.current;
    if (el) {
      setExpandOnScroll(el.scrollHeight > el.clientHeight + 2); // +2 por tolerancia de borde
    }
  }, [webResources, isLoading]);
  // ------------------------------------------------------------

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
      <section className={`right${expandOnScroll ? ' expand-on-scroll' : ''}`} ref={el => {
        rightSectionRef.current = el;
        flashlight.rightPaneRef.current = el;
      }}>
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
        <ServerGeolocationMap
          networkData={webResources}
          resourceType={RESOURCE_CLASS.WEB}
          title="Global server distribution"
          mapResources={mapResources}
        />
      </section>
    </EmptyLayout>
  );
};

export default WebApplicationView;
