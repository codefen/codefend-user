import { useEffect, useRef, type FC } from 'react';
import Show from '@/app/views/components/Show/Show';
import { MessageCard } from '@/app/views/components/utils/MessageCard';

export interface MessageListProps {
  tickets: any[];
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
      <Show when={tickets[0] && tickets[0]?.id !== ''}>
        {tickets.map((ticket: any, i: number) => (
          <MessageCard
            key={`tk-${ticket.id}-${i}`}
            selectedID={ticket.user_id || ''}
            body={ticket?.cs_body || ticket?.issue_cs_body || ''}
            username={ticket.user_username || ''}
            createdAt={ticket.creacion || ''}
          />
        ))}
        <div className='ending' ref={messagesEndRef} />
      </Show>
    </div>
  );
};
