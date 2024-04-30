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
import type { IssueUpdateData } from '@interfaces/issues';

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

	const getIssue = useCallback((): IssueMessage[] => {
		return selectedIssue?.cs ?? [];
	}, [selectedIssue]);

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
									getIssue().length > 3 && 'item'
								}`}>
								{getIssue().map((message: IssueMessage, i: number) => (
									<Fragment key={`mess-${message.id}-${i}`}>
										<MessageCard
											body={message.body}
											selectedID={message.userID}
											createdAt={message.createdAt}
											username={message.userUsername}
										/>
									</Fragment>
								))}
							</div>
						</Show>
					</div>
					<ChatBox
						type={ChatBoxType.ISSUE}
						selectedID={selectedIssue?.id ?? ''}
						onDone={refetch}
					/>
				</>
			</SimpleSection>
		</div>
	);
};
