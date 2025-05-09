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

const NetworkPage: FC = () => {
  const [showScreen, control, refresh] = useShowScreen();
  const { networks, loading, refetch } = useLan();
  const flashlight = useFlashlight();
  const { isAdmin, isNormalUser } = useUserRole();

  useEffect(() => {
    refetch();
  }, [control]);

  return (
    <EmptyLayout
      className="lan"
      fallback={networkEmptyScreen}
      event={refresh}
      showScreen={showScreen}
      isLoading={loading}
      dataAvailable={Boolean(networks.length)}>
      <CredentialsModal />
      <ModalReport />
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
