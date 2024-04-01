import { type FC, useEffect, useState } from 'react';
import IssueCreationPanel from '../components/IssueCreationPanel';
import { IssueChatDisplay } from '../components/IssueChatDisplay';
import { useShowScreen } from '#commonHooks/useShowScreen.ts';

const IssuesCreation: FC = () => {
	const [showScreen, control, refresh] = useShowScreen();

	return (
		<main className={`issue-detail ${showScreen ? 'actived' : ''}`}>
			<section className="left">
				<IssueCreationPanel isLoading={showScreen} issues={[]} />
			</section>
			<section className="right">
				<IssueChatDisplay
					isLoading={false}
					selectedIssue={null}
					refetch={() => {}}
				/>
			</section>
		</main>
	);
};

export default IssuesCreation;
