import { type FC, useEffect } from 'react';
import { DeleteMobileCloudModal } from '@modals/DeleteMobileCloudModal.tsx';
import { OrderV2 } from '@modals/order/Orderv2';
import { ModalReport } from '@modals/reports/ModalReport.tsx';
import Show from '@defaults/Show.tsx';
import { useCloud } from '@resourcesHooks/cloud/useCloud.ts';
import useModal from '#commonHooks/useModal.ts';
import { useShowScreen } from '#commonHooks/useShowScreen.ts';
import { AddCloudModal } from '../../../../components/modals/adding-modals/AddCloudModal';
import './cloud.scss';
import { CloudSelectedDetails } from './components/CloudSelectedDetails';
import { ListResourceWithSearch } from '@standalones/ListResourceWithSearch';
import EmptyLayout from '../EmptyLayout';
import { useSelectedApp } from '@resourcesHooks/useSelectedApp';

const CloudApplicationPanel: FC = () => {
	const [showScreen, control, refresh] = useShowScreen();
	const { isLoading, data, refetch, updateData } = useCloud();
	const { setShowModal, showModal } = useModal();
	const { appSelected, setAppSelected, newApp } = useSelectedApp();

	useEffect(() => {
		refetch();
		return () => {
			setAppSelected(null);
			setAppSelected(null);
		};
	}, [control]);

	const cloudEmptyScreen = {
		type: 'cloud',
		title: 'There’s no data to display here',
		subtitle: 'Start by adding a new cloud resource',
		btnText: 'Add Cloud',
		event: refetch,
	};

	const onDelete = () => {
		setAppSelected(null);
		refresh();
	};

	return (
		<>
			<AddCloudModal
				isOpen={showModal}
				close={() => setShowModal(false)}
				onDone={() => {
					updateData(newApp);
				}}
			/>
			<DeleteMobileCloudModal onDone={onDelete} />
			<OrderV2 />
			<ModalReport />
			<EmptyLayout
				className="mobile cloud"
				fallback={cloudEmptyScreen}
				showScreen={showScreen}
				isLoading={isLoading}
				dataAvalaible={Boolean(data.length)}>
				<div className="brightness variant-1"></div>
				<div className="brightness variant-2"></div>
				<div className="brightness variant-3"></div>
				<section className="left">
					<ListResourceWithSearch
						openModal={() => setShowModal(!showModal)}
						type="Cloud"
						resources={data}
					/>
				</section>
				<section className="right">
					<Show when={Boolean(appSelected)}>
						<CloudSelectedDetails />
					</Show>
				</section>
			</EmptyLayout>
		</>
	);
};

export default CloudApplicationPanel;
