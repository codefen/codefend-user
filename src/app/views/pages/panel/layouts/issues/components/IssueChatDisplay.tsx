import { type FC } from 'react';
import { useLocation } from 'react-router';
import { ChatBoxType } from '../../../../../../data';
import { ChatBox } from '@standalones/ChatBox';
import { MessageIcon } from '@icons';
import { PageLoader } from '@/app/components/loaders/Loader';
import { SimpleSection } from '@/app/components/SimpleSection/SimpleSection';
import Show from '@/app/components/Show/Show';
import { toast } from 'react-toastify';
import { useUserData } from '#commonUserHooks/useUserData';
import { useSWRIssueMessage } from '@panelHooks/issues/useSWRIssueMessage';
import { MessageList } from '@standalones/MessageList';
import { CHATBOX_TEXT } from '@/app/constants/app-toast-texts';

interface IssueChatDisplayProps {
  id: string;
}
export const IssueChatDisplay: FC<IssueChatDisplayProps> = ({ id }) => {
  const location = useLocation();
  const { getCompany } = useUserData();
  const { data, isLoading, mutate } = useSWRIssueMessage(id, getCompany());

  const onDone = (newMessage?: any) => {
    const viewMessage = localStorage.getItem(CHATBOX_TEXT.VIEW_MESSAGE)
      ? JSON.parse(localStorage.getItem(CHATBOX_TEXT.VIEW_MESSAGE) as string)
      : { view: true };

    if (newMessage) {
      mutate([...data, newMessage]);
    }
    if (viewMessage.view) {
      toast.success(CHATBOX_TEXT.WAIT_FOR_RESPONSE);
      localStorage.setItem(CHATBOX_TEXT.VIEW_MESSAGE, JSON.stringify({ view: false }));
    }
  };
  return (
    <div
      className={`card messages ${
        location.pathname.startsWith('/issues/create') && 'active animate-pulse"'
      }`}>
      <SimpleSection header="Customer support" icon={<MessageIcon />}>
        <>
          <div className="content">
            <Show when={!isLoading} fallback={<PageLoader />}>
              <MessageList tickets={data} />
            </Show>
          </div>
          <ChatBox type={ChatBoxType.ISSUE} selectedID={id} onDone={onDone} />
        </>
      </SimpleSection>
    </div>
  );
};
