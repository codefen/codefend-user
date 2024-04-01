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
