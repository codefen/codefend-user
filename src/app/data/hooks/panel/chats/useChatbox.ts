import { useMessageState } from '@panelHooks/chats/useMessageState';
import { useAddIssueMessage } from '@panelHooks/issues/useAddMessage';
import { useAddSupportMessage } from '@panelHooks/support/useAddSupportMessage';

const useChatbox = () => {
  const { message, isLoading, getCompany, getUserdata, setMessage, fetcher } = useMessageState();
  const { handleIssueSubmit } = useAddIssueMessage(message, setMessage, fetcher, getCompany);
  const { handleSupportSubmit } = useAddSupportMessage(
    message,
    setMessage,
    fetcher,
    getCompany,
    getUserdata
  );

  return {
    message,
    setMessage,
    isAdding: isLoading,
    handleIssueSubmit,
    handleSupportSubmit,
  };
};

export default useChatbox;
