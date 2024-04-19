import { type FC, useMemo, Fragment, type ReactNode } from 'react';
import {
	useModal,
	type Device,
	generateIDArray,
	lanResourcesTable,
	type TableItem,
	lanResourcesTableWithoutAction,
} from '../../../../../../data';
import {
	AddAccessPointModal,
	ModalTitleWrapper,
	TrashIcon,
	LanIcon,
	ConfirmModal,
	AddNetworkDeviceModal,
	TableV2,
} from '../../../../../components';

import { useDeleteLan } from '@resourcesHooks/netowrk/useDeleteLan';
import { useUserRole } from '#commonUserHooks/useUserRole';

interface LanNetworkDataProps {
	isLoading: boolean;
	internalNetwork: Device[];
	refetchInternalNetwork: () => void;
}

export const LanNetworkData: FC<LanNetworkDataProps> = ({
	isLoading,
	internalNetwork,
	refetchInternalNetwork,
}) => {
	const { showModal, setShowModal, setShowModalStr, showModalStr } =
		useModal();
	const { isAdmin, isNormalUser, isProvider } = useUserRole();
	const { selectedLanIdToDelete, setSelectedLanIdToDelete, refetch } =
		useDeleteLan(refetchInternalNetwork, () => setShowModal(false));

	const handleDelete = () => {
		refetch(selectedLanIdToDelete);
	};
	let tableData2: Record<string, TableItem>[] = [];

	if (isAdmin() || isNormalUser()) {
		tableData2 = internalNetwork.map((network) => ({
			ID: { value: '', style: '' },
			Identifier: { value: network.id, style: 'id' },
			internalIp: { value: network.device_in_address, style: 'ip' },
			externalIp: { value: network.device_ex_address, style: 'ip' },
			description: {
				value: `${network.device_desc}`,
				style: 'full-name',
			},
			action: {
				value: (
					<>
						<span
							title="Delete"
							onClick={() => {
								setSelectedLanIdToDelete(network.id);
								setShowModal(!showModal);
								setShowModalStr('delete_resource');
							}}>
							<TrashIcon />
						</span>
					</>
				),
				style: 'id action',
			},
			childs: {
				value: (props) =>
					(
						<>
							{network.childs
								? network.childs.map((netChild, i) => (
										<a
											key={`child-${i}-${netChild.id}`}
											className={`item item-with-out-action ${
												props.selectedField ===
												`child-${netChild.id}`
													? 'left-marked'
													: ''
											}`}
											href={
												props.urlNav
													? `${props.urlNav}${netChild.id}`
													: ''
											}
											onClick={(e) =>
												props.handleClick(
													e,
													`child-${netChild.id}`,
													'',
												)
											}>
											<div className="id">
												<div className="publish">{netChild.id}</div>
											</div>
											<div className="ip">
												<div className="publish lined">
													<span
														className={`sub-domain-icon-v ${network.childs?.length === i + 1 && 'sub-is-last'}`}></span>
													<span className="sub-domain-icon-h"></span>
													{netChild.device_in_address}
												</div>
											</div>
											<div className="ip">
												<div className="publish">
													{netChild.device_ex_address}
												</div>
											</div>
											<div className="full-name">
												<div className="publish">
													{netChild.device_desc}
												</div>
											</div>
											<div className="id action">
												<span
													title="Delete"
													onClick={() => {
														setSelectedLanIdToDelete(netChild.id);
														setShowModal(!showModal);
														setShowModalStr('delete_resource');
													}}>
													<TrashIcon />
												</span>
											</div>
										</a>
									))
								: null}
						</>
					) as ReactNode,
				style: '',
			},
		}));
	} else {
		tableData2 = internalNetwork.map((network) => ({
			ID: { value: '', style: '' },
			Identifier: { value: network.id, style: 'id' },
			externalIp: { value: network.device_ex_address, style: 'ip' },
			internalIp: { value: network.device_in_address, style: 'ip' },
			description: {
				value: `${network.device_desc}`,
				style: 'full-name',
			},
			childs: {
				value: (props) =>
					(
						<>
							{network.childs
								? network.childs.map((netChild, i) => (
										<a
											key={`child-${i}-${netChild.id}`}
											className={`item item-with-out-action ${
												props.selectedField ===
												`child-${netChild.id}`
													? 'left-marked'
													: ''
											}`}
											href={
												props.urlNav
													? `${props.urlNav}${netChild.id}`
													: ''
											}
											onClick={(e) =>
												props.handleClick(
													e,
													`child-${netChild.id}`,
													'',
												)
											}>
											<div className="id">
												<div className="publish">{netChild.id}</div>
											</div>
											<div className="ip">
												<div className="publish">
													<span
														className={`sub-domain-icon-v ${network.childs?.length === i + 1 && 'sub-is-last'}`}></span>
													<span className="sub-domain-icon-h"></span>
													{netChild.device_ex_address}
												</div>
											</div>
											<div className="ip">
												<div className="publish lined">
													{netChild.device_in_address}
												</div>
											</div>

											<div className="full-name">
												<div className="publish">
													{netChild.device_desc}
												</div>
											</div>
										</a>
									))
								: null}
						</>
					) as ReactNode,
				style: '',
			},
		}));
	}

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
						refetchInternalNetwork();
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
						refetchInternalNetwork();
					}}
					close={() => setShowModal(false)}
					internalNetwork={internalNetwork ?? []}
				/>
			</ModalTitleWrapper>

			<div className="card table">
				<div className="header">
					<div className="title">
						<div className="icon">
							<LanIcon />
						</div>
						<span>Network structure</span>
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

				<TableV2
					columns={
						isProvider()
							? lanResourcesTableWithoutAction
							: lanResourcesTable
					}
					rowsData={tableData2}
					showRows={!isLoading}
					showEmpty={!isLoading && internalNetwork.length === 0}
				/>
			</div>
		</>
	);
};
