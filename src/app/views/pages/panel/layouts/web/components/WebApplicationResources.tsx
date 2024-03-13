import React, { Fragment, useMemo, useState } from 'react';
import {
	Resouce,
	Webresources,
	generateIDArray,
	useDeleteWebResource,
	useModal,
	useReportStore,
} from '../../../../../../data';
import {
	AddDomainModal,
	AddSubDomainModal,
	BugIcon,
	ConfirmModal,
	EmptyCard,
	GlobeWebIcon,
	LocationItem,
	ModalTitleWrapper,
	PageLoader,
	PrinterIcon,
	Show,
	TrashIcon,
} from '../../../../../components';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

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

export const WebApplicationResources: React.FC<WebResourcesProps> = (props) => {
	const [selectedResource, setSelectedResource] = useState<SelectedResource>(
		{} as any,
	);
	const { openModal, setResourceID } = useReportStore((state) => state);
	const { showModal, setShowModal, showModalStr, setShowModalStr } =
		useModal();
	const { handleDelete } = useDeleteWebResource();
	const navigate = useNavigate();

	const getResources = useMemo(() => {
		const resources = props.isLoading ? [] : props.webResources;
		return resources !== undefined ? resources.reverse() : [];
	}, [props.webResources, props.isLoading]);

	const resourceKeys = useMemo(
		() => generateIDArray(getResources.length),
		[getResources],
	);

	const generateReport = (resourceID: string, count: any) => {
		if (Number(count) >= 1) {
			openModal();
			setResourceID(resourceID);
		} else {
			toast.error(
				'The resource still does not have issues to make a report',
			);
		}
	};

	const TableMemo = useMemo(
		() =>
			getResources.map((mainNetwork: Webresources, i: number) => (
				<Fragment key={resourceKeys[i]}>
					<div className="item left-marked">
						<div className="id">{mainNetwork.id}</div>
						<div className="domain-name">
							{mainNetwork.resourceDomain}
						</div>
						<div className="server-ip">{mainNetwork.mainServer}</div>
						<div className="location">
							<span
								className={`flag flag-${mainNetwork.serverCountryCode.toLowerCase()}`}></span>
							<p className="">{mainNetwork.serverCountry}</p>
						</div>

						<div className="id action">
							<span
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
							<span
								onClick={() =>
									navigate(`/issues/create/web/${mainNetwork.id}`)
								}>
								<BugIcon isButton />
								<span className="codefend-text-red issue-count">
									{mainNetwork.issueCount}
								</span>
							</span>
							<span
								onClick={() =>
									generateReport(
										mainNetwork.id,
										mainNetwork.issueCount,
									)
								}
								className="issue-printer">
								<PrinterIcon isButton width={1.27} height={1.27} />
							</span>
						</div>
					</div>

					{mainNetwork.childs.map((subNetwork: Resouce) => (
						<div key={subNetwork.id} className="item">
							<div className="id">{subNetwork.id}</div>
							<div className="domain-name lined">
								<span className="sub-domain-icon-v"></span>
								<span className="sub-domain-icon-h"></span>
								<span className="sub-resource-domain">
									{subNetwork.resourceDomain}
								</span>
							</div>

							<div className="server-ip">{subNetwork.mainServer}</div>
							<div className="location">
								<span
									className={`flag flag-${subNetwork.serverCountryCode.toLowerCase()}`}></span>
								<p className="">{subNetwork.serverCountry}</p>
							</div>

							<div className="id action">
								<span
									onClick={() => {
										setSelectedResource({
											id: subNetwork.id,
											domain: subNetwork.resourceDomain,
											serverIp: subNetwork.mainServer,
										});
										setShowModal(true);
										setShowModalStr('delete_resource');
									}}>
									<TrashIcon />
								</span>
								<span
									onClick={() =>
										navigate(`/issues/create/web/${subNetwork.id}`)
									}>
									<BugIcon isButton />
									<span className="codefend-text-red-200 issue-count">
										{subNetwork.issueCount}
									</span>
								</span>
								<span
									className="issue-printer"
									onClick={() =>
										generateReport(
											mainNetwork.id,
											subNetwork.issueCount,
										)
									}>
									<PrinterIcon isButton width={1.27} height={1.27} />
								</span>
							</div>
						</div>
					))}
				</Fragment>
			)),
		[getResources],
	);

	const tableData = getResources.map(
		(mainNetwork: Webresources, i: number) => ({
			ID: { value: mainNetwork.id, style: 'id' },
			domainName: {
				value: mainNetwork.resourceDomain,
				style: 'domain-name',
			},
			mainServer: { value: mainNetwork.mainServer, style: 'server-ip' },
			location: {
				value: (
					<LocationItem
						country={mainNetwork.serverCountry}
						countryCode={mainNetwork.serverCountryCode}
					/>
				),
				style: 'location',
			},
			childs: {
				value: (
					<>
						{mainNetwork.childs.map((subNetwork: Resouce) => (
							<div key={'child_' + subNetwork.id} className="item">
								<div className="id">{subNetwork.id}</div>
								<div className="domain-name lined">
									<span className="sub-domain-icon-v"></span>
									<span className="sub-domain-icon-h"></span>
									<span className="sub-resource-domain">
										{subNetwork.resourceDomain}
									</span>
								</div>

								<div className="server-ip">{subNetwork.mainServer}</div>
								<LocationItem
									country={subNetwork.serverCountry}
									countryCode={subNetwork.serverCountryCode}
								/>
							</div>
						))}
					</>
				),
				style: '',
			},
		}),
	);

	return (
		<>
			<ModalTitleWrapper
				isActive={showModal && showModalStr === 'add_domain'}
				close={() => setShowModal(false)}
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
							<div
								onClick={() => {
									if (props.isLoading) return;
									alert('adding credentials');
								}}>
								Add Credentials
							</div>
						</div>
					</div>

					<div className="table">
						<div className="columns-name">
							<div className="id">id</div>
							<div className="domain-name">domain</div>
							<div className="server-ip">main server</div>
							<div className="location">location</div>
							<div className="id action">actions</div>
						</div>
						<Show when={!props.isLoading} fallback={<PageLoader />}>
							<div
								className="rows"
								// style={{ '--row-size': 80 + 'dvh' } as any}>
							>
								{TableMemo}
							</div>
						</Show>
						<Show when={!props.isLoading && getResources.length === 0}>
							<EmptyCard />
						</Show>
					</div>
				</div>
			</div>
		</>
	);
};
