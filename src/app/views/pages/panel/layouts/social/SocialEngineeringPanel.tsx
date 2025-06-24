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
import {
	MODAL_KEY_OPEN,
} from '@/app/constants/app-texts.ts';
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
import { MagnifyingGlassIcon } from '@icons';
import type { MemberV2 } from '@interfaces/panel.ts';
import { useInView } from 'react-intersection-observer';
import { PageLoader } from '@/app/views/components/loaders/Loader.tsx';

const SocialEngineeringView = () => {
	const { setModalId, setIsOpen } = useModalStore();
	const [showScreen, control, refresh] = useShowScreen();
	const { filters, handleFilters } = useSocialFilters();
	const [searchTerm, setSearchTerm] = useState('');

	const {
		members = [],
		refetch,
		isLoading,
		loadMore,
		isReachingEnd,
		domains,
		isSearchingBackend,
	} = useSocial(filters, searchTerm);

	const onFilterChange = (
		filterType: keyof typeof filters,
		value: string,
	) => {
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

	const { ref, inView } = useInView({ threshold: 0 });

	useEffect(() => {
		if (inView && !isReachingEnd) {
			loadMore();
		}
	}, [inView, isReachingEnd, loadMore]);

	const { filteredData, isFiltered } = useFilteredSocialMembers(
		members,
		filters,
	);

	useEffect(() => {
		if (
			globalStore.userLoggingState.get !== USER_LOGGING_STATE.LOGGED_OUT
		) {
			refetch();
			globalStore.appEvent.set(
				APP_EVENT_TYPE.SOCIAL_RESOURCE_PAGE_CONDITION,
			);
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

	if (isLoading && members.length === 0) {
		return <PageLoader />;
	}

	return (
		<main className={`social ${showScreen ? 'actived' : ''}`}>
			<CredentialsModal />
			<AddSocialResourceModal onDone={() => refresh()} />
			<section className="left">
				<div className="search-container">
					<ModalInput
						icon={<MagnifyingGlassIcon />}
						setValue={(val: string) => setSearchTerm(val)}
						placeholder="Search member by name or email..."
					/>
					{isSearchingBackend && (
						<div className="search-indicator">
							Searching in database...
						</div>
					)}
				</div>
				<div className="members-list">
					{displayMembers.length > 0 ? (
						<SocialEngineering
							sentryRef={ref}
							paginatedMembers={displayMembers}
						/>
					) : isSearching ? (
						<div className="no-results-found">
							<p>No members found for your search criteria.</p>
						</div>
					) : (
						<div className="no-results-found">
							<p>
								No members found.{' '}
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
					)}
				</div>
			</section>
			<section className="right" ref={flashlight.rightPaneRef}>
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
					isLoading={isLoading}
					scope={OrderSection.SOCIAL_SCOPE}
				/>
			</section>
		</main>
	);
};

export default SocialEngineeringView;
