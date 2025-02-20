import { type FC, useEffect } from 'react';
import { DeleteMobileCloudModal } from '@modals/DeleteMobileCloudModal.tsx';
import { OrderV2 } from '@modals/order/Orderv2';
import { ModalReport } from '@modals/reports/ModalReport.tsx';
import Show from '@/app/components/Show/Show';
import { useCloud } from '@resourcesHooks/cloud/useCloud.ts';
import useModal from '#commonHooks/useModal.ts';
import { useShowScreen } from '#commonHooks/useShowScreen.ts';
import { AddCloudModal } from '@modals/adding-modals/AddCloudModal';
import './cloud.scss';
import { CloudSelectedDetails } from './components/CloudSelectedDetails';
import { ListResourceWithSearch } from '@standalones/ListResourceWithSearch';
import EmptyLayout from '../EmptyLayout';
import { useSelectedApp } from '@resourcesHooks/useSelectedApp';
import { cloudEmptyScreen } from '@/app/constants/app-texts';

const CloudApplicationPanel: FC = () => {
  const [showScreen, control, refresh] = useShowScreen();
  const { isLoading, data, refetch, updateData } = useCloud();
  const { setShowModal, showModal } = useModal();
  const { appSelected, setAppSelected, newApp, setNewApp } = useSelectedApp();

  useEffect(() => {
    refetch();
    return () => {
      setAppSelected(null);
      setNewApp(null);
    };
  }, [control]);

  const onDelete = () => {
    setAppSelected(null);
    refresh();
  };
  const onAdd = () => updateData(newApp);

  return (
    <>
      <AddCloudModal isOpen={showModal} close={() => setShowModal(false)} onDone={onAdd} />
      <DeleteMobileCloudModal onDone={onDelete} />
      <OrderV2 />
      <ModalReport />
      <EmptyLayout
        className="mobile cloud"
        fallback={cloudEmptyScreen}
        event={refresh}
        showScreen={showScreen}
        isLoading={isLoading}
        dataAvailable={Boolean(data.length)}>
        <div className="brightness variant-1"></div>
        <div className="brightness variant-2"></div>
        <div className="brightness variant-3"></div>
        <section className="left">
          <ListResourceWithSearch
            openModal={() => setShowModal(!showModal)}
            type="Cloud"
            resources={data}
          />
        </section>
        <section className="right">
          <Show when={Boolean(appSelected)}>
            <CloudSelectedDetails listSize={data?.length || 0} />
          </Show>
        </section>
      </EmptyLayout>
    </>
  );
};

export default CloudApplicationPanel;
