import React, { useEffect } from 'react';
import { DeleteMobileCloudModal } from '@modals/DeleteMobileCloudModal.tsx';
import { ModalReport } from '@modals/reports/ModalReport.tsx';
import { OrderV2 } from '@modals/order/Orderv2.tsx';
import Show from '@/app/views/components/Show/Show';
import { useShowScreen } from '#commonHooks/useShowScreen.ts';
import { useMobile } from '@resourcesHooks/mobile/useMobile.ts';
import useModal from '#commonHooks/useModal.ts';
import { VulnerabilityRisk } from '@/app/views/components/VulnerabilityRisk/VulnerabilityRisk.tsx';

import AddMobileModal from '../../../../components/modals/adding-modals/AddMobileModal';
import { ListResourceWithSearch } from '@/app/views/components/ListResourceWithSearch/ListResourceWithSearch';
import { MobileSelectedDetails } from './components/MobileSelectedDetails';
import EmptyLayout from '../EmptyLayout';
import { useSelectedApp } from '@resourcesHooks/global/useSelectedApp';
import './mobileApplicationPanel.scss';
import { mobileEmptyScreen } from '@/app/constants/app-texts';
import { useGlobalFastField } from '@/app/views/context/AppContextProvider';
import { MobileApplicationTitle } from './components/MobileApplicationTitle';
import { DownloadsCard } from './components/DownloadsCard';

const MobileApplicationPanel: React.FC = () => {
  const [showScreen, control, refresh] = useShowScreen();
  const { showModal, setShowModal } = useModal();
  const { data, refetch, isLoading, updateData } = useMobile();
  const { appSelected, setAppSelected, newApp, setNewApp } = useSelectedApp();
  const selectedAppStored = useGlobalFastField('selectedApp');

  useEffect(() => {
    refetch();
    return () => {
      // setAppSelected(null);
      selectedAppStored.set(null);
      setNewApp(null);
    };
  }, [control]);

  useEffect(() => {
    if (newApp) {
      updateData(newApp);
      setNewApp(null);
    }
  }, [newApp]);

  const handleShow = () => setShowModal(true);

  const onDelete = () => {
    // setAppSelected(null);
    selectedAppStored.set(null);
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
      <DeleteMobileCloudModal onDone={onDelete} />
      <div className="brightness variant-1"></div>
      <div className="brightness variant-2"></div>
      <div className="brightness variant-3"></div>

      <section className="right">
        <Show when={Boolean(selectedAppStored.get)}>
          <MobileSelectedDetails listSize={data?.length || 0} />
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
