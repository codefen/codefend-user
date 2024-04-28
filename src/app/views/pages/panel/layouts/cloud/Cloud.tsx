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
} from '@stores/mobileCloudSelect.store.ts';
import { useShowScreen } from '#commonHooks/useShowScreen.ts';
import { AddCloudModal } from '../../../../components/modals/adding-modals/AddCloudModal';
import './cloud.scss';
import useTimeout from '#commonHooks/useTimeout';
import { CloudSelectedDetails } from './components/CloudSelectedDetails';
import { ListResourceWithSearch } from '@standalones/LeftMobileCloud';
import EmptyScreenView from '@defaults/EmptyScreenView';

const CloudApplicationPanel: FC = () => {
	const [showScreen, control, refresh] = useShowScreen();
	const { isLoading, getCloudInfo, refetch } = useCloud();
	const { setShowModal, showModal } = useModal();
	const { resetSelectedApp, appSelected } = useSelectMobileCloudApp(
		(state: SelectMobileCloudApp) => state,
	);
	const { oneExecute } = useTimeout(() => resetSelectedApp(), 50);

	useEffect(() => {
		refetch();
		oneExecute();
	}, [control]);

	return (
		<main className={`mobile cloud ${showScreen ? 'actived' : ''}`}>
			<ModalTitleWrapper
				isActive={showModal}
				headerTitle="Add Cloud"
				close={() => setShowModal(false)}
				type="med-w"
				>
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
			<Show when={!isLoading && Boolean(getCloudInfo().length)}>
				<div className="brightness variant-1"></div>
				<div className="brightness variant-2"></div>
				<div className="brightness variant-3"></div>
				<section className="left">
					<ListResourceWithSearch
						openModal={() => setShowModal(!showModal)}
						type="Cloud"
						resources={getCloudInfo() || []}
					/>
				</section>
				<section className="right">
					<Show when={Boolean(appSelected)}>
						<CloudSelectedDetails />
					</Show>
				</section>
			</Show>
			<Show when={isLoading}>
				<PageLoader />
			</Show>
			<Show when={!isLoading && !Boolean(getCloudInfo().length)}>
				<EmptyScreenView
					buttonText="Add Cloud"
					title="There's no data to display here"
					info="Start by clicking on the button below"
					event={() => setShowModal(!showModal)}
				/>
			</Show>
		</main>
	);
};

export default CloudApplicationPanel;
