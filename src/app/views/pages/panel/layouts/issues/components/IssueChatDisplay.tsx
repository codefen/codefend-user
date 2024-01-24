import React, { Fragment, useCallback, useMemo } from 'react';
import {
	ChatBoxType,
	CompleteIssue,
	IssueMessage,
	generateIDArray,
} from '../../../../../../data';
import {
	MessageIcon,
	PageLoader,
	MessageCard,
	ChatBox,
	Show,
	SimpleSection,
} from '../../../../../components';
import { useLocation } from 'react-router';

interface Props {
	isLoading: boolean;
	selectedIssue: CompleteIssue | null;
	refetch: () => void;
}
export const IssueChatDisplay: React.FC<Props> = ({
	isLoading,
	selectedIssue,
	refetch,
}) => {
	const getIssue = useCallback((): IssueMessage[] => {
		return selectedIssue?.cs ?? [];
	}, [selectedIssue]);
	const location = useLocation();
	const messageKeys = useMemo(
		(): string[] =>
			Boolean(getIssue().length)
				? generateIDArray(getIssue().length)
				: ([] as string[]),
		[getIssue],
	);

	return (
		<div
			className={`card messages ${
				location.pathname.startsWith('/issues/create') &&
				'opacity-70 z-10 pointer-events-none animate-pulse"'
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
									<Fragment key={messageKeys[i]}>
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
