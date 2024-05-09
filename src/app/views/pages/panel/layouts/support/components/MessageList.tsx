import { useEffect, useRef, type FC } from 'react';
import Show from '@defaults/Show';
import type { Ticket } from '@interfaces/index';
import { MessageCard } from '@standalones/utils/MessageCard';

export interface MessageListProps {
	tickets: Ticket[];
}

export const MessageList: FC<MessageListProps> = ({ tickets }) => {
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const scrollToBottom = () => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
		}
	};

	useEffect(() => {
		scrollToBottom();
	}, [tickets]);
	return (
		<div className={`messages-wrapper`}>
			<Show when={tickets[0].id !== ''}>
				{tickets.map((ticket: Ticket, i: number) => (
					<MessageCard
						key={`tk-${ticket.id}-${i}`}
						selectedID={ticket.user_id || ''}
						body={ticket.cs_body || ''}
						username={ticket.user_username || ''}
						createdAt={ticket.creacion || ''}
					/>
				))}
				<div ref={messagesEndRef} />
			</Show>
		</div>
	);
};
