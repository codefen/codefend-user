import React, { useEffect } from 'react';
import { WebApplicationResources } from './components/WebApplicationResources.tsx';
import { WebApplicationStatics } from './components/WebApplicationStatics.tsx';
import { WebApplicationCredentials } from './components/WebApplicationCredentials.tsx';
import { useOrderStore } from '@stores/orders.store';
import { useShowScreen } from '#commonHooks/useShowScreen.ts';
import { useGetWebResources } from '@resourcesHooks/web/useGetWebResources.ts';
import { PrimaryButton } from '@buttons/primary/PrimaryButton.tsx';
import { OrderV2 } from '@modals/order/Orderv2.tsx';
import { ModalReport } from '@modals/reports/ModalReport.tsx';
import { useFlashlight } from '../../FlashLightContext.tsx';
import '@table/table.scss';
import './webapplication.scss';
import { useUserRole } from '#commonUserHooks/useUserRole.ts';
import { CredentialsModal } from '@modals/credentials/CredentialsModal.tsx';
import Show from '@defaults/Show.tsx';
import { ResourceByLocation } from '@standalones/ResourceByLocation.tsx';
import { RESOURCE_CLASS, webEmptyScreen } from '@/app/constants/app-texts.ts';
import useTableStoreV3 from '@table/v3/tablev3.store.ts';
import EmptyLayout from '../EmptyLayout.tsx';
import WebApplicationPentest from './components/WebApplicationPentest.tsx';
import WebWelcomeModal from '@modals/web-welcome/WebWelcomeModal.tsx';

const WebApplicationView: React.FC = () => {
  const [showScreen, control, refresh] = useShowScreen();
  const { webResources, isLoading, refetch } = useGetWebResources();
  const { updateState } = useOrderStore(state => state);
  const flashlight = useFlashlight();
  const { isAdmin, isNormalUser } = useUserRole();

  useEffect(() => {
    refetch();
  }, [control]);

  return (
    <>
      <OrderV2 />
      <ModalReport />
      <CredentialsModal />
      <WebWelcomeModal />
      <EmptyLayout
        className="webapp"
        fallback={webEmptyScreen}
        event={refresh}
        showScreen={showScreen}
        isLoading={isLoading}
        dataAvalaible={Boolean(webResources.length)}>
        <div className="brightness variant-1"></div>
        <section className="left">
          <WebApplicationResources
            isLoading={isLoading}
            refresh={refresh}
            webResources={webResources}
          />
        </section>
        <section className="right" ref={flashlight.rightPaneRef}>
          <Show when={isAdmin() || isNormalUser()}>
            <WebApplicationPentest webResources={webResources} isLoading={isLoading} />
          </Show>
          <ResourceByLocation
            isLoading={isLoading}
            resource={webResources}
            title="Web servers by location"
            type={RESOURCE_CLASS.WEB}
          />

          <WebApplicationStatics webResources={webResources} />

          {/*<WebApplicationCredentials />*/}
        </section>
      </EmptyLayout>
    </>
  );
};

export default WebApplicationView;
