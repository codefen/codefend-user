import { generateIDArray, useModal } from '../../../../../../data';
import {
	ConfirmModal,
	EnpIcon,
	ModalTitleWrapper,
	PageLoader,
	Show,
	SimpleSection,
	TrashIcon,
} from '../../../../../components';
import { type FC, Fragment, useMemo, useState } from 'react';

interface Endpoints {
	isLoading: boolean;
	endpoints: any[];
	onDelete: (id: string) => void;
}

export const Endpoints: FC<Endpoints> = (props) => {
	const { showModal, setShowModal } = useModal();
	const [selectedLanIdToDelete, setSelectedLanIdToDelete] = useState('');

	const endpointKeys = useMemo(
		() => (props.endpoints ? generateIDArray(props.endpoints.length) : []),
		[props.endpoints],
	);

	return (
		<>
			<ModalTitleWrapper
				isActive={showModal}
				headerTitle="Delete Endpoint"
				close={() => setShowModal(false)}>
				<ConfirmModal
					cancelText="Cancel"
					confirmText="Delete"
					header=""
					close={() => setShowModal(false)}
					action={() => props.onDelete(selectedLanIdToDelete)}
				/>
			</ModalTitleWrapper>
			<div className="card table">
				<SimpleSection header="Endpoints" icon={<EnpIcon />}>
					<>
						<div className="columns-name">
							<div className="id">id</div>
							<div className="hostname">name</div>
							<div className="ip">vendor</div>
							<div className="os">version</div>
							<div className="ip">type</div>
							<div className="id">actions</div>
						</div>
						<Show when={!props.isLoading} fallback={<PageLoader />}>
							<div className="rows">
								{props.endpoints[0]?.apps.map(
									(endpoint: any, index: number) => (
										<Fragment key={endpointKeys[index]}>
											<div className="item left-marked">
												<div className="id">{endpoint.id}</div>
												<div className="hostname">
													{endpoint.Name}
												</div>
												<div className="ip">{endpoint.Vendor}</div>
												<div className="os">{endpoint.Version}</div>
												<div className="ip">{endpoint.Type}</div>
												<div
													className="id action"
													onClick={() => {
														setSelectedLanIdToDelete(
															endpoint?.id,
														);
														setShowModal(!showModal);
													}}>
													<TrashIcon />
												</div>
											</div>
										</Fragment>
									),
								)}
							</div>
						</Show>
					</>
				</SimpleSection>
			</div>
		</>
	);
};
