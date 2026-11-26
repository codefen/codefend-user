import { PanelInterior } from '@/app/views/pages/panel/layouts/PanelInterior';
import { useEffect, useState } from 'react';
import SocialEngineering from './components/SocialEngineering.tsx';
import { useFlashlight } from '../../../../context/FlashLightContext.tsx';
import { useShowScreen } from '#commonHooks/useShowScreen.ts';
import { useSocial } from '@resourcesHooks/social/useSocial.ts';
import './socialEngineering.scss';
import { CredentialsModal } from '@modals/credentials/CredentialsModal.tsx';
import { MODAL_KEY_OPEN } from '@/app/constants/app-texts.ts';
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
import { ModalInput } from '@/app/views/components/ModalInput/ModalInput.tsx';
import { MagnifyingGlassIcon, PeopleGroupIcon, LinkedinV2Icon } from '@icons';
import { PageLoader } from '@/app/views/components/loaders/Loader.tsx';
import { useIntersectionObserver } from 'usehooks-ts';
import { SimpleSection } from '@/app/views/components/SimpleSection/SimpleSection.tsx';
import Navbar from '@/app/views/components/navbar/Navbar';
import { useMediaQuery } from 'usehooks-ts';
import { SectionTracker } from '@/app/views/components/telemetry/SectionTracker';

const SocialEngineeringView = () => {
  const { setModalId, setIsOpen } = useModalStore();
  const [showScreen, control, refresh] = useShowScreen();
  const { filters, handleFilters } = useSocialFilters();
  const [searchTerm, setSearchTerm] = useState('');

  const {
    members = [],
    refetch,
    isLoading,
    isLoadingMore,
    loadMore,
    isReachingEnd,
    domains,
  } = useSocial(filters, searchTerm);

  const onFilterChange = (filterType: keyof typeof filters, value: string) => {
    if (searchTerm) {
      setSearchTerm('');
    }
    handleFilters(filterType, value);
  };

  const flashlight = useFlashlight();
  const globalStore = useGlobalFastFields([
    'isDefaultPlan',
    'planPreference',
    'appEvent',
    'userLoggingState',
  ]);

  const { ref, isIntersecting: inView } = useIntersectionObserver({ threshold: 0.5 });
  const isDesktop = useMediaQuery('(min-width: 1230px)');
  const linkedInOnly = filters.properties.includes('has_linkedin');

  useEffect(() => {
    if (inView && !isReachingEnd) {
      loadMore();
    }
  }, [inView, isReachingEnd, loadMore]);

  const { filteredData } = useFilteredSocialMembers(members, filters);

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

  const isSearching = searchTerm.length > 0;
  const displayMembers = filteredData;

  const setLinkedInFilter = (enabled: boolean) => {
    if (enabled === linkedInOnly) return;
    onFilterChange('properties', 'has_linkedin');
  };

  const renderMembers = () => {
    if (displayMembers.length > 0) {
      return (
        <SocialEngineering
          sentryRef={ref}
          paginatedMembers={displayMembers}
          isLoading={isLoading}
          isLoadingMore={isLoadingMore}
          hasMore={!isReachingEnd}
        />
      );
    }

    if (isSearching) {
      return (
        <div className="no-results-found">
          <p>No members found for your search criteria.</p>
        </div>
      );
    }

    return (
      <div className="no-results-found">
        <p>
          {linkedInOnly ? 'No LinkedIn profiles found. ' : 'No members found. '}
          <button
            className="link-button"
            onClick={() => {
              setModalId(MODAL_KEY_OPEN.ADD_MEMBER);
              setIsOpen(true);
            }}>
            Click here to add
          </button>
        </p>
      </div>
    );
  };

  if (isLoading && members.length === 0) {
    return <PageLoader />;
  }

  return (
    <SectionTracker sectionName="social">
      <PanelInterior
        title="Social attacks"
        titleIcon={<PeopleGroupIcon />}
        ready={showScreen}
        className={`social ${!isDesktop ? 'sidebar-mobile-active' : ''}`}>
        <CredentialsModal />
        <AddSocialResourceModal onDone={() => refresh()} />
        <section className="left">
          <div className="mobile-cards">
            <AddSocialBlock isLoading={isLoading} />
            <SocialEngineeringFilters
              members={members}
              domains={domains || []}
              handleFilters={onFilterChange}
              currentFilters={filters}
            />
            <OpenOrderButton
              className="primary-full"
              type={ResourcesTypes.SOCIAL}
              resourceCount={members?.length || 0}
              scope={OrderSection.SOCIAL_SCOPE}
            />
          </div>

          <div className="search-container">
            <ModalInput
              icon={<MagnifyingGlassIcon />}
              setValue={(val: string) => setSearchTerm(val)}
              placeholder="Search member by name or email..."
            />
          </div>

          <div className="card">
            <SimpleSection>
              <div className="social-quick-filters" role="group" aria-label="Quick filters">
                <button
                  type="button"
                  className={`quick-filter ${!linkedInOnly ? 'active' : ''}`}
                  onClick={() => setLinkedInFilter(false)}>
                  All
                </button>
                <button
                  type="button"
                  className={`quick-filter ${linkedInOnly ? 'active' : ''}`}
                  onClick={() => setLinkedInFilter(true)}>
                  <LinkedinV2Icon width="14" height="14" />
                  LinkedIn
                </button>
              </div>
              <div className="content content-grid">{renderMembers()}</div>
            </SimpleSection>
          </div>
        </section>
        <section className="right" ref={flashlight.rightPaneRef}>
          <Navbar />
          <AddSocialBlock isLoading={isLoading} />
          <SocialEngineeringFilters
            members={members}
            domains={domains || []}
            handleFilters={onFilterChange}
            currentFilters={filters}
          />

          <OpenOrderButton
            className="primary-full"
            type={ResourcesTypes.SOCIAL}
            resourceCount={members?.length || 0}
            scope={OrderSection.SOCIAL_SCOPE}
          />
        </section>
      </PanelInterior>
    </SectionTracker>
  );
};

export default SocialEngineeringView;
