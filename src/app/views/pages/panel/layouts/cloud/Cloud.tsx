import { type FC, useEffect } from 'react';
import { DeleteMobileCloudModal } from '@modals/DeleteMobileCloudModal.tsx';
import { PageLoader } from '@defaults/loaders/Loader.tsx';
import { OrderV2 } from '@modals/order/Orderv2';
import { ModalReport } from '@modals/reports/ModalReport.tsx';
import ModalTitleWrapper from '@modals/modalwrapper/ModalTitleWrapper.tsx';
import Show from '@defaults/Show.tsx';
import { useCloud } from '@resourcesHooks/cloud/useCloud.ts';
import useModal from '#commonHooks/useModal.ts';
import {
	useSelectMobileCloudApp,
	type SelectMobileCloudApp,
} from '@stores/mobileCloudApp.store.ts';
import { useShowScreen } from '#commonHooks/useShowScreen.ts';
import { AddCloudModal } from '../../../../components/modals/adding-modals/AddCloudModal';
import { CloudApplication } from './components/CloudApplication';
import './cloud.scss';
import useTimeout from '#commonHooks/useTimeout';

const CloudApplicationPanel: FC = () => {
	const [showScreen, control, refresh] = useShowScreen();
	const { isLoading, getCloudInfo, refetch } = useCloud();
	const { setShowModal, showModal } = useModal();
	const { resetSelectedApp } = useSelectMobileCloudApp(
		(state: SelectMobileCloudApp) => state,
	);
	const { oneExecute } = useTimeout(() => resetSelectedApp(), 50);

	useEffect(() => {
		refetch();
		oneExecute();
	}, [control]);

	return (
		<>
			<ModalTitleWrapper
				isActive={showModal}
				headerTitle="Add Cloud"
				close={() => setShowModal(false)}>
				<AddCloudModal
					close={() => setShowModal(false)}
					onDone={() => {
						setShowModal(false);
						refresh();
					}}
				/>
			</ModalTitleWrapper>
			<DeleteMobileCloudModal onDone={refresh} />
			<OrderV2 />
			<ModalReport />
			<main className={`mobile cloud ${showScreen ? 'actived' : ''}`}>
				<Show when={!isLoading} fallback={<PageLoader />}>
					<CloudApplication
						openModal={() => setShowModal(!showModal)}
						cloudData={getCloudInfo()}
					/>
				</Show>
			</main>
		</>
	);
};

export default CloudApplicationPanel;
