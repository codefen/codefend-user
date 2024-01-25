import React, { useMemo, useState } from 'react';
import {
	useModal,
	LanApplicationService,
	Device,
	generateIDArray,
	useAuthState,
} from '../../../../../../data';
import {
	EmptyCard,
	PageLoader,
	AddAccessPointModal,
	ModalTitleWrapper,
	TrashIcon,
	LanIcon,
	ConfirmModal,
	Show,
} from '../../../../../components';

import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

interface LanNetworkDataProps {
	isLoading: boolean;
	internalNetwork: Device[];
	refetchInternalNetwork: () => void;
}

export const LanNetworkData: React.FC<LanNetworkDataProps> = (props) => {
	const { getUserdata } = useAuthState();
	const companyID = getUserdata()?.companyID;

	const { showModal, setShowModal, setShowModalStr, showModalStr } =
		useModal();

	const [selectedLanIdToDelete, setSelectedLanIdToDelete] = useState<
		string | null
	>(null);

	const [isDeletingLan, setIsDeletingLan] = useState<boolean>(false);
	const navigate = useNavigate();

	const handleDelete = () => {
		setIsDeletingLan(true);
		LanApplicationService.delete(selectedLanIdToDelete!, companyID!)
			.then(() => {
				navigate(0);
				setShowModal(!showModal);
				toast.success('Successfully Deleted lan...');
			})
			.finally(() => {
				setIsDeletingLan(false);
			});
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
						props.refetchInternalNetwork();
					}}
					close={() => setShowModal(false)}
				/>
			</ModalTitleWrapper>

			<ModalTitleWrapper
				headerTitle="Add network device"
				close={() => setShowModal(false)}
				isActive={showModal && showModalStr === 'add_network_device'}>
				<AddAccessPointModal
					onDone={() => {
						props.refetchInternalNetwork();
					}}
					close={() => setShowModal(false)}
				/>
			</ModalTitleWrapper>

			<div className="card table flex-grow">
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
							<React.Fragment key={internalKeys[i]}>
								<div className="item left-marked">
									<div className="id">{network.id}</div>
									<div className="ip">{network.device_in_address}</div>
									<div className="ip">{network.device_ex_address}</div>
									<div className="os">
										{network.device_os}/{network.device_vendor}
									</div>
									<div className="hostname">{network.device_name}</div>
									<div
										className="id cursor-pointer p-3 flex"
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
												className="id cursor-pointer p-3 flex"
												onClick={() => {
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
							</React.Fragment>
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
