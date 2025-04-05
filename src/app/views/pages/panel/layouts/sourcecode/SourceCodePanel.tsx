import { useEffect, type FC } from 'react';
import { useSourceCode } from '@resourcesHooks/sourcecode/useSourceCode.ts';
import { useShowScreen } from '#commonHooks/useShowScreen.ts';
import { SourceCodeResources } from './components/SourceCodeResources.tsx';
import { SourceCodeChart } from './components/SourceCodeChart.tsx';
import { SourceCodeCollab } from './components/SourceCodeCollab.tsx';
import { OrderV2 } from '@modals/order/Orderv2.tsx';
import { useFlashlight } from '../../../../context/FlashLightContext.tsx';
import { CredentialsModal } from '@modals/credentials/CredentialsModal.tsx';
import { ModalReport } from '@modals/reports/ModalReport.tsx';
import EmptyLayout from '../EmptyLayout.tsx';
import './sourcecode.scss';
import { sourceEmptyScreen } from '@/app/constants/app-texts.ts';
import OpenOrderButton from '@/app/views/components/OpenOrderButton/OpenOrderButton.tsx';
import { ResourcesTypes } from '@interfaces/order.ts';

const SourceCodePanel: FC = () => {
  const [showScreen, control, refresh] = useShowScreen();
  const { data, isLoading, refetch } = useSourceCode();
  const flashlight = useFlashlight();

  useEffect(() => {
    refetch();
  }, [control]);

  return (
    <EmptyLayout
      className="source-code"
      fallback={sourceEmptyScreen}
      event={refresh}
      showScreen={showScreen}
      isLoading={isLoading}
      dataAvailable={Boolean(data.length)}>
      <OrderV2 />
      <CredentialsModal />
      <ModalReport />
      <section className="left">
        <SourceCodeResources isLoading={isLoading} sourceCode={data} refetch={refresh} />
      </section>
      <section className="right" ref={flashlight.rightPaneRef}>
        <SourceCodeChart isLoading={isLoading} sourceCode={data} />

        <OpenOrderButton
          className="primary-full"
          type={ResourcesTypes.CODE}
          resourceCount={data?.length || 0}
          isLoading={isLoading}
        />

        <SourceCodeCollab />
      </section>
    </EmptyLayout>
  );
};

export default SourceCodePanel;
