import { type FC } from 'react';
import { useLocation } from 'react-router';
import { ChatBoxType } from '../../../../../../data';
import { ChatBox } from '@/app/views/components/ChatBox/ChatBox';
import { MessageIcon } from '@icons';
import { PageLoader } from '@/app/views/components/loaders/Loader';
import Show from '@/app/views/components/Show/Show';
import { toast } from 'react-toastify';
import { useUserData } from '#commonUserHooks/useUserData';
import { useSWRIssueMessage } from '@panelHooks/issues/useSWRIssueMessage';
import { MessageList } from '@/app/views/components/MessageList/MessageList';
import { CHATBOX_TEXT } from '@/app/constants/app-toast-texts';
import { SimpleSection } from '@/app/views/components/SimpleSection/SimpleSection';

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
