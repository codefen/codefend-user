import { type FC } from 'react';
import { useUserData } from '#commonUserHooks/useUserData';
import { MetricsService } from '@utils/metric.service.ts';
import { cleanHTML } from '@utils/helper';

interface Props {
  selectedID: string;
  body: string;
  username: string;
  createdAt?: string;
}

export const MessageCard: FC<Props> = props => {
  const { getUserdata } = useUserData();
  const isAuthUserChat = MetricsService.isUserChat(props.selectedID, getUserdata());
  const title = (
    <>
      {isAuthUserChat ? 'You' : 'The operator'}{' '}
      {props.username && (
        <span className={isAuthUserChat ? 'auth-user' : 'operator-user'}>@{props.username}</span>
      )}{' '}
      {props?.createdAt ? `wrote on ${props.createdAt}` : ''}
    </>
  );

  const message = props.body ?? '';

  return (
    <div className="message-card">
      <span className="message-card-title">{title}</span>
      <div className="message-card-container tt">
        <p dangerouslySetInnerHTML={{ __html: cleanHTML(message) }} />
      </div>
    </div>
  );
};
