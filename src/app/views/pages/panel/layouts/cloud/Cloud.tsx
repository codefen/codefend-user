import { type FC, useEffect } from 'react';
import { DeleteMobileCloudModal } from '@modals/DeleteMobileCloudModal.tsx';
import Show from '@/app/views/components/Show/Show';
import { useCloud } from '@resourcesHooks/cloud/useCloud.ts';
import useModal from '#commonHooks/useModal.ts';
import { useShowScreen } from '#commonHooks/useShowScreen.ts';
import { AddCloudModal } from '@modals/adding-modals/AddCloudModal';
import './cloud.scss';
import { CloudSelectedDetails } from './components/CloudSelectedDetails';
import { ListResourceWithSearch } from '@/app/views/components/ListResourceWithSearch/ListResourceWithSearch';
import EmptyLayout from '../EmptyLayout';
import { cloudEmptyScreen } from '@/app/constants/app-texts';
import Navbar from '@/app/views/components/navbar/Navbar';

/**
 * TODO:
 * - Refactorizar el panel de cloud para que se ves como en mobile
 * - Se elimino la forma de manejar los estados con zustand para adicion y eliminacion de apps, usar global fast field
 *
 */
const CloudApplicationPanel: FC = () => {
  const [showScreen, control, refresh] = useShowScreen();
  const { isLoading, data, refetch, updateData } = useCloud();
  const { setShowModal, showModal } = useModal();
  // const {  } = useSelectedApp();

  useEffect(() => {
    refetch();
    // return () => {
    //   setAppSelected(null);
    //   setNewApp(null);
    // };
  }, [control]);

  const onDelete = () => {
    // setAppSelected(null);
    refresh();
  };
  const onAdd = () => updateData({});

  return (
    <>
      <AddCloudModal isOpen={showModal} close={() => setShowModal(false)} onDone={onAdd} />
      <DeleteMobileCloudModal onDone={onDelete} app={{}} />
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
          <Navbar />
          <Show when={true}>
            <CloudSelectedDetails listSize={data?.length || 0} />
          </Show>
        </section>
      </EmptyLayout>
    </>
  );
};

export default CloudApplicationPanel;
