import { type FC, type MouseEvent, useState } from 'react';
import { toast } from 'react-toastify';
import { type Ticket } from '@interfaces/panel';
import { AddTicketModal } from '@modals/adding-modals/AddTicketModal';
import ModalTitleWrapper from '@modals/modalwrapper/ModalTitleWrapper.tsx';
import ConfirmModal from '@modals/ConfirmModal.tsx';
import { TrashIcon, MessageIcon, RobotIcon, ChatCircleIcon } from '@icons';
import { useTicketDelete } from '@panelHooks/support/useTicketDelete.ts';
import { SUPPORT_PANEL_TEXT } from '@/app/constants/app-toast-texts';
import { MODAL_KEY_OPEN, TABLE_KEYS } from '@/app/constants/app-texts';
import type { ColumnTableV3 } from '@interfaces/table';
import Tablev3 from '@table/v3/Tablev3';
import useModalStore from '@stores/modal.store';
import { useGlobalFastField } from '@/app/views/context/AppContextProvider';
import { PrimaryButton } from '@buttons/index';

interface SupportTicketListProps {
  isLoading: boolean;
  tickets: Ticket[];
  refresh: () => void;
}

const columns: ColumnTableV3[] = [
  {
    header: 'title',
    key: 'cs_header',
    styles: 'item-cell-support-1',
    weight: '70%',
    render: (data: any) => data,
  },
  {
    header: 'status',
    key: 'condicion',
    styles: 'item-cell-support-2',
    weight: '20%',
    render: (data: any) => (
      <span className={`${data === 'open' ? 'codefend-text-red' : ''}`}>{data}</span>
    ),
  },
];

export const SupportTicketList: FC<SupportTicketListProps> = ({ refresh, tickets, isLoading }) => {
  const { isOpen, modalId, setIsOpen, setModalId } = useModalStore();
  const [selectedID, setSelectedTicketIdToDelete] = useState<string>('');
  const { deletTicket } = useTicketDelete();
  const selectedTicket = useGlobalFastField('selectedTicket');

  const handleDelete = (e: MouseEvent<HTMLDivElement, MouseEvent> | undefined) => {
    if (e) e.preventDefault();

    deletTicket(selectedID)?.then(() => {
      toast.success(SUPPORT_PANEL_TEXT.DELETED_TICKET);
      setIsOpen(!isOpen);
      refresh();
    });
  };

  const handleOpenDeleteModal = (id: string) => {
    setSelectedTicketIdToDelete(id);
    setIsOpen(!isOpen);
    setModalId(MODAL_KEY_OPEN.DELETE_TICKET);
  };

  const supportTicketsWithActions = [
    ...columns,
    {
      header: '',
      key: TABLE_KEYS.ACTION,
      type: TABLE_KEYS.FULL_ROW,
      styles: 'item-cell-support-3',
      weight: '10%',
      render: (data: any) => (
        <div className="publish">
          <span title="Delete" onClick={() => handleOpenDeleteModal(data.id)}>
            <TrashIcon />
          </span>
        </div>
      ),
    },
  ];

  return (
    <>
      <AddTicketModal
        isOpen={isOpen && modalId === MODAL_KEY_OPEN.ADD_TICKET}
        close={() => setIsOpen(!isOpen)}
        onDone={() => {
          setIsOpen(!isOpen);
          refresh();
        }}
      />

      <ModalTitleWrapper
        headerTitle="Delete ticket"
        isActive={isOpen && modalId === MODAL_KEY_OPEN.DELETE_TICKET}
        close={() => setIsOpen(!isOpen)}>
        <ConfirmModal
          header="Are you sure you want to delete this ticket?"
          cancelText="Cancel"
          confirmText="Delete"
          close={() => setIsOpen(!isOpen)}
          action={e => handleDelete(e)}
        />
      </ModalTitleWrapper>
      <div className="card tickets-list">
        <div className="over">
          <div className="header">
            <div className="table-title">
              <h2>
                <div className="icon">
                  <MessageIcon />
                </div>
                Tickets
              </h2>
            </div>
          </div>
          <Tablev3
            columns={supportTicketsWithActions}
            rows={tickets}
            showRows={!isLoading}
            action={ticket => selectedTicket.set(ticket)}
            selected={selectedTicket.get}
            selectedKey="id"
            emptyTitle="There are no conversations yet"
            emptyInfo="Ask your first question to get started."
            emptyIcon={<ChatCircleIcon width="40" height="40" />}
          />
        </div>
      </div>
    </>
  );
};
