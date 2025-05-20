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
import { useGlobalFastField } from '@/app/views/context/AppContextProvider.tsx';
import AddDomainModal from '@modals/adding-modals/AddDomainModal.tsx';
import AddSubDomainModal from '@modals/adding-modals/AddSubDomainModal.tsx';
import './webapplication.scss';
import { APP_EVENT_TYPE } from '@interfaces/panel.ts';

const WebApplicationView = () => {
  const [showScreen, control, refresh] = useShowScreen();
  const { webResources, isLoading, refetch } = useGetWebResources();
  const flashlight = useFlashlight();
  const appEvent = useGlobalFastField('appEvent');

  useEffect(() => {
    refetch();
  }, [control]);

  useEffect(() => {
    if (
      appEvent.get != APP_EVENT_TYPE.NOTIFICATION &&
      appEvent.get != APP_EVENT_TYPE.SCAN_FINISHED &&
      appEvent.get != APP_EVENT_TYPE.SCAN_LAUNCHED &&
      appEvent.get != APP_EVENT_TYPE.LAUNCH_SCAN
    ) {
      refresh();
      appEvent.set(APP_EVENT_TYPE.NOTIFICATION);
    }
  }, [appEvent.get]);

  return (
    <EmptyLayout
      className="webapp"
      fallback={webEmptyScreen}
      event={refresh}
      showScreen={showScreen}
      isLoading={isLoading}
      dataAvailable={Boolean(webResources.length)}>
      {/* *****MODALES WEB PAGE ***** */}
      <CredentialsModal />
      <DeleteWebResourceModal />
      <AddDomainModal />
      <AddSubDomainModal webResources={webResources} />
      <div className="brightness variant-1"></div>

      {/* *****SECTION LEFT WEB PAGE ***** */}
      <section className="left">
        <WebApplicationResources isLoading={isLoading} webResources={webResources} />
      </section>

      {/* *****SECTION RIGHT WEB PAGE ***** */}
      <section className="right" ref={flashlight.rightPaneRef}>
        <WebApplicationTitle webResources={webResources} isLoading={isLoading} refresh={refresh} />
        <WebApplicationStatics webResources={webResources} />
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
