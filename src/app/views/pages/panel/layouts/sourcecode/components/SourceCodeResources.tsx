import { type FC, useState } from 'react';
import { useNavigate } from 'react-router';
import {
	type SourceCode,
	sourceCodeColumns,
	useModal,
	type TableItem,
	sourceCodeColumnsWithoutAction,
	useReportStore,
} from '../../../../../../data';
import ConfirmModal from '@modals/ConfirmModal.tsx';
import {
	TrashIcon,
	BugIcon,
	SourceCodeIcon,
	CredentialIcon,
	DocumentIcon,
} from '@icons';
import { TableV2 } from '@table/tablev2.tsx';
import ModalTitleWrapper from '@modals/modalwrapper/ModalTitleWrapper.tsx';
import { AddRepositoryModal } from '../../../../../components/modals/adding-modals/AddRepositoryModal';
import { useUserRole } from '#commonUserHooks/useUserRole';
import useCredentialStore from '@stores/credential.store';
import useModalStore from '@stores/modal.store';
import Show from '@defaults/Show';
import { toast } from 'react-toastify';

interface SourceCodeProps {
	isLoading: boolean;
	sourceCode: SourceCode[];
	onDelete: (deleted: string) => void;
	update: (params: any) => void;
}

export const SourceCodeResources: FC<SourceCodeProps> = (props) => {
	const { showModal, showModalStr, setShowModal, setShowModalStr } =
		useModal();
	const [selectedSourceCodeIdToDelete, setSelectedSourceCodeIdToDelete] =
		useState<string>('');
	const navigate = useNavigate();
	const { isAdmin, isProvider, isNormalUser } = useUserRole();
	const { setCrendentialType, setResourceId } = useCredentialStore();
	const { setIsOpen, setModalId } = useModalStore();
	const { openModal, setResourceID, setResourceType } = useReportStore(
		(state: any) => state,
	);
	const generateReport = (resourceID: string, count: any) => {
		if (Number(count) >= 1) {
			openModal();
			setResourceID(resourceID);
			setResourceType('source');
		} else {
			toast.error(
				'The resource still does not have issues to make a report',
			);
		}
	};
	const dataTable = props.sourceCode.map(
		(repository) =>
			({
				ID: { value: repository.id, style: 'id' },
				name: { value: repository.name, style: 'full-name' },
				url: { value: repository.accessLink, style: 'url' },
				visibility: { value: repository.isPublic, style: 'boolean' },
				sourceCode: { value: repository.sourceCode, style: 'source-code' },
				action: {
					value: (
						<>
							<span
								className="issue-icon"
								title={`${isNormalUser() ? '' : 'Add Issue'}`}
								onClick={() =>
									navigate(
										isProvider() || isAdmin()
											? `/issues/create/source/${repository.id}`
											: '',
									)
								}>
								<BugIcon isButton />
								<span className="codefend-text-red-200 issue-count">
									{repository.finalIssue}
								</span>
							</span>
							<span
								title="View report"
								className={`issue-printer ${Number(repository.finalIssue) == 0 ? 'off' : ''}`}
								onClick={() =>
									generateReport(repository.id, repository.finalIssue)
								}>
								<DocumentIcon isButton width={1.27} height={1.27} />
							</span>
							<Show when={isNormalUser() || isAdmin()}>
								<span
									title="Delete"
									onClick={() => {
										setSelectedSourceCodeIdToDelete(repository.id);
										setShowModal(!showModal);
										setShowModalStr('delete_resource');
									}}>
									<TrashIcon />
								</span>
							</Show>

							<span
								title="Add credentials"
								onClick={() => {
									setResourceId(repository.id);
									setCrendentialType('source');
									setIsOpen(true);
									setModalId('source');
								}}>
								<CredentialIcon />
							</span>
						</>
					),
					style: 'id action',
				},
			}) as Record<string, TableItem>,
	);

	return (
		<>
			<ModalTitleWrapper
				close={() => setShowModal(false)}
				headerTitle="Delete source code"
				isActive={showModal && showModalStr === 'delete_resource'}>
				<ConfirmModal
					cancelText="Cancel"
					confirmText="Delete"
					header=""
					close={() => setShowModal(!showModal)}
					action={() => {
						props.onDelete(selectedSourceCodeIdToDelete);
						setShowModal(!showModal);
					}}
				/>
			</ModalTitleWrapper>

			<ModalTitleWrapper
				close={() => setShowModal(false)}
				headerTitle="Add repository"
				type="med-w"
				isActive={showModal && showModalStr === 'add_repository'}>
				<AddRepositoryModal
					onDone={(params: any) => {
						props.update(params);
						setShowModal(!showModal);
					}}
					close={() => setShowModal(!showModal)}
				/>
			</ModalTitleWrapper>
			<div className="card">
				<div className="header">
					<div className="title">
						<div className="icon">
							<SourceCodeIcon />
						</div>
						<span>Source code</span>
					</div>
					<div className="actions">
						<div
							onClick={() => {
								setShowModal(true);
								setShowModalStr('add_repository');
							}}>
							Add repository
						</div>
					</div>
				</div>
				<TableV2
					rowsData={dataTable}
					columns={sourceCodeColumns}
					showRows={!props.isLoading}
					showEmpty={!props.isLoading && dataTable.length === 0}
				/>
			</div>
		</>
	);
};
