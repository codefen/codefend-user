import React, { Fragment, useCallback, useMemo, useState } from 'react';
import {
	SourceCode,
	generateIDArray,
	sourceCodeColumns,
	useModal,
} from '../../../../../../data';
import {
	ConfirmModal,
	ModalTitleWrapper,
	SourceCodeIcon,
	TrashIcon,
	TableV2,
	ActionSection,
	TableItem,
} from '../../../../../components';
import { AddRepositoryModal } from '../../../../../components/modals/AddRepositoryModal';

interface SourceCodeProps {
	isLoading: boolean;
	sourceCode: SourceCode[];
	onDelete: (deleted: string) => void;
	update: (params: any) => void;
}

export const SourceCodeResources: React.FC<SourceCodeProps> = (props) => {
	const { showModal, showModalStr, setShowModal, setShowModalStr } =
		useModal();
	const [selectedSourceCodeIdToDelete, setSelectedSourceCodeIdToDelete] =
		useState<string>('');
	const [isDeletingSourceCode, setIsDeletingSourceCode] = useState(false);

	const handleDelete = useCallback(() => {
		setIsDeletingSourceCode(true);
		props.onDelete(selectedSourceCodeIdToDelete);
	}, []);

	const sourceKeys = useMemo(() => {
		return props.isLoading ? [] : generateIDArray(props.sourceCode.length);
	}, [props.sourceCode]);

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
		icon: <TrashIcon />,
		style: 'id cursor-pointer p-3 flex',
		action: (id: string) => {
			setSelectedSourceCodeIdToDelete(id);
			setShowModal(!showModal);
			setShowModalStr('delete_resource');
		},
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
					tableAction={tableAction}
					columns={sourceCodeColumns}
					showRows={!props.isLoading}
					showEmpty={!props.isLoading && dataTable.length === 0}
					sizeY={90}
				/>
			</div>
		</>
	);
};
