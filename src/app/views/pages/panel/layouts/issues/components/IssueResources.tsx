import { type FC, useState } from 'react';
import {
	type Issues,
	Sort,
	issueColumns,
	useDeleteIssue,
	useModal,
	useNewWindows,
} from '../../../../../../data';
import {
	BugIcon,
	ConfirmModal,
	ModalTitleWrapper,
	RiskScore,
	TableV2,
	TrashIcon,
} from '../../../../../components';
import { useNavigate } from 'react-router';
import '../../../../../components/Table/table.scss';

interface IssueResourcesProps {
	isLoading: boolean;
	issues: Issues[];
	refresh: () => void;
}

export const IssueResources: FC<IssueResourcesProps> = (props) => {
	const [selected, setSelectedId] = useState('');
	const { showModal, setShowModal } = useModal();
	const { handleDelete } = useDeleteIssue();
	const navigate = useNavigate();
	const { baseUrl } = useNewWindows();

	const dataTable = props.issues.map((issue: Issues) => ({
		ID: { value: issue.id, style: '' },
		published: { value: issue.createdAt, style: 'date' },
		author: { value: issue.researcherUsername, style: 'username' },
		type: { value: issue.resourceClass, style: 'vul-class' },
		risk: { value: issue.riskLevel, style: 'vul-risk' },
		score: {
			value: <RiskScore riskScore={issue.riskScore} />,
			style: 'vul-score',
		},
		issueTitle: { value: issue.name, style: 'vul-title' },
		status: { value: issue.condition, style: 'vul-condition' },
		action: { value: 'actions', style: 'id' },
	}));
	const actionTable = {
		icon: [
			{
				action: (id: string) => {
					setSelectedId(id);
					setShowModal(!showModal);
				},
				render: <TrashIcon />,
				style: 'trash',
			},
		],
	};

	return (
		<>
			<ModalTitleWrapper
				headerTitle="Delete issue"
				isActive={showModal}
				close={() => setShowModal(!showModal)}>
				<ConfirmModal
					cancelText="Cancel"
					confirmText="Delete"
					header={`Are you sure you want to delete: '${props.issues.find((issue) => issue.id === selected)?.name}'?`}
					close={() => setShowModal(false)}
					action={() => {
						handleDelete(selected)?.then(() => {
							setShowModal(false);
							props.refresh();
						});
					}}
				/>
			</ModalTitleWrapper>
			<div className="card">
				<div className="header">
					<div className="title">
						<div className="icon">
							<BugIcon />
						</div>
						<span>Issues</span>
					</div>
					<div className="actions">
						<div
							className=""
							onClick={() => {
								navigate('/issues/create');
							}}>
							Add finding
						</div>
					</div>
				</div>

				<TableV2
					rowsData={dataTable}
					columns={issueColumns}
					showRows={!props.isLoading}
					showEmpty={!props.isLoading && dataTable.length === 0}
					sizeY={'calc(90dvh - 85px)'}
					tableAction={actionTable}
					selectItem={(id: any) => navigate(`/issues/update/${id}`)}
					sort={Sort.asc}
					urlNav={`${baseUrl}/issues/update/`}
				/>
			</div>
		</>
	);
};
