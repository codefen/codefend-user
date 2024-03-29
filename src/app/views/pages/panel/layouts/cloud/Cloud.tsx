import { type FC, useEffect, useState } from 'react';
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
	useCloud,
	useModal,
	useSelectMobileCloudApp,
	useShowScreen,
} from '../../../../../data';
import { AddCloudModal } from '../../../../components/modals/adding-modals/AddCloudModal';
import { CloudApplication } from './components/CloudApplication';
import './cloud.scss';

const CloudApplicationPanel: FC = () => {
	const [showScreen, control, refresh] = useShowScreen();
	const { isLoading, getCloudInfo, refetch } = useCloud();
	const { setShowModal, showModal } = useModal();
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
