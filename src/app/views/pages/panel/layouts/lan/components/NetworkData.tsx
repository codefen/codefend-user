import { type FC, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { useDeleteLan } from '@resourcesHooks/netowrk/useDeleteLan.ts';
import { useUserRole } from '#commonUserHooks/useUserRole.ts';
import useModalStore from '@stores/modal.store.ts';
import useCredentialStore from '@stores/credential.store.ts';
import type { Device } from '@interfaces/panel.ts';
import useModal from '#commonHooks/useModal.ts';
import { useReportStore } from '@stores/report.store.ts';
import type { TableItem } from '@interfaces/table.tsx';
import ModalTitleWrapper from '@modals/modalwrapper/ModalTitleWrapper.tsx';
import ConfirmModal from '@modals/ConfirmModal.tsx';
import AddAccessPointModal from '@modals/adding-modals/AddAccessPointModal.tsx';
import { AddSubNetworkModal } from '@modals/adding-modals/AddSubNetworkModal';
import {
	BugIcon,
	CredentialIcon,
	DocumentIcon,
	LanIcon,
	TrashIcon,
} from '@icons';
import { TableV2 } from '@table/tablev2.tsx';
import { lanResourcesTable } from '@mocks/defaultData.ts';
import Show from '@defaults/Show';
import { MODAL_KEY_OPEN } from '@/app/constants/app-texts';

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
	const navigate = useNavigate();
	const location = useLocation();
	const { showModal, setShowModal, setShowModalStr, showModalStr } =
		useModal();
	const { setCrendentialType, setResourceId } = useCredentialStore();
	const { setIsOpen, setModalId } = useModalStore();
	const { isAdmin, isNormalUser, isProvider } = useUserRole();
	const { selectedLanIdToDelete, setSelectedLanIdToDelete, refetch } =
		useDeleteLan(refetchInternalNetwork, () => setShowModal(false));
	const { openModal, setResourceID, setResourceType } = useReportStore(
		(state: any) => state,
	);
	const handleDelete = () => {
		refetch(selectedLanIdToDelete);
	};
	const generateReport = (resourceID: string, count: any) => {
		if (Number(count) >= 1) {
			openModal();
			setResourceID(resourceID);
			setResourceType('lan');
		}
	};
	const tableData2: Record<string, TableItem>[] = internalNetwork.map(
		(network) => ({
			ID: { value: '', style: '' },
			Identifier: { value: Number(network.id), style: 'id' },
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
							className={`issue-icon issue-icon ${isProvider() || isAdmin() ? '' : 'disable'}`}
							title={`${isNormalUser() ? '' : 'Add Issue'}`}
							onClick={() =>
								navigate(
									isProvider() || isAdmin()
										? `/issues/create/lan/${network.id}`
										: '',
									{
										state: { redirect: location.pathname },
									},
								)
							}>
							<BugIcon isButton />
							<span className="codefend-text-red-200 issue-count">
								{network.final_issues}
							</span>
						</span>
						<span
							title="View report"
							className={`issue-printer ${Number(network.final_issues) == 0 ? 'off' : ''}`}
							onClick={() =>
								generateReport(network.id, network.final_issues)
							}>
							<DocumentIcon isButton width={1.27} height={1.27} />
						</span>
						<span
							title="Add credentials"
							onClick={() => {
								setResourceId(network.id);
								setCrendentialType('lan');
								setIsOpen(true);
								setModalId(MODAL_KEY_OPEN.NETWORK_CREDS);
							}}>
							<CredentialIcon />
						</span>
						<Show when={isAdmin() || isNormalUser()}>
							<span
								title="Delete"
								onClick={() => {
									setSelectedLanIdToDelete(network.id);
									setShowModal(!showModal);
									setShowModalStr(MODAL_KEY_OPEN.DELETE_NETWORK);
								}}>
								<TrashIcon />
							</span>
						</Show>
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
											href={''}
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
												<div className="publish">
													<span
														className={`issue-icon ${isProvider() || isAdmin() ? '' : 'disable'}`}
														title={`${isNormalUser() ? '' : 'Add Issue'}`}
														onClick={() =>
															navigate(
																isProvider() || isAdmin()
																	? `/issues/create/lan/${netChild.id}`
																	: '',
																{
																	state: {
																		redirect:
																			location.pathname,
																	},
																},
															)
														}>
														<BugIcon isButton />
														<span className="codefend-text-red-200 issue-count">
															{netChild?.final_issues || 0}
														</span>
													</span>
													<span
														title="View report"
														className={`issue-printer ${Number(netChild.final_issues) == 0 ? 'off' : ''}`}
														onClick={() =>
															generateReport(
																netChild.id,
																netChild.final_issues,
															)
														}>
														<DocumentIcon
															isButton
															width={1.27}
															height={1.27}
														/>
													</span>
													<span
														title="Add credentials"
														onClick={() => {
															setResourceId(netChild.id);
															setCrendentialType('lan');
															setIsOpen(true);
															setModalId('lan');
														}}>
														<CredentialIcon />
													</span>
													<Show when={isAdmin() || isNormalUser()}>
														<span
															title="Delete"
															onClick={() => {
																setSelectedLanIdToDelete(
																	netChild.id,
																);
																setShowModal(!showModal);
																setShowModalStr(
																	MODAL_KEY_OPEN.DELETE_NETWORK,
																);
															}}>
															<TrashIcon />
														</span>
													</Show>
												</div>
											</div>
										</a>
									))
								: null}
						</>
					) as ReactNode,
				style: '',
			},
		}),
	);

	return (
		<>
			<ModalTitleWrapper
				headerTitle="Delete LAN"
				close={() => setShowModal(false)}
				// type="med-w"
				isActive={
					showModal && showModalStr === MODAL_KEY_OPEN.DELETE_NETWORK
				}>
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

			<AddAccessPointModal
				isOpen={showModal && showModalStr === MODAL_KEY_OPEN.ADD_NETWORK}
				onDone={() => {
					setShowModal(false);
					refetchInternalNetwork();
				}}
				close={() => setShowModal(false)}
			/>
			<AddSubNetworkModal
				isOpen={
					showModal && showModalStr === MODAL_KEY_OPEN.ADD_SUB_NETWORK
				}
				onDone={() => {
					refetchInternalNetwork();
				}}
				close={() => setShowModal(false)}
				internalNetwork={internalNetwork ?? []}
			/>
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
								setShowModalStr(MODAL_KEY_OPEN.ADD_NETWORK);
							}}>
							Add access point
						</div>
						<div
							onClick={() => {
								setShowModal(!showModal);
								setShowModalStr(MODAL_KEY_OPEN.ADD_SUB_NETWORK);
							}}>
							Add network device
						</div>
					</div>
				</div>

				<TableV2
					columns={lanResourcesTable}
					rowsData={tableData2}
					showRows={!isLoading}
					showEmpty={!isLoading && internalNetwork.length === 0}
				/>
			</div>
		</>
	);
};
