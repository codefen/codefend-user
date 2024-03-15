import React, { useEffect, useState } from 'react';
import {
	DeleteMobileCloudModal,
	ModalTitleWrapper,
	OrderV2,
	PageLoader,
	Show,
} from '../../../../components';
import {
	SelectMobileCloudApp,
	useMobile,
	useModal,
	useOrderStore,
	useSelectMobileCloudApp,
} from '../../../../../data';

import './mobileApplicationPanel.scss';
import { MobileApplication } from './components/MobileApplication';
import AddMobileModal from '../../../../components/modals/adding-modals/AddMobileModal';

const MobileApplicationPanel: React.FC = () => {
	const { showModal, setShowModal } = useModal();
	const [showScreen, setShowScreen] = useState<boolean>(false);
	const [control, refresh] = useState<boolean>(false);
	const { getMobileInfo, refetch, isLoading } = useMobile();
	const { resetSelectedApp } = useSelectMobileCloudApp(
		(state: SelectMobileCloudApp) => state,
	);

	useEffect(() => {
		refetch();
		setShowModal(false);
		const timeoutId = setTimeout(() => {
			setShowScreen(true);
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
					onDone={() => refresh(!control)}
					close={() => setShowModal(false)}
				/>
			</ModalTitleWrapper>

			<OrderV2 />

			<DeleteMobileCloudModal onDone={() => refresh(!control)} />
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
