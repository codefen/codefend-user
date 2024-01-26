import React, { useRef } from 'react';
import { MessageIcon, SendButton, SendIcon } from '..';
import { useChatbox, ChatBoxType } from '../../../data';
import { toast } from 'react-toastify';

interface Props {
	type: ChatBoxType;
	onDone: () => void;
	selectedID: string;
}

export const ChatBox: React.FC<Props> = (props) => {
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
		<div className="sender">
			<div className="header">
				<div className="title">
					<div className="icon">
						<MessageIcon />
					</div>
					<span>Add new entry</span>
				</div>
				<SendButton
					text={<SendIcon isButton />}
					isDisabled={!message.trim() || isAdding}
					viewLoader={isAdding}
					click={handleSubmit}
					className="w-14 h-full relative"
				/>
			</div>

			<div className="flex h-36 py-8 gap-x-9 px-6">
				<div className="flex text-format  h-10 w-10  no-border-bottom">
					<img src="/codefend/user-icon-gray.svg" alt="user-picture" />
				</div>
				<div className="no-border-bottom flex-grow">
					<textarea
						onKeyDown={handleEnter}
						ref={textAreaRef}
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						placeholder="add a new comment here..."
						name="textArea"
						className="w-full h-full outline-none bg-transparent resize-none"
						required></textarea>
				</div>
			</div>
		</div>
	);
};
