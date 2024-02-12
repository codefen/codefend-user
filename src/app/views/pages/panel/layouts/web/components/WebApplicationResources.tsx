import React, { Fragment, useCallback, useMemo, useState } from 'react';
import {
	AddDomainModal,
	AddSubDomainModal,
	GlobeWebIcon,
	EmptyCard,
	PageLoader,
	TrashIcon,
	ModalTitleWrapper,
	ConfirmModal,
	Show,
} from '../../../../../components';
import {
	Resouce,
	Webresources,
	generateIDArray,
	useDeleteWebResource,
	useModal,
} from '../../../../../../data';

interface WebResourcesProps {
	refresh: () => void;
	webResources: Webresources[];
	isLoading: boolean;
}

export const WebApplicationResources: React.FC<WebResourcesProps> = (props) => {
	const [selectedId, setSelectedId] = useState<string>('0');
	const { showModal, setShowModal, showModalStr, setShowModalStr } =
		useModal();
	const { handleDelete } = useDeleteWebResource();

	const getResources = useMemo(() => {
		const resources = props.isLoading ? [] : props.webResources;
		return resources !== undefined ? resources.reverse() : [];
	}, [props.webResources, props.isLoading]);

	const resourceKeys = useMemo(
		() => generateIDArray(getResources.length),
		[getResources],
	);

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

						<div
							className="id action"
							onClick={() => {
								setSelectedId(mainNetwork.id);
								setShowModal(true);
								setShowModalStr('delete_resource');
							}}>
							<TrashIcon />
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
								<TrashIcon
									action={() => {
										setSelectedId(subNetwork.id);
										setShowModal(true);
										setShowModalStr('delete_resource');
									}}
								/>
							</div>
						</div>
					))}
				</Fragment>
			)),
		[getResources],
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
					header=""
					cancelText="Cancel"
					confirmText="Delete"
					close={() => setShowModal(false)}
					action={() =>
						handleDelete(props.refresh, selectedId).then(() =>
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
								style={{ '--row-size': 77 + 'dvh' } as any}>
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
