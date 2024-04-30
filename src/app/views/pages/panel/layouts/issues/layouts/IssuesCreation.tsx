import { type FC, useEffect, useState } from 'react';
import IssueCreationPanel from '../components/IssueCreationPanel';
import { IssueChatDisplay } from '../components/IssueChatDisplay';
import { useShowScreen } from '#commonHooks/useShowScreen.ts';
import type { IssueCustomerSupport, IssueUpdateData } from '@interfaces/issues';

const IssuesCreation: FC = () => {
	const [showScreen, control, refresh] = useShowScreen();

	return (
		<main className={`issue-detail ${showScreen ? 'actived' : ''}`}>
			<section className="left">
				<IssueCreationPanel isLoading={showScreen} />
			</section>
			<section className="right">
				<IssueChatDisplay
					isLoading={false}
					selectedIssue={{} as IssueUpdateData}
					refetch={() => {}}
				/>
			</section>
		</main>
	);
};

export default IssuesCreation;
