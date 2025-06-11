import React, { useEffect } from 'react';
import { DeleteMobileCloudModal } from '@modals/DeleteMobileCloudModal.tsx';
import Show from '@/app/views/components/Show/Show';
import { useShowScreen } from '#commonHooks/useShowScreen.ts';
import { useMobile } from '@resourcesHooks/mobile/useMobile.ts';
import useModal from '#commonHooks/useModal.ts';

import { ListResourceWithSearch } from '@/app/views/components/ListResourceWithSearch/ListResourceWithSearch';
import { MobileSelectedDetails } from './components/MobileSelectedDetails';
import EmptyLayout from '../EmptyLayout';
import './mobileApplicationPanel.scss';
import { mobileEmptyScreen } from '@/app/constants/app-texts';
import { useGlobalFastField, useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { MobileApplicationTitle } from './components/MobileApplicationTitle';
import AddMobileModal from '@modals/adding-modals/AddMobileModal';
import { APP_EVENT_TYPE, USER_LOGGING_STATE } from '@interfaces/panel';

const MobileApplicationPanel: React.FC = () => {
  const [showScreen, control, refresh] = useShowScreen();
  const { showModal, setShowModal } = useModal();
  const { data, refetch, isLoading, updateData, orders } = useMobile();
  const { selectedApp, appEvent, userLoggingState } = useGlobalFastFields([
    'selectedApp',
    'appEvent',
    'userLoggingState',
  ]);

  useEffect(() => {
    if (userLoggingState.get !== USER_LOGGING_STATE.LOGGED_OUT) {
      refetch();
      appEvent.set(APP_EVENT_TYPE.MOBILE_RESOURCE_PAGE_CONDITION);
    }
    return () => {
      selectedApp.set(null);
    };
  }, [control]);

  useEffect(() => {
    if (selectedApp.get && appEvent.get === APP_EVENT_TYPE.MOBILE_RESOURCE_CREATED) {
      updateData(selectedApp.get);
    }
  }, [appEvent.get]);

  const handleShow = () => setShowModal(true);

  const onDelete = () => {
    selectedApp.set(null);
    refresh();
  };
  return (
    <EmptyLayout
      className={`mobile ${!Boolean(data.length) && 'empty-active'}`}
      fallback={mobileEmptyScreen}
      event={refresh}
      showScreen={showScreen}
      isLoading={isLoading}
      dataAvailable={Boolean(data.length)}>
      <AddMobileModal isOpen={showModal} close={() => setShowModal(false)} />
      <DeleteMobileCloudModal onDone={onDelete} app={selectedApp.get} />
      {/* <div className="brightness variant-1"></div>
      <div className="brightness variant-2"></div>
      <div className="brightness variant-3"></div> */}

      <section className="right">
        <Show when={Boolean(selectedApp.get)}>
          <MobileSelectedDetails listSize={data?.length || 0} appEvent={appEvent} orders={orders} />
        </Show>
      </section>

      {/* COLUMNA IZQUIERDA */}

      <section className="left">
        <MobileApplicationTitle onAddClick={handleShow} isLoading={isLoading} />
        <ListResourceWithSearch openModal={handleShow} type="Mobile" resources={data || []} />
      </section>
    </EmptyLayout>
  );
};

export default MobileApplicationPanel;
