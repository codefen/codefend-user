import { useEffect } from 'react';
import { WebApplicationResources } from './components/WebApplicationResources.tsx';
import { WebApplicationStatics } from './components/WebApplicationStatics.tsx';
import { useShowScreen } from '#commonHooks/useShowScreen.ts';
import { useGetWebResources } from '@resourcesHooks/web/useGetWebResources.ts';
import { OrderV2 } from '@modals/order/Orderv2.tsx';
import { ModalReport } from '@modals/reports/ModalReport.tsx';
import { useFlashlight } from '../../../../context/FlashLightContext.tsx';
import '@table/table.scss';
import './webapplication.scss';
import { CredentialsModal } from '@modals/credentials/CredentialsModal.tsx';
import { ResourceByLocation } from '@/app/views/components/ResourceByLocation/ResourceByLocation.tsx';
import { RESOURCE_CLASS, webEmptyScreen } from '@/app/constants/app-texts.ts';
import EmptyLayout from '../EmptyLayout.tsx';
import WebWelcomeModal from '@modals/web-welcome/WebWelcomeModal.tsx';
import OpenOrderButton from '@/app/views/components/OpenOrderButton/OpenOrderButton.tsx';
import { ResourcesTypes } from '@interfaces/order.ts';

const WebApplicationView = () => {
  const [showScreen, control, refresh] = useShowScreen();
  const { webResources, isLoading, refetch } = useGetWebResources();
  const flashlight = useFlashlight();

  useEffect(() => {
    refetch();
  }, [control]);

  return (
    <EmptyLayout
      className="webapp"
      fallback={webEmptyScreen}
      event={refresh}
      showScreen={showScreen}
      isLoading={isLoading}
      dataAvailable={Boolean(webResources.length)}>
      <OrderV2 />
      <ModalReport />
      <CredentialsModal />
      <WebWelcomeModal />
      <div className="brightness variant-1"></div>
      <section className="left">
        <WebApplicationResources
          isLoading={isLoading}
          refresh={refresh}
          webResources={webResources}
        />
      </section>
      <section className="right" ref={flashlight.rightPaneRef}>
        <ResourceByLocation
          isLoading={isLoading}
          resource={webResources}
          title="Web servers by location"
          type={RESOURCE_CLASS.WEB}
        />
        <OpenOrderButton
          className="pentest-btn"
          type={ResourcesTypes.WEB}
          resourceCount={webResources.length}
          isLoading={isLoading}
        />
        <WebApplicationStatics webResources={webResources} />

        {/*<WebApplicationCredentials />*/}
      </section>
    </EmptyLayout>
  );
};

export default WebApplicationView;
