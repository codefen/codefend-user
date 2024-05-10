import { type FC } from 'react';
import IssueCreationPanel from '../components/IssueCreationPanel';
import { IssueChatDisplay } from '../components/IssueChatDisplay';
import { useShowScreen } from '#commonHooks/useShowScreen.ts';
import type { IssueUpdateData } from '@interfaces/issues';

const IssuesCreation: FC = () => {
	const [showScreen] = useShowScreen();

	return (
		<main className={`issue-detail ${showScreen ? 'actived' : ''}`}>
			<section className="left">
				<IssueCreationPanel isLoading={showScreen} />
			</section>
			<section className="right">
				<IssueChatDisplay id="0" />
			</section>
		</main>
	);
};

export default IssuesCreation;
