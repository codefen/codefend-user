import { type FC, Fragment, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router';
import { ChatBoxType, type IssueMessage } from '../../../../../../data';
import {
	MessageIcon,
	PageLoader,
	MessageCard,
	ChatBox,
	Show,
	SimpleSection,
} from '../../../../../components';
import { toast } from 'react-toastify';
import { useUserData } from '#commonUserHooks/useUserData';
import { useSWRIssueMessage } from '@panelHooks/issues/useSWRIssueMessage';
import { MessageList } from '@standalones/MessageList';

interface IssueChatDisplayProps {
	id: string;
}
export const IssueChatDisplay: FC<IssueChatDisplayProps> = ({ id }) => {
	const location = useLocation();
	const { getCompany } = useUserData();
	const { data, isLoading, mutate } = useSWRIssueMessage(id, getCompany());

	const onDone = (newMessage?: any) => {
		const viewMessage = localStorage.getItem('viewMessage')
			? JSON.parse(localStorage.getItem('viewMessage') as string)
			: { view: true };

		if (newMessage) {
			mutate([...data, newMessage]);
		}
		if (viewMessage.view) {
			toast.success(
				'We aim to respond to your queries within 24 to 48 hours.',
			);
			localStorage.setItem('viewMessage', JSON.stringify({ view: false }));
		}
	};
	return (
		<div
			className={`card messages ${
				location.pathname.startsWith('/issues/create') &&
				'active animate-pulse"'
			}`}>
			<SimpleSection header="Customer support" icon={<MessageIcon />}>
				<>
					<div className="content">
						<Show when={!isLoading} fallback={<PageLoader />}>
							<MessageList tickets={data} />
						</Show>
					</div>
					<ChatBox
						type={ChatBoxType.ISSUE}
						selectedID={id}
						onDone={onDone}
					/>
				</>
			</SimpleSection>
		</div>
	);
};
