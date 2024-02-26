import React, { useContext, useState } from 'react';
import {
	SupportProps,
	supportTicket,
	useModal,
	useTicketDelete,
} from '../../../../../../data';
import {
	ConfirmModal,
	MessageIcon,
	ModalTitleWrapper,
	TrashIcon,
	AddTicketModal,
	TableV2,
	Sort,
} from '../../../../../components';

import SelectedTicket from '../supportProvider';
import { toast } from 'react-toastify';

interface SupportTicketListProps {
	setSelectedTicket: (state: any) => void;
	isLoading: boolean;
	tickets: SupportProps[];
	refresh: () => void;
}

export const SupportTicketList: React.FC<SupportTicketListProps> = (props) => {
	const { showModal, showModalStr, setShowModal, setShowModalStr } =
		useModal();
	const [selectedID, setSelectedTicketIdToDelete] = useState<string>('');
	const selectedTicketID = useContext(SelectedTicket);
	const { deletTicket } = useTicketDelete();

	const handleDelete = (
		e: React.MouseEvent<HTMLDivElement, MouseEvent> | undefined,
	) => {
		if (e) {
			e.preventDefault();
		}
		deletTicket(selectedID)?.then(() => {
			toast.success('Successfully deleted');
			setShowModal(!showModal);
			props.refresh();
		});
	};
	const dataTable = props.tickets.map((ticket: SupportProps) => ({
		ID: { value: ticket.id, style: '' },
		author: { value: '@' + ticket.userUsername, style: 'username' },
		published: { value: ticket.createdAt, style: 'date' },
		title: { value: ticket.csHeader, style: 'vul-title' },
		status: {
			value: ticket.condition,
			style: `status ${ticket.condition === 'open' && 'codefend-text-red'}`,
		},
		action: { value: 'actions', style: 'id' },
	}));

	return (
		<>
			<ModalTitleWrapper
				headerTitle="Add ticket"
				isActive={showModal && showModalStr === 'add_ticket'}
				close={() => setShowModal(!showModal)}>
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
					sizeY={79}
					tableAction={{
						icon: [
							{
								action: (id: string) => {
									setSelectedTicketIdToDelete(id);
									setShowModal(!showModal);
									setShowModalStr('delete_resource');
								},
								render: <TrashIcon />,
							},
						],
						style: 'id',
					}}
					selectItem={(id: String) => props.setSelectedTicket(id)}
					sort={Sort.asc}
					initialSelect
				/>
			</div>
		</>
	);
};
