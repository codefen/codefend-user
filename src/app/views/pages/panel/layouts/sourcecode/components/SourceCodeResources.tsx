import { type FC, useState } from 'react';
import { useNavigate } from 'react-router';
import {
	type SourceCode,
	sourceCodeColumns,
	useModal,
	type TableItem,
} from '../../../../../../data';
import ConfirmModal from '@modals/ConfirmModal.tsx';
import { TrashIcon, BugIcon, SourceCodeIcon } from '@icons';
import { TableV2 } from '@table/tablev2.tsx';
import ModalTitleWrapper from '@modals/modalwrapper/ModalTitleWrapper.tsx';
import { AddRepositoryModal } from '../../../../../components/modals/adding-modals/AddRepositoryModal';

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

	const dataTable = props.sourceCode.map(
		(repository) =>
			({
				ID: { value: repository.id, style: 'id' },
				name: { value: repository.name, style: 'full-name' },
				url: { value: repository.accessLink, style: 'url' },
				visibility: { value: repository.isPublic, style: 'boolean' },
				sourceCode: { value: repository.sourceCode, style: 'source-code' },
			}) as Record<string, TableItem>,
	);

	const tableAction = {
		icon: [
			{
				action: (id: string) => {
					setSelectedSourceCodeIdToDelete(id);
					setShowModal(!showModal);
					setShowModalStr('delete_resource');
				},
				render: <TrashIcon />,
				style: '',
			},
			{
				action: (id: string) => {
					navigate(`/issues/create/source/${id}`);
				},
				render: <BugIcon isButton />,
				style: '',
			},
		],
	};

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
					tableAction={tableAction}
					showRows={!props.isLoading}
					showEmpty={!props.isLoading && dataTable.length === 0}
					sizeY={90}
				/>
			</div>
		</>
	);
};
