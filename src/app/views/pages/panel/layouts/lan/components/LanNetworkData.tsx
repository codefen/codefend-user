import { type FC, useMemo, Fragment } from 'react';
import { useModal, type Device, generateIDArray } from '../../../../../../data';
import {
	EmptyCard,
	PageLoader,
	AddAccessPointModal,
	ModalTitleWrapper,
	TrashIcon,
	LanIcon,
	ConfirmModal,
	Show,
	AddNetworkDeviceModal,
} from '../../../../../components';

import { toast } from 'react-toastify';
import { useDeleteLan } from '@resourcesHooks/netowrk/useDeleteLan';

interface LanNetworkDataProps {
	isLoading: boolean;
	internalNetwork: Device[];
	refetchInternalNetwork: () => void;
}

export const LanNetworkData: FC<LanNetworkDataProps> = (props) => {
	const { showModal, setShowModal, setShowModalStr, showModalStr } =
		useModal();

	const { selectedLanIdToDelete, setSelectedLanIdToDelete, refetch } =
		useDeleteLan(props.refetchInternalNetwork, () => setShowModal(false));

	const handleDelete = () => {
		refetch();
	};

	const internalKeys = useMemo(() => {
		return props.internalNetwork
			? generateIDArray(props.internalNetwork.length)
			: [];
	}, [props.internalNetwork]);

	return (
		<>
			<ModalTitleWrapper
				headerTitle="Delete LAN"
				close={() => setShowModal(false)}
				isActive={showModal && showModalStr === 'delete_resource'}>
				<ConfirmModal
					header=""
					cancelText="Cancel"
					confirmText="Delete"
					close={() => setShowModal(false)}
					action={() => {
						handleDelete();
					}}
				/>
			</ModalTitleWrapper>

			<ModalTitleWrapper
				headerTitle="Add access point"
				close={() => setShowModal(false)}
				isActive={showModal && showModalStr === 'add_access_point'}>
				<AddAccessPointModal
					onDone={() => {
						setShowModal(false);
						props.refetchInternalNetwork();
					}}
					close={() => setShowModal(false)}
				/>
			</ModalTitleWrapper>

			<ModalTitleWrapper
				headerTitle="Add network device"
				close={() => setShowModal(false)}
				isActive={showModal && showModalStr === 'add_network_device'}>
				<AddNetworkDeviceModal
					onDone={() => {
						props.refetchInternalNetwork();
					}}
					close={() => setShowModal(false)}
					internalNetwork={props.internalNetwork ?? []}
				/>
			</ModalTitleWrapper>

			<div className="card table">
				<div className="header">
					<div className="title">
						<div className="icon">
							<LanIcon />
						</div>
						<span>Internal network structure</span>
					</div>
					<div className="actions">
						<div
							onClick={() => {
								setShowModal(!showModal);
								setShowModalStr('add_access_point');
							}}>
							Add access point
						</div>
						<div
							onClick={() => {
								setShowModal(!showModal);
								setShowModalStr('add_network_device');
							}}>
							Add network device
						</div>
					</div>
				</div>

				<div className="columns-name">
					<div className="id">id</div>
					<div className="ip">internal IP</div>
					<div className="ip">external IP</div>
					<div className="os">os / vendor</div>
					<div className="hostname">hostname</div>
					<div className="id">actions</div>
				</div>
				<Show when={!props.isLoading} fallback={<PageLoader />}>
					<div className="rows">
						{props.internalNetwork.map((network: Device, i: number) => (
							<Fragment key={internalKeys[i]}>
								<div className="item left-marked">
									<div className="id">{network.id}</div>
									<div className="ip">{network.device_in_address}</div>
									<div className="ip">{network.device_ex_address}</div>
									<div className="os">
										{network.device_os}/{network.device_vendor}
									</div>
									<div className="hostname">{network.device_name}</div>
									<div
										className="id actions"
										onClick={() => {
											setSelectedLanIdToDelete(String(network?.id));
											setShowModal(!showModal);
											setShowModalStr('delete_resource');
										}}>
										<TrashIcon />
									</div>
								</div>

								{network.childs?.map((subNetwork: Device) => (
									<div className="item" key={subNetwork.id}>
										<div className="id">{subNetwork.id}</div>
										<div className="ip lined">
											<span className="sub-domain-icon-v"></span>
											<span className="sub-domain-icon-h"></span>
											{subNetwork.device_in_address}
										</div>
										<div className="ip">
											{subNetwork.device_ex_address}
										</div>
										<div className="os">
											{subNetwork.device_os}/
											{subNetwork.device_vendor}
										</div>
										<div className="hostname">
											{subNetwork.device_name}
										</div>
										<div
											className=""
											onClick={(e) => {
												e.preventDefault();
												e.stopPropagation();
												return false;
											}}>
											<div
												className="id actions"
												onClick={(e: any) => {
													e.preventDefault();
													setSelectedLanIdToDelete(
														String(network?.id),
													);
													setShowModal(!showModal);
													setShowModalStr('delete_resource');
												}}>
												<TrashIcon />
											</div>
										</div>
									</div>
								))}
							</Fragment>
						))}
					</div>
				</Show>
			</div>
			<Show when={!props.isLoading && props.internalNetwork.length === 0}>
				<EmptyCard />
			</Show>
		</>
	);
};
