import { MetricsService, useAuthState } from '../../../../data';
import { type FC } from 'react';

interface Props {
	selectedID: string;
	body: string;
	username: string;
	createdAt: string;
}

export const MessageCard: FC<Props> = (props) => {
	const { getUserdata } = useAuthState();
	const isAuthUserChat = MetricsService.isUserChat(
		props.selectedID,
		getUserdata(),
	);
	const title = `${isAuthUserChat ? 'You' : 'The operator'} ${
		props.username ? `@${props.username}` : ''
	} wrote on ${props.createdAt}`;

	const message = props.body ?? '';

	return (
		<div className="message-card">
			<span className="message-card-title">{title}</span>
			<div className="message-card-container tt">
				<div className="message-card-content">
					<img
						src={`/codefend/user-icon${
							!isAuthUserChat ? '-gray' : ''
						}.svg`}
						alt="user-picture"
					/>
				</div>
				<p>{message}</p>
			</div>
		</div>
	);
};
