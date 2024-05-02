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
import type { IssueCustomerSupport, IssueUpdateData } from '@interfaces/issues';
import { toast } from 'react-toastify';

interface Props {
	isLoading: boolean;
	selectedIssue: IssueUpdateData;
	refetch: () => void;
}
export const IssueChatDisplay: FC<Props> = ({
	isLoading,
	selectedIssue,
	refetch,
}) => {
	const location = useLocation();
	const getIssueCs = selectedIssue?.cs ? selectedIssue?.cs : [];
	const onDone = () => {
		const viewMessage = localStorage.getItem('viewMessage')
			? JSON.parse(localStorage.getItem('viewMessage') as string)
			: { view: true };
		refetch();
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
							<div
								className={`messages-wrapper ${
									getIssueCs.length > 3 && 'item'
								}`}>
								{getIssueCs.map(
									(message: IssueCustomerSupport, i: number) => (
										<Fragment key={`mess-${message.id}-${i}`}>
											<MessageCard
												body={message.issue_cs_body}
												selectedID={message.user_id}
												createdAt={message.creacion}
												username={message.user_username}
											/>
										</Fragment>
									),
								)}
							</div>
						</Show>
					</div>
					<ChatBox
						type={ChatBoxType.ISSUE}
						selectedID={selectedIssue.id}
						onDone={onDone}
					/>
				</>
			</SimpleSection>
		</div>
	);
};
