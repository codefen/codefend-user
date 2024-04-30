import { useMemo, useState, type ReactNode, type FC, useRef } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { useDeleteWebResource } from '@resourcesHooks/web/useWebapplication.ts';
import { webResourcesColumns } from '@mocks/defaultData.ts';
import type { TableItem } from '@interfaces/table.ts';
import type { Webresources, Resouce } from '@interfaces/panel.ts';
import { useReportStore, type ReportStoreState } from '@stores/report.store.ts';
import useModal from '#commonHooks/useModal.ts';
import { LocationItem } from '@standalones/utils/LocationItem.tsx';
import { TableV2 } from '@table/tablev2.tsx';
import {
	TrashIcon,
	GlobeWebIcon,
	BugIcon,
	DocumentIcon,
	CredentialIcon,
} from '@icons';
import ConfirmModal from '@modals/ConfirmModal.tsx';
import ModalTitleWrapper from '@modals/modalwrapper/ModalTitleWrapper.tsx';
import AddSubDomainModal from '@modals/adding-modals/AddSubDomainModal.tsx';
import AddDomainModal from '@modals/adding-modals/AddDomainModal.tsx';
import { useUserRole } from '#commonUserHooks/useUserRole';
import Show from '@defaults/Show';
import useCredentialStore from '@stores/credential.store';
import useModalStore from '@stores/modal.store';

interface WebResourcesProps {
	refresh: () => void;
	webResources: Webresources[];
	isLoading: boolean;
}

interface SelectedResource {
	id: string;
	domain: string;
	serverIp: string;
}

