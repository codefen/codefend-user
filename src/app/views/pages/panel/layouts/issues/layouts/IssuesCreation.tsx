import React, { useEffect, useState } from 'react';
import IssueCreationPanel from '../components/IssueCreationPanel';
import { IssueChatDisplay } from '../components/IssueChatDisplay';

const IssuesCreation: React.FC<{}> = () => {
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
			<main className={`issue-detail w-full ${showScreen ? 'actived' : ''}`}>
				<section className="issue">
					<IssueCreationPanel isLoading={showScreen} issues={[]} />
				</section>
				<section className="h-full flex-grow">
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
