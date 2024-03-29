import React, { useEffect, useState } from 'react';
import {
	DeleteMobileCloudModal,
	ModalReport,
	ModalTitleWrapper,
	OrderV2,
	PageLoader,
	Show,
} from '../../../../components';
import {
	type SelectMobileCloudApp,
	useMobile,
	useModal,
	useSelectMobileCloudApp,
	useShowScreen,
} from '../../../../../data';

import './mobileApplicationPanel.scss';
import { MobileApplication } from './components/MobileApplication';
import AddMobileModal from '../../../../components/modals/adding-modals/AddMobileModal';

const MobileApplicationPanel: React.FC = () => {
	const [showScreen, control, refresh] = useShowScreen();
	const { showModal, setShowModal } = useModal();
	const { getMobileInfo, refetch, isLoading } = useMobile();
	const { resetSelectedApp } = useSelectMobileCloudApp(
		(state: SelectMobileCloudApp) => state,
	);

	useEffect(() => {
		refetch();
		const timeoutId = setTimeout(() => {
			resetSelectedApp();
		}, 50);

		return () => clearTimeout(timeoutId);
	}, [control]);

	return (
		<>
			<ModalTitleWrapper
				isActive={showModal}
				headerTitle="Add mobile app"
				close={() => setShowModal(false)}>
				<AddMobileModal
					onDone={refresh}
					close={() => setShowModal(false)}
				/>
			</ModalTitleWrapper>

			<OrderV2 />
			<ModalReport />
			<DeleteMobileCloudModal onDone={refresh} />
			<main className={`mobile ${showScreen ? 'actived' : ''}`}>
				<Show when={!isLoading} fallback={<PageLoader />}>
					<MobileApplication
						openModal={() => setShowModal(true)}
						mobileInfo={getMobileInfo()}
						isLoading={isLoading}
					/>
				</Show>
			</main>
		</>
	);
};

export default MobileApplicationPanel;
