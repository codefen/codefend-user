import React, { useEffect, useState } from 'react';
import { ModalTitleWrapper, Show } from '../../../../components';
import { useCloud, useModal } from '../../../../../data';
import { AddCloudModal } from '../../../../components/modals/AddCloudModal';
import { CloudApplication } from './components/CloudApplication';

const CloudApplicationPanel: React.FC = () => {
	const [showScreen, setShowScreen] = useState<boolean>(false);
	const [control, refresh] = useState<boolean>(false);
	const { isLoading, getCloudInfo, refetch } = useCloud();
	const { setShowModal, showModal } = useModal();

	useEffect(() => {
		setShowScreen(false);
		refetch();
		const timeoutId = setTimeout(() => setShowScreen(true), 50);
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
			<main className={`mobile cloud ${showScreen ? 'actived' : ''}`}>
				<Show when={!isLoading}>
					<CloudApplication
						openModal={() => setShowModal(!showModal)}
						refresh={() => refresh(!control)}
						cloudData={getCloudInfo()}
					/>
				</Show>
			</main>
		</>
	);
};

export default CloudApplicationPanel;
