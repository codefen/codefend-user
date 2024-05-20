import React, { useEffect } from 'react';
import { DeleteMobileCloudModal } from '@modals/DeleteMobileCloudModal.tsx';
import { ModalReport } from '@modals/reports/ModalReport.tsx';
import { OrderV2 } from '@modals/order/Orderv2.tsx';
import Show from '@defaults/Show.tsx';
import { useShowScreen } from '#commonHooks/useShowScreen.ts';
import { useMobile } from '@resourcesHooks/mobile/useMobile.ts';
import useModal from '#commonHooks/useModal.ts';

import AddMobileModal from '../../../../components/modals/adding-modals/AddMobileModal';
import { ListResourceWithSearch } from '@standalones/ListResourceWithSearch';
import { MobileSelectedDetails } from './components/MobileSelectedDetails';
import EmptyLayout from '../EmptyLayout';
import { useSelectedApp } from '@resourcesHooks/useSelectedApp';
import './mobileApplicationPanel.scss';
import { RESOURCE_CLASS } from '@/app/constants/app-texts';

const MobileApplicationPanel: React.FC = () => {
	const [showScreen, control, refresh] = useShowScreen();
	const { showModal, setShowModal } = useModal();
	const { data, refetch, isLoading, updateData } = useMobile();
	const { appSelected, setAppSelected, newApp, setNewApp } = useSelectedApp();

	useEffect(() => {
		refetch();
		return () => {
			setAppSelected(null);
			setNewApp(null);
		};
	}, [control]);

	useEffect(() => {
		if (newApp) {
			updateData(newApp);
			setNewApp(null);
		}
	}, [newApp]);

	const handleShow = () => setShowModal(true);

	const mobileEmptyScreen = {
		type: RESOURCE_CLASS.MOBILE,
		title: 'There’s no data to display here',
		subtitle: 'Start by adding a new mobile application',
		btnText: 'Add Mobile',
		event: refresh,
	};

	const onDelete = () => {
		setAppSelected(null);
		refresh();
	};
	return (
		<>
			<AddMobileModal
				isOpen={showModal}
				onDone={() => {}}
				close={() => setShowModal(false)}
			/>
			<DeleteMobileCloudModal onDone={onDelete} />
			<OrderV2 />
			<ModalReport />
			<EmptyLayout
				className="mobile"
				fallback={mobileEmptyScreen}
				showScreen={showScreen}
				isLoading={isLoading}
				dataAvalaible={Boolean(data.length)}>
				<div className="brightness variant-1"></div>
				<div className="brightness variant-2"></div>
				<div className="brightness variant-3"></div>
				<section className="left">
					<ListResourceWithSearch
						openModal={handleShow}
						type="Mobile"
						resources={data || []}
					/>
				</section>
				<section className="right">
					<Show when={Boolean(appSelected)}>
						<MobileSelectedDetails />
					</Show>
				</section>
			</EmptyLayout>
		</>
	);
};

export default MobileApplicationPanel;
