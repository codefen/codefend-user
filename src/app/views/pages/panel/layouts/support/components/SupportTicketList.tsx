import { type FC, type MouseEvent, useState } from 'react';
import { toast } from 'react-toastify';
import { type Ticket } from '@interfaces/panel';
import { supportTicket } from '@mocks/defaultData';
import useModal from '@hooks/common/useModal';
import { AddTicketModal } from '@modals/adding-modals/AddTicketModal';
import ModalTitleWrapper from '@modals/modalwrapper/ModalTitleWrapper.tsx';
import ConfirmModal from '@modals/ConfirmModal.tsx';
import { TrashIcon, MessageIcon } from '@icons';
import { TableV2 } from '@table/tablev2.tsx';
import { useTicketDelete } from '@panelHooks/support/useTicketDelete.ts';
import { SUPPORT_PANEL_TEXT } from '@/app/constants/app-toast-texts';
import { MODAL_KEY_OPEN } from '@/app/constants/app-texts';

interface SupportTicketListProps {
  setSelectedTicket: (state: any) => void;
  isLoading: boolean;
  tickets: Ticket[];
  refresh: () => void;
}

export const SupportTicketList: FC<SupportTicketListProps> = props => {
  const { showModal, showModalStr, setShowModal, setShowModalStr } = useModal();
  const [selectedID, setSelectedTicketIdToDelete] = useState<string>('');
  const { deletTicket } = useTicketDelete();

  const handleDelete = (e: MouseEvent<HTMLDivElement, MouseEvent> | undefined) => {
    if (e) e.preventDefault();

    deletTicket(selectedID)?.then(() => {
      toast.success(SUPPORT_PANEL_TEXT.DELETED_TICKET);
      setShowModal(!showModal);
      props.setSelectedTicket('');
      props.refresh();
    });
  };
  const dataTable = props.tickets.map((ticket: Ticket) => ({
    ID: { value: ticket.id, style: '' },
    Identifier: { value: Number(ticket.id), style: 'id' },
    author: { value: `${ticket.user_username}`, style: 'username' },
    published: { value: ticket.creacion, style: 'date' },
    title: { value: ticket.cs_header, style: 'vul-title' },
    status: {
      value: ticket.condicion,
      style: `status ${ticket.condicion === 'open' && 'codefend-text-red'}`,
    },
    action: { value: 'actions', style: 'id action' },
  }));

  return (
    <>
      <AddTicketModal
        isOpen={showModal && showModalStr === MODAL_KEY_OPEN.ADD_TICKET}
        close={() => setShowModal(!showModal)}
        onDone={() => {
          setShowModal(!showModal);
          props.refresh();
        }}
      />

      <ModalTitleWrapper
        headerTitle="Delete ticket"
        isActive={showModal && showModalStr === 'delete_resource'}
        close={() => setShowModal(!showModal)}>
        <ConfirmModal
          header=""
          cancelText="Cancel"
          confirmText="Delete"
          close={() => setShowModal(!showModal)}
          action={e => handleDelete(e)}
        />
      </ModalTitleWrapper>
      <div className="card">
        <div className="over">
          <div className="table-title">
            <h2 className="title">
              <div className="icon">
                <MessageIcon />
              </div>
              Support Tickets
            </h2>
            {/* <div className="actions">
            <div
              onClick={() => {
                setShowModal(!showModal);
                setShowModalStr(MODAL_KEY_OPEN.ADD_TICKET);
              }}>
              Add Entry
            </div>
          </div> */}
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
                    setShowModalStr(MODAL_KEY_OPEN.DELETE_TICKET);
                  },
                  render: <TrashIcon />,
                  style: '',
                },
              ],
            }}
            selectItem={(id: String) => props.setSelectedTicket(id)}
          />
        </div>
      </div>
    </>
  );
};
