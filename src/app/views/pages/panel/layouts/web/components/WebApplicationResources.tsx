import { useState, type FC } from 'react';
import { useNavigate } from 'react-router';
import { useDeleteWebResource } from '@resourcesHooks/web/useDeleteWebResources.ts';
import type { ColumnTableV3 } from '@interfaces/table.ts';
import type { Webresource } from '@interfaces/panel.ts';
import { useReportStore, type ReportStoreState } from '@stores/report.store.ts';
import useModal from '#commonHooks/useModal.ts';
import { LocationItem } from '@standalones/utils/LocationItem.tsx';
import {
	TrashIcon,
	GlobeWebIcon,
	BugIcon,
	DocumentIcon,
	CredentialIcon,
	MagnifyingGlassIcon,
} from '@icons';
import ConfirmModal from '@modals/ConfirmModal.tsx';
import ModalTitleWrapper from '@modals/modalwrapper/ModalTitleWrapper.tsx';
import AddSubDomainModal from '@modals/adding-modals/AddSubDomainModal.tsx';
import AddDomainModal from '@modals/adding-modals/AddDomainModal.tsx';
import { useUserRole } from '#commonUserHooks/useUserRole';
import Show from '@defaults/Show';
import useCredentialStore from '@stores/credential.store.ts';
import useModalStore from '@stores/modal.store.ts';
import { ModalInput } from '@defaults/ModalInput.tsx';
import {
	MODAL_KEY_OPEN,
	RESOURCE_CLASS,
	TABLE_KEYS,
} from '@/app/constants/app-texts';
import Tablev3 from '@table/v3/Tablev3';
import TextChild from '@standalones/utils/TextChild';
import useTableStoreV3 from '@table/v3/tablev3.store';

interface WebResourcesProps {
	refresh: () => void;
	webResources: Webresource[];
	isLoading: boolean;
}

interface SelectedResource {
	id: string;
	domain: string;
	serverIp: string;
}

const webColumns: ColumnTableV3[] = [
	{
		header: 'ID',
		key: 'id',
		styles: 'item-cell-1',
		weight: '5%',
		render: (ID: any) => ID,
	},
	{
		header: 'domain',
		key: TABLE_KEYS.FULL_WITH_NEXT,
		styles: 'item-cell-2',
		weight: '53.5%',
		render: (row: any, next?: any) =>
			!row?.resource_domain_dad ? (
				row.resource_domain
			) : (
				<TextChild
					subNetwork={row.resource_domain}
					isLast={!next || (next && !next.resource_domain_dad)}
				/>
			),
	},
	{
		header: 'server ip',
		key: 'main_server',
		styles: 'item-cell-3',
		weight: '10.5%',
		render: (ip: any) => ip,
	},
	{
		header: 'area',
		key: TABLE_KEYS.FULL_ROW,
		styles: 'item-cell-4',
		weight: '13%',
		render: (row: any) => (
			<LocationItem
				country={row?.server_pais || ''}
				countryCode={row?.server_pais_code || ''}
			/>
		),
	},
];

export const WebApplicationResources: FC<WebResourcesProps> = ({
	isLoading,
	refresh,
	webResources,
}) => {
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
	const { removeItem } = useTableStoreV3();

	const createIssue = (id: string) => {
		navigate(userHaveAccess ? `/issues/create/web/${id}` : '', {
			state: { redirect: '/web' },
		});
	};
	const generateWebReport = (id: string, final_issues: any) => {
		if (Number(final_issues) >= 1) {
			openModal();
			setResourceID(id);
			setResourceType(RESOURCE_CLASS.WEB);
		}
	};
	const deleteWebResource = (row: any) => {
		setSelectedResource({
			id: row.id,
			domain: row.resourceDomain,
			serverIp: row.mainServer,
		});
		setShowModal(true);
		setShowModalStr(MODAL_KEY_OPEN.DELETE_WEB);
	};
	const addCreds = (id: string) => {
		setResourceId(id);
		setCrendentialType(RESOURCE_CLASS.WEB);
		setIsOpen(true);
		setModalId(RESOURCE_CLASS.WEB);
	};

	const webColumnsWith = [
		...webColumns,
		{
			header: '',
			key: 'full-2',
			styles: 'item-cell-5 action',
			weight: '15.5%',
			render: (row: any) => (
				<div className="publish" key={`actr-${row.id}`}>
					<span
						className={`issue-icon ${userHaveAccess ? '' : 'disable'}`}
						title={`${isNormalUser() ? '' : 'Add Issue'}`}
						onClick={() => createIssue(row.id)}>
						<BugIcon isButton key={`bugi-${row.id}`} />
						<span className="codefend-text-red-200 issue-count">
							{row.final_issues}
						</span>
					</span>
					<span
						title="View report"
						className={`issue-printer ${Number(row.final_issues) == 0 ? 'off' : ''}`}
						onClick={() => generateWebReport(row.id, row.final_issues)}>
						<DocumentIcon
							isButton
							width={1.27}
							height={1.27}
							key={`doci-${row.id}`}
						/>
					</span>
					<Show when={isNormalUser() || isAdmin()}>
						<span title="Delete" onClick={() => deleteWebResource(row)}>
							<TrashIcon />
						</span>
					</Show>

					<span title="Add credentials" onClick={() => addCreds(row.id)}>
						<CredentialIcon key={`credi-${row.id}`} />
					</span>
				</div>
			),
		},
	];

	return (
		<>
			<AddDomainModal
				isOpen={showModal && showModalStr === MODAL_KEY_OPEN.ADD_DOMAIN}
				onDone={() => {
					setShowModal(!showModal);
					refresh();
				}}
				close={() => setShowModal(false)}
			/>
			<ModalTitleWrapper
				isActive={showModal && showModalStr === MODAL_KEY_OPEN.DELETE_WEB}
				close={() => setShowModal(false)}
				type="med-w"
				headerTitle="Delete web resource">
				<ConfirmModal
					header={`Are you sure to remove\n ${selectedResource.domain} - ${selectedResource.serverIp}`}
					cancelText="Cancel"
					confirmText="Delete"
					close={() => setShowModal(false)}
					action={() =>
						handleDelete(() => {
							refresh();
							removeItem(selectedResource.id);
						}, selectedResource.id).then(() => setShowModal(false))
					}
				/>
			</ModalTitleWrapper>

			<AddSubDomainModal
				isOpen={showModal && showModalStr === MODAL_KEY_OPEN.ADD_SUB_DOMAIN}
				onDone={() => {
					setShowModal(false);
					refresh();
				}}
				close={() => setShowModal(false)}
				webResources={webResources}
			/>
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
									if (isLoading) return;

									setShowModal(true);
									setShowModalStr(MODAL_KEY_OPEN.ADD_DOMAIN);
								}}>
								Add domain
							</div>
							<div
								onClick={() => {
									if (isLoading) return;

									setShowModal(true);
									setShowModalStr(MODAL_KEY_OPEN.ADD_SUB_DOMAIN);
								}}>
								Add subdomain
							</div>
						</div>
					</div>

					<Tablev3
						className="table-web"
						columns={webColumnsWith}
						rows={webResources}
						showRows={!isLoading}
						initialOrder="resource_domain"
						isNeedMultipleCheck
						isNeedSearchBar
					/>
				</div>
			</div>
		</>
	);
};
