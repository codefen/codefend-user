import { type FC, useEffect } from 'react';
import { useLan } from '@resourcesHooks/network/useLan.ts';
import { LanNetworkData } from './components/NetworkData.tsx';
import { useFlashlight } from '../../../../context/FlashLightContext.tsx';
import { useShowScreen } from '#commonHooks/useShowScreen.ts';
import { OrderV2 } from '@modals/order/Orderv2.tsx';
import { useUserRole } from '#commonUserHooks/useUserRole.ts';
import Show from '@/app/views/components/Show/Show.tsx';
import { CredentialsModal } from '@modals/credentials/CredentialsModal.tsx';
import { ModalReport } from '@modals/reports/ModalReport.tsx';
import EmptyLayout from '../EmptyLayout.tsx';
import './network.scss';
import { networkEmptyScreen } from '@/app/constants/app-texts.ts';
import { OrderSection, ResourcesTypes } from '@interfaces/order.ts';
import OpenOrderButton from '@/app/views/components/OpenOrderButton/OpenOrderButton.tsx';
import { GlobeWebIcon } from '@icons';
import { PrimaryButton } from '@buttons/index';
import AddNetworkBlock from '@/app/views/pages/panel/layouts/lan/components/AddNetworkBlock.tsx';
import { AddAccessPointModal } from '@modals/index.ts';
import { AddSubNetworkModal } from '@modals/adding-modals/AddSubNetworkModal.tsx';
import { NetworkStatics } from '@/app/views/pages/panel/layouts/lan/components/NetworkStatics.tsx';
import { getNetworkMetrics } from '@utils/metric.service.ts';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider.tsx';
import { APP_EVENT_TYPE } from '@interfaces/panel.ts';

const NetworkPage: FC = () => {
  const [showScreen, control, refresh] = useShowScreen();
  const { networks, loading, refetch } = useLan();
  const flashlight = useFlashlight();
  const { isAdmin, isNormalUser } = useUserRole();
  const globalStore = useGlobalFastFields([
    'externalIpCount',
    'internalIpCount',
    'subNetworkCount',
    'planPreference',
    'isDefaultPlan',
    'totalNotUniqueIpCount',
    'appEvent',
    'totalNetowrkElements',
  ]);

  useEffect(() => {
    refetch();
    if (globalStore.appEvent.get !== APP_EVENT_TYPE.USER_LOGGED_OUT) {
      globalStore.appEvent.set(APP_EVENT_TYPE.NETWORK_RESOURCE_PAGE_CONDITION);
    }
  }, [control]);

  useEffect(() => {
    const metrics = getNetworkMetrics(networks);
    globalStore.externalIpCount.set(metrics.totalExternalIps);
    globalStore.internalIpCount.set(metrics.totalInternalIps);
    globalStore.subNetworkCount.set(metrics.subNetworkCount);
    globalStore.totalNotUniqueIpCount.set(metrics.totalNotUniqueIpCount);
    globalStore.totalNetowrkElements.set(metrics.total);
    if (globalStore.isDefaultPlan.get) {
      if (metrics.total <= 20) {
        globalStore.planPreference.set('small');
      } else if (metrics.total <= 200) {
        globalStore.planPreference.set('medium');
      } else {
        globalStore.planPreference.set('advanced');
      }
    }
  }, [networks, globalStore.planPreference.get, globalStore.isDefaultPlan.get]);

  return (
    <EmptyLayout
      className="lan"
      fallback={networkEmptyScreen}
      event={refresh}
      showScreen={showScreen}
      isLoading={loading}
      dataAvailable={Boolean(networks.length)}>
      <CredentialsModal />
      <AddAccessPointModal onDone={() => refresh()} />
      <AddSubNetworkModal onDone={() => refresh()} internalNetwork={networks ?? []} />
      <div className="brightness variant-1"></div>
      <div className="brightness variant-2"></div>
      <section className="left">
        <LanNetworkData
          isLoading={loading}
          refetchInternalNetwork={refresh}
          internalNetwork={networks}
        />
      </section>

      <Show when={isAdmin() || isNormalUser()}>
        <section className="right" ref={flashlight.rightPaneRef}>
          <AddNetworkBlock />
          <NetworkStatics
            externalIpCount={globalStore.externalIpCount.get}
            internalIpCount={globalStore.internalIpCount.get}
            totalNotUniqueIpCount={globalStore.totalNotUniqueIpCount.get}
          />
          <OpenOrderButton
            className="primary-full"
            type={ResourcesTypes.NETWORK}
            resourceCount={networks?.length || 0}
            isLoading={loading}
            scope={OrderSection.NETWORK_SCOPE}
          />
        </section>
      </Show>
    </EmptyLayout>
  );
};
export default NetworkPage;
