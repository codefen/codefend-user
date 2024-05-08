import { type FC, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import {
	type Ticket,
	supportTicket,
	useModal,
	useTicketDelete,
	Sort,
} from '../../../../../../data';
import {
	ConfirmModal,
	ModalTitleWrapper,
	AddTicketModal,
} from '../../../../../components';
import { TrashIcon, MessageIcon } from '@icons';
import { TableV2 } from '@table/tablev2.tsx';

interface SupportTicketListProps {
	setSelectedTicket: (state: any) => void;
	isLoading: boolean;
	tickets: Ticket[];
	refresh: () => void;
}

export const SupportTicketList: FC<SupportTicketListProps> = (props) => {
	const { showModal, showModalStr, setShowModal, setShowModalStr } =
		useModal();
	const [selectedID, setSelectedTicketIdToDelete] = useState<string>('');
	const { deletTicket } = useTicketDelete();

	const handleDelete = (
		e: React.MouseEvent<HTMLDivElement, MouseEvent> | undefined,
	) => {
		if (e) e.preventDefault();

		deletTicket(selectedID)?.then(() => {
			toast.success('Successfully deleted');
			setShowModal(!showModal);
			props.setSelectedTicket(selectedID);
			props.refresh();
		});
	};
	const dataTable = props.tickets.map((ticket: Ticket) => ({
		ID: { value: ticket.id, style: '' },
		author: { value: '@' + ticket.user_username, style: 'username' },
		published: { value: ticket.creacion, style: 'date' },
		title: { value: ticket.cs_header, style: 'vul-title' },
		status: {
			value: ticket.condicion,
			style: `status ${ticket.condicion === 'open' && 'codefend-text-red'}`,
		},
		action: { value: 'actions', style: 'id' },
	}));

	return (
		<>
			<ModalTitleWrapper
				headerTitle="Add ticket"
				isActive={showModal && showModalStr === 'add_ticket'}
				close={() => setShowModal(!showModal)}
				type="med-w">
				<AddTicketModal
					close={() => setShowModal(!showModal)}
					onDone={() => {
						setShowModal(!showModal);
						props.refresh();
					}}
				/>
			</ModalTitleWrapper>

			<ModalTitleWrapper
				headerTitle="Delete ticket"
				isActive={showModal && showModalStr === 'delete_resource'}
				close={() => setShowModal(!showModal)}>
				<ConfirmModal
					header=""
					cancelText="Cancel"
					confirmText="Delete"
					close={() => setShowModal(!showModal)}
					action={(e) => handleDelete(e)}
				/>
			</ModalTitleWrapper>
			<div className="card">
				<div className="header">
					<div className="title">
						<div className="icon">
							<MessageIcon />
						</div>
						<span>Support Tickets</span>
					</div>
					<div className="actions">
						<div
							onClick={() => {
								setShowModal(!showModal);
								setShowModalStr('add_ticket');
							}}>
							Add Entry
						</div>
					</div>
				</div>
				<TableV2
					columns={supportTicket}
					rowsData={dataTable}
					showRows={!props.isLoading}
					showEmpty={!props.isLoading && dataTable.length === 0}
					tableAction={{
						icon: [
							{
								action: (id: string) => {
									setSelectedTicketIdToDelete(id);
									setShowModal(!showModal);
									setShowModalStr('delete_resource');
								},
								render: <TrashIcon />,
								style: '',
							},
						],
					}}
					selectItem={(id: String) => props.setSelectedTicket(id)}
					sort={Sort.asc}
				/>
			</div>
		</>
	);
};
