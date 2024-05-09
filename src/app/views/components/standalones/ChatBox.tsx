import React, { useRef } from 'react';
import { MessageIcon, PrimaryButton, SendIcon } from '..';
import { useChatbox, ChatBoxType } from '../../../data';
import { toast } from 'react-toastify';

interface ChatBoxProps {
	type: ChatBoxType;
	onDone: (newMessage?: string) => void;
	selectedID: string;
}

export const ChatBox: React.FC<ChatBoxProps> = (props) => {
	const {
		message,
		setMessage,
		isAdding,
		handleIssueSubmit,
		handleSupportSubmit,
	} = useChatbox();
	const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

	const handleSubmit = (e: React.FormEvent | KeyboardEvent) => {
		e.stopPropagation();
		e.preventDefault();

		if (!textAreaRef.current?.value!.trim()) {
			toast.error('You must write a message');
			return;
		}
		if (props.type === ChatBoxType.ISSUE) {
			handleIssueSubmit(
				props.selectedID,
				props.onDone,
				textAreaRef.current?.value!,
			);
		} else {
			handleSupportSubmit(
				props.selectedID,
				props.onDone,
				textAreaRef.current?.value!,
			);
		}
	};

	const handleEnter = (e: any) => {
		if (!Boolean(e.target.value.trim())) return;

		if (e.key === 'Enter') {
			handleSubmit(e);
		}
	};

	return (
		<div
			className={`sender ${props.selectedID == '' ? 'sender-disable' : ''}`}>
			<div className="header">
				<div className="title">
					<div className="icon">
						<MessageIcon />
					</div>
					<span>Add new entry</span>
				</div>
				<PrimaryButton
					text={<SendIcon />}
					isDisabled={
						!message.trim() || isAdding || props.selectedID == ''
					}
					disabledLoader
					hideContent={isAdding}
					click={handleSubmit}
					className="send-extra-styles log-inputs no-border-height"
					buttonStyle="send"
				/>
			</div>

			<div className="chatbox-container ">
				<div className="text-format chatbox-img  no-border-bottom">
					<img src="/codefend/user-icon-gray.svg" alt="user-picture" />
				</div>
				<div className="no-border-bottom chatbox-content">
					<textarea
						onKeyDown={handleEnter}
						disabled={props.selectedID == '' || isAdding}
						ref={textAreaRef}
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						placeholder="add a new comment here..."
						name="textArea"
						required></textarea>
				</div>
			</div>
		</div>
	);
};
