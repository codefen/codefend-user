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
	useCloud,
	useModal,
	useSelectMobileCloudApp,
} from '../../../../../data';
import { AddCloudModal } from '../../../../components/modals/adding-modals/AddCloudModal';
import { CloudApplication } from './components/CloudApplication';
import './cloud.scss';

const CloudApplicationPanel: React.FC = () => {
	const [showScreen, setShowScreen] = useState<boolean>(false);
	const [control, refresh] = useState<boolean>(false);
	const { isLoading, getCloudInfo, refetch } = useCloud();
	const { setShowModal, showModal } = useModal();
	const { resetSelectedApp } = useSelectMobileCloudApp(
		(state: SelectMobileCloudApp) => state,
	);

	useEffect(() => {
		setShowScreen(false);
		refetch();
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
				headerTitle="Add Cloud"
				close={() => setShowModal(false)}>
				<AddCloudModal
					close={() => setShowModal(false)}
					onDone={() => {
						setShowModal(false);
						refresh(!control);
					}}
				/>
			</ModalTitleWrapper>
			<DeleteMobileCloudModal onDone={() => refresh(!control)} />
			<OrderV2 />
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
