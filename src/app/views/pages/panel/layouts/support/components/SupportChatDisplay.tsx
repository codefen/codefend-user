import { type FC, useContext, useEffect, useRef } from 'react';
import { ChatBoxType, type Ticket } from '../../../../../../data';
import { ChatBox, PageLoader, SimpleSection } from '../../../../../components';
import SelectedTicket from '../supportProvider';
import Show from '@defaults/Show.tsx';
import { MessageIcon } from '@icons';
import { toast } from 'react-toastify';
import { useParams } from 'react-router';
import { MessageList } from '../../../../../components/standalones/MessageList';
import { useSWRMessage } from '@panelHooks/useSWRTickets';
import { useUserData } from '#commonUserHooks/useUserData';
import { CHATBOX_TEXT } from '@/app/constants/app-toast-texts';
import { EMPTY_CS_TICKET } from '@/app/constants/empty';

export const SupportChatDisplay: FC = () => {
  const { getCompany } = useUserData();
  const { dad } = useParams();
  const selectedTicketID = useContext(SelectedTicket);
  const { data, isLoading, mutate } = useSWRMessage(dad || selectedTicketID || '0', getCompany());

  const onDone = (newMessage?: any) => {
    const viewMessage = localStorage.getItem(CHATBOX_TEXT.VIEW_MESSAGE)
      ? JSON.parse(localStorage.getItem(CHATBOX_TEXT.VIEW_MESSAGE) as string)
      : { view: true };

    if (newMessage) {
      mutate({ ...data, childs: [...data.childs, newMessage] });
    }

    if (viewMessage.view) {
      toast.success(CHATBOX_TEXT.WAIT_FOR_RESPONSE);
      localStorage.setItem(CHATBOX_TEXT.VIEW_MESSAGE, JSON.stringify({ view: false }));
    }
  };

  const { childs, ...ticketDad } = data ? data : EMPTY_CS_TICKET;
  const alltickets = [ticketDad, ...childs];

  return (
    <>
      <div className="card messages">
        <SimpleSection header={ticketDad.cs_header} icon={<MessageIcon />}>
          <div className="content">
            <Show when={!isLoading} fallback={<PageLoader />}>
              <MessageList tickets={alltickets} />
            </Show>
          </div>
        </SimpleSection>

        <ChatBox type={ChatBoxType.SUPPORT} onDone={onDone} selectedID={selectedTicketID} />
      </div>
    </>
  );
};