export const WebApplicationResources: FC<WebResourcesProps> = (props) => {
	const navigate = useNavigate();
	const { isAdmin, isProvider, isNormalUser } = useUserRole();
	const userHaveAccess = isAdmin() || isProvider();
	const [selectedResource, setSelectedResource] = useState<SelectedResource>(
		{} as any,
	);
	const { openModal, setResourceID, setResourceType } = useReportStore(
		(state: ReportStoreState) => state,
	);
	const { showModal, setShowModal, showModalStr, setShowModalStr } =
		useModal();
	const { setCrendentialType, setResourceId } = useCredentialStore();
	const { setIsOpen, setModalId } = useModalStore();
	const { handleDelete } = useDeleteWebResource();
	const getResources = useMemo(() => {
		const resources = props.isLoading ? [] : props.webResources;
		return resources !== undefined ? resources.reverse() : [];
	}, [props.webResources, props.isLoading]);

	const generateReport = (resourceID: string, count: any) => {
		if (Number(count) >= 1) {
			openModal();
			setResourceID(resourceID);
			setResourceType('web');
		} else {
			toast.error(
				'The resource still does not have issues to make a report',
			);
		}
	};

	const tableData: Record<string, TableItem>[] = getResources.map(
		(mainNetwork: Webresources, i: number) => ({
			ID: { value: '', style: '' },
			Identifier: { value: mainNetwork.id, style: 'id' },
			domainName: {
				value: mainNetwork.resourceDomain,
				style: 'domain-name',
			},
			mainServer: { value: mainNetwork.mainServer, style: 'server-ip' },
			location: {
				value: (
					<LocationItem
						key={mainNetwork.id + i + '-ml'}
						country={mainNetwork.serverCountry}
						countryCode={mainNetwork.serverCountryCode}
					/>
				),
				style: 'location',
			},
			action: {
				value: (
					<>
						<span
							className="issue-icon"
							title={`${isNormalUser() ? '' : 'Add Issue'}`}
							onClick={() =>
								navigate(
									userHaveAccess
										? `/issues/create/web/${mainNetwork.id}`
										: '',
								)
							}>
							<BugIcon isButton />
							<span className="codefend-text-red-200 issue-count">
								{mainNetwork.final_issues}
							</span>
						</span>
						<span
							title="View report"
							className={`issue-printer ${Number(mainNetwork.final_issues) == 0 ? 'off' : ''}`}
							onClick={() =>
								generateReport(mainNetwork.id, mainNetwork.final_issues)
							}>
							<DocumentIcon isButton width={1.27} height={1.27} />
						</span>
						<Show when={isNormalUser() || isAdmin()}>
							<span
								title="Delete"
								onClick={() => {
									setSelectedResource({
										id: mainNetwork.id,
										domain: mainNetwork.resourceDomain,
										serverIp: mainNetwork.mainServer,
									});
									setShowModal(true);
									setShowModalStr('delete_resource');
								}}>
								<TrashIcon />
							</span>
						</Show>

						<span
							title="Add credentials"
							onClick={() => {
								setResourceId(mainNetwork.id);
								setCrendentialType('web');
								setIsOpen(true);
								setModalId('web');
							}}>
							<CredentialIcon />
						</span>
					</>
				),
				style: 'id action',
			},
			childs: {
				value: (props) =>
					(
						<>
							{mainNetwork.childs.map(
								(subNetwork: Resouce, i: number) => (
									<a
										key={`child-${i}-${subNetwork.id}`}
										className={`item item-with-out-action ${
											props.selectedField ===
											`child-${subNetwork.id}`
												? 'left-marked'
												: ''
										}`}
										href={
											props.urlNav
												? `${props.urlNav}${subNetwork.id}`
												: ''
										}
										onClick={(e) =>
											props.handleClick(
												e,
												`child-${subNetwork.id}`,
												'',
											)
										}>
										<div className="id">
											<div className="publish">{subNetwork.id}</div>
										</div>
										<div className="domain-name lined">
											<div className="publish">
												<span
													className={`sub-domain-icon-v ${mainNetwork.childs.length == i + 1 && 'sub-is-last'}`}></span>
												<span className="sub-domain-icon-h"></span>
												<span className="sub-resource-domain">
													{subNetwork.resourceDomain}
												</span>
											</div>
										</div>

										<div className="server-ip">
											<div className="publish">
												{subNetwork.mainServer}
											</div>
										</div>
										<div className="location">
											<div className="publish">
												<LocationItem
													key={subNetwork.id + i + '-lc'}
													country={subNetwork.serverCountry}
													countryCode={
														subNetwork.serverCountryCode
													}
												/>
											</div>
										</div>
										<div className="id action">
											<div className="publish">
												<span
													className="issue-icon"
													title={`${isNormalUser() ? '' : 'Add Issue'}`}
													onClick={() =>
														navigate(
															userHaveAccess
																? `/issues/create/web/${subNetwork.id}`
																: '',
														)
													}>
													<BugIcon isButton />
													<span className="codefend-text-red-200 issue-count">
														{subNetwork.final_issues}
													</span>
												</span>
												<span
													title="View report"
													className={`issue-printer ${Number(subNetwork.final_issues) == 0 ? 'off' : ''}`}
													onClick={() =>
														generateReport(
															subNetwork.id,
															subNetwork.final_issues,
														)
													}>
													<DocumentIcon
														isButton
														width={1.27}
														height={1.27}
													/>
												</span>

												<Show when={isNormalUser() || isAdmin()}>
													<span
														title="Delete"
														onClick={() => {
															setSelectedResource({
																id: subNetwork.id,
																domain:
																	subNetwork.resourceDomain,
																serverIp: subNetwork.mainServer,
															});
															setShowModal(true);
															setShowModalStr('delete_resource');
														}}>
														<TrashIcon />
													</span>
												</Show>
												<Show
													when={
														isNormalUser() ||
														isAdmin() ||
														isProvider()
													}>
													<span
														title="Add credentials"
														onClick={() => {
															setResourceId(subNetwork.id);
															setCrendentialType('web');
															setIsOpen(true);
															setModalId('web');
														}}>
														<CredentialIcon />
													</span>
												</Show>
											</div>
										</div>
									</a>
								),
							)}
						</>
					) as ReactNode,
				style: '',
			},
		}),
	);

	return (
		<>
			<ModalTitleWrapper
				isActive={showModal && showModalStr === 'add_domain'}
				close={() => setShowModal(false)}
				type="med-w"
				headerTitle="Add web resource">
				<AddDomainModal
					onDone={() => {
						setShowModal(!showModal);
						props.refresh();
					}}
					close={() => setShowModal(false)}
					webResources={getResources.map(
						(resource: Webresources) => resource.resourceDomain,
					)}
				/>
			</ModalTitleWrapper>

			<ModalTitleWrapper
				isActive={showModal && showModalStr === 'delete_resource'}
				close={() => setShowModal(false)}
				type="med-w"
				headerTitle="Delete web resource">
				<ConfirmModal
					header={`Are you sure to remove\n ${selectedResource.domain} - ${selectedResource.serverIp}`}
					cancelText="Cancel"
					confirmText="Delete"
					close={() => setShowModal(false)}
					action={() =>
						handleDelete(props.refresh, selectedResource.id).then(() =>
							setShowModal(false),
						)
					}
				/>
			</ModalTitleWrapper>

			<ModalTitleWrapper
				isActive={showModal && showModalStr === 'add_subdomain'}
				close={() => setShowModal(false)}
				type="med-w"
				headerTitle="Add web sub-resource">
				<AddSubDomainModal
					onDone={() => {
						setShowModal(false);
						props.refresh();
					}}
					close={() => setShowModal(false)}
					webResources={getResources}
				/>
			</ModalTitleWrapper>

			<div className="card">
				<div className="over">
					<div className="header">
						<div className="title">
							<div className="icon">
								<GlobeWebIcon />
							</div>
							<span>Domains and subdomains</span>
						</div>

						<div className="actions">
							<div
								onClick={() => {
									if (props.isLoading) return;

									setShowModal(true);
									setShowModalStr('add_domain');
								}}>
								Add domain
							</div>
							<div
								onClick={() => {
									if (props.isLoading) return;

									setShowModal(true);
									setShowModalStr('add_subdomain');
								}}>
								Add subdomain
							</div>
						</div>
					</div>

					<TableV2
						columns={webResourcesColumns}
						rowsData={tableData}
						showEmpty={!props.isLoading && !Boolean(tableData.length)}
						showRows={!props.isLoading}
					/>
				</div>
			</div>
		</>
	);
};
