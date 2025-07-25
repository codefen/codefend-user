import { useRef, type FormEvent, type FC } from 'react';
import { toast } from 'react-toastify';
import { CHATBOX_TEXT } from '@/app/constants/app-toast-texts';
import useChatbox from '@panelHooks/chats/useChatbox';
import { ChatBoxType } from '@interfaces/panel';
import { PrimaryButton } from '@buttons/index';

interface ChatBoxProps {
  type: ChatBoxType;
  onDone: (newMessage?: string) => void;
  selectedID: string;
}

export const ChatBox: FC<ChatBoxProps> = props => {
  const { message, setMessage, isAdding, handleIssueSubmit, handleSupportSubmit } = useChatbox();
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleSubmit = (e: FormEvent | KeyboardEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!textAreaRef.current?.value!.trim()) {
      toast.error(CHATBOX_TEXT.EMPTY_MESSAGE);
      return;
    }
    if (props.type === ChatBoxType.ISSUE) {
      handleIssueSubmit(props.selectedID, props.onDone, textAreaRef.current?.value!);
    } else {
      handleSupportSubmit(props.selectedID, props.onDone, textAreaRef.current?.value!);
    }
  };

  const requestInfo = (e: FormEvent | KeyboardEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (props.type === ChatBoxType.ISSUE && !isAdding) {
      handleIssueSubmit(
        props.selectedID,
        props.onDone,
        'Could you please provide more information about this issue?'
      );
    }
  };

  const handleEnter = (e: any) => {
    if (!Boolean(e.target.value.trim())) return;

    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };
  const isDisabled = !message.trim() || isAdding || props.selectedID == '';
  return (
    <div className={`sender ${props.selectedID == '' ? 'sender-disable' : ''}`}>
      {/* <div className="header">
        <div className="title">
          <div className="icon">
            <MessageIcon />
          </div>
          <span>Add new entry</span>
        </div>
        <PrimaryButton
          text={<SendIcon />}
          isDisabled={isDisabled}
          disabledLoader
          hideContent={isAdding}
          click={handleSubmit}
          className={`send-extra-styles log-inputs no-border-height ${isDisabled ? 'no-pointers' : ''}`}
          buttonStyle="send"
        />
      </div> */}

      <div className="chatbox-container ">
        <div className="no-border-bottom chatbox-content">
          <textarea
            onKeyDown={handleEnter}
            disabled={props.selectedID == '' || isAdding}
            ref={textAreaRef}
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="add a new comment here..."
            name="textArea"
            required></textarea>
        </div>
        {/* {props.type === ChatBoxType.ISSUE ? (
          <div className="chatbox-actions">
            <span
              className={`chatbox-button ${isAdding ? 'disabled-btn' : ''}`}
              role="button"
              onClick={requestInfo}
              aria-disabled={isAdding}>
              request info
            </span>
          </div>
        ) : (
          <div className="text-format chatbox-img  no-border-bottom">
            <img src="/codefend/user-icon-gray.svg" alt="user-picture" />
          </div>
        )}         */}
        <div className="bottom">
          <div className="chatbox-actions">
            {props.type === ChatBoxType.ISSUE ? (
              <span
                className={`chatbox-button ${isAdding ? 'disabled-btn' : ''}`}
                role="button"
                onClick={requestInfo}
                aria-disabled={isAdding}>
                Request info
              </span>
            ) : null}
          </div>

          <PrimaryButton
            text="Send"
            isDisabled={isDisabled}
            disabledLoader
            hideContent={isAdding}
            click={handleSubmit}
            className={`send-extra-styles log-inputs ${isDisabled ? 'no-pointers' : ''}`}
            buttonStyle="send"
          />
        </div>
      </div>
    </div>
  );
};
