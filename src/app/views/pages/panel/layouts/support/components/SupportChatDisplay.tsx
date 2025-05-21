import { type FC, useContext } from 'react';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';

import { ChatBoxType } from '@interfaces/panel';
import { ChatBox } from '@/app/views/components/ChatBox/ChatBox';
import { PageLoader } from '@/app/views/components/loaders/Loader';
import Show from '@/app/views/components/Show/Show';
import { MessageIcon } from '@icons';
import { MessageList } from '@/app/views/components/MessageList/MessageList';
import { useSWRMessage } from '@panelHooks/chats/useSWRTickets';
import { useUserData } from '#commonUserHooks/useUserData';
import { CHATBOX_TEXT } from '@/app/constants/app-toast-texts';
import { EMPTY_CS_TICKET } from '@/app/constants/empty';
import { SimpleSection } from '@/app/views/components/SimpleSection/SimpleSection';
import { useGlobalFastField } from '@/app/views/context/AppContextProvider';

export const SupportChatDisplay: FC<{ selectedTicket: any }> = ({ selectedTicket }) => {
  const { getCompany } = useUserData();
  const { data, isLoading, mutate } = useSWRMessage(selectedTicket?.id || '0', getCompany());

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

        <ChatBox type={ChatBoxType.SUPPORT} onDone={onDone} selectedID={selectedTicket?.id} />
      </div>
    </>
  );
};
