import { type FC, useEffect, useState } from 'react';
import IssueCreationPanel from '../components/IssueCreationPanel';
import { IssueChatDisplay } from '../components/IssueChatDisplay';

const IssuesCreation: FC = () => {
	const [showScreen, setShowScreen] = useState(false);
	const [reShow, setReshow] = useState(false);

	useEffect(() => {
		setShowScreen(false);
		const timeoutId = setTimeout(() => {
			setShowScreen(true);
		}, 50);

		return () => clearTimeout(timeoutId);
	}, [reShow]);

	return (
		<>
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
		</>
	);
};

export default IssuesCreation;
