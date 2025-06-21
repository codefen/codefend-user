import { useEffect, useMemo, useState } from 'react';
import SocialEngineering from './components/SocialEngineering.tsx';
import SocialEngineeringMembers from './components/SocialEngineeringMembers.tsx';
import { useFlashlight } from '../../../../context/FlashLightContext.tsx';
import { OrderV2 } from '@modals/order/Orderv2.tsx';
import { useShowScreen } from '#commonHooks/useShowScreen.ts';
import { useSocial } from '@resourcesHooks/social/useSocial.ts';
import './socialEngineering.scss';
import Show from '@/app/views/components/Show/Show.tsx';
import { CredentialsModal } from '@modals/credentials/CredentialsModal.tsx';
import { ModalReport } from '@modals/reports/ModalReport.tsx';
import EmptyLayout from '../EmptyLayout.tsx';
import { MODAL_KEY_OPEN, socialEmptyScreen } from '@/app/constants/app-texts.ts';
import { OrderSection, ResourcesTypes } from '@interfaces/order.ts';
import OpenOrderButton from '@/app/views/components/OpenOrderButton/OpenOrderButton.tsx';
import AddSocialBlock from '@/app/views/pages/panel/layouts/social/components/AddSocialBlock.tsx';
import useModalStore from '@stores/modal.store.ts';
import AddSocialResourceModal from '@modals/adding-modals/AddSocialResourceModal.tsx';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider.tsx';
import { APP_EVENT_TYPE, USER_LOGGING_STATE } from '@interfaces/panel.ts';
import { useSocialFilters } from '@/app/data/hooks/resources/social/useSocialFilters.ts';
import { useFilteredSocialMembers } from '@/app/data/hooks/resources/social/useFilteredSocialMembers.ts';
import { SocialEngineeringFilters } from './components/SocialEngineeringFilters.tsx';

const SocialEngineeringView = () => {
  const [showScreen, control, refresh] = useShowScreen();
  const { members, refetch, isLoading } = useSocial();
  const flashlight = useFlashlight();
  const globalStore = useGlobalFastFields([
    'isDefaultPlan',
    'planPreference',
    'appEvent',
    'userLoggingState',
  ]);

  const { filters, handleFilters } = useSocialFilters();
  const { filteredData, isFiltered } = useFilteredSocialMembers(members, filters);

  useEffect(() => {
    if (globalStore.userLoggingState.get !== USER_LOGGING_STATE.LOGGED_OUT) {
      refetch();
      globalStore.appEvent.set(APP_EVENT_TYPE.SOCIAL_RESOURCE_PAGE_CONDITION);
    }
  }, [control]);

  useEffect(() => {
    const employees = members.length;
    if (globalStore.isDefaultPlan.get) {
      if (employees <= 20) {
        globalStore.planPreference.set('small');
      } else if (employees <= 100) {
        globalStore.planPreference.set('medium');
      } else {
        globalStore.planPreference.set('advanced');
      }
    }
  }, [members, globalStore.planPreference, globalStore.isDefaultPlan]);

  const displayMembers = isFiltered ? filteredData : members;

  return (
    <EmptyLayout
      className="social"
      fallback={socialEmptyScreen}
      event={refresh}
      showScreen={showScreen}
      isLoading={isLoading}
      dataAvailable={Boolean(members.length)}>
      <CredentialsModal />
      <AddSocialResourceModal onDone={() => refresh()} />
      <section className="left">
        <SocialEngineering refetch={refresh} isLoading={isLoading} socials={displayMembers} />
      </section>
      <section className="right" ref={flashlight.rightPaneRef}>
        <AddSocialBlock isLoading={isLoading} />
        <SocialEngineeringFilters
          members={members}
          handleFilters={handleFilters}
          currentFilters={filters}
        />

        <OpenOrderButton
          className="primary-full"
          type={ResourcesTypes.SOCIAL}
          resourceCount={members?.length || 0}
          isLoading={isLoading}
          scope={OrderSection.SOCIAL_SCOPE}
        />
      </section>
    </EmptyLayout>
  );
};

export default SocialEngineeringView;
