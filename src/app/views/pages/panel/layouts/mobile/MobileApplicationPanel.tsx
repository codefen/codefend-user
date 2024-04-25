import React, { useEffect } from 'react';
import { DeleteMobileCloudModal } from '@modals/DeleteMobileCloudModal.tsx';
import { ModalReport } from '@modals/reports/ModalReport.tsx';
import ModalTitleWrapper from '@modals/modalwrapper/ModalTitleWrapper.tsx';
import { OrderV2 } from '@modals/order/Orderv2.tsx';
import { PageLoader } from '@defaults/loaders/Loader.tsx';
import Show from '@defaults/Show.tsx';
import { useShowScreen } from '#commonHooks/useShowScreen.ts';
import { useMobile } from '@resourcesHooks/mobile/useMobile.ts';
import {
	useSelectMobileCloudApp,
	type SelectMobileCloudApp,
} from '@stores/mobileCloudApp.store.ts';
import useModal from '#commonHooks/useModal.ts';

import './mobileApplicationPanel.scss';
import AddMobileModal from '../../../../components/modals/adding-modals/AddMobileModal';
import useTimeout from '#commonHooks/useTimeout.ts';
import EmptyScreenView from '@defaults/EmptyScreenView';
import { ListResourceWithSearch } from '@standalones/LeftMobileCloud';
import { MobileSelectedDetails } from './components/MobileSelectedDetails';

const MobileApplicationPanel: React.FC = () => {
	const [showScreen, control, refresh] = useShowScreen();
	const { showModal, setShowModal } = useModal();
	const { getMobileInfo, refetch, isLoading } = useMobile();
	const { resetSelectedApp, isNotNull } = useSelectMobileCloudApp(
		(state: SelectMobileCloudApp) => state,
	);
	const { oneExecute } = useTimeout(() => resetSelectedApp(), 50);

	useEffect(() => {
		refetch();
		oneExecute();
	}, [control]);

	const handleShow = () => {
		setShowModal(true);
	};

	return (
		<main className={`mobile ${showScreen ? 'actived' : ''}`}>
			<ModalTitleWrapper
				isActive={showModal}
				headerTitle="Add mobile app"
				close={() => setShowModal(false)}>
				<AddMobileModal
					onDone={refresh}
					close={() => setShowModal(false)}
				/>
			</ModalTitleWrapper>

			<DeleteMobileCloudModal onDone={refresh} />
			<OrderV2 />
			<ModalReport />
			<Show when={!isLoading && Boolean(getMobileInfo().length)}>
				<div className="brightness variant-1"></div>
				<div className="brightness variant-2"></div>
				<div className="brightness variant-3"></div>
				<section className="left">
					<ListResourceWithSearch
						openModal={handleShow}
						type="Mobile"
						resources={getMobileInfo() || []}
					/>
				</section>
				<section className="right">
					<Show when={isNotNull()}>
						<MobileSelectedDetails />
					</Show>
				</section>
			</Show>
			<Show when={isLoading}>
				<PageLoader />
			</Show>
			<Show when={!isLoading && !Boolean(getMobileInfo().length)}>
				<EmptyScreenView
					buttonText="Add Mobile"
					title={"There's no data to display here"}
					info={'Start by clicking on the button below'}
					event={handleShow}
				/>
			</Show>
		</main>
	);
};

export default MobileApplicationPanel;
