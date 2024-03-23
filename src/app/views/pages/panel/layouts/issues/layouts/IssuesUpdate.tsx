import { type FC, useEffect, useState } from 'react';
import { useOneIssue } from '../../../../../../data';
import { IssueChatDisplay } from '../components/IssueChatDisplay';
import { useParams } from 'react-router';
import IssueUpdatePanel from '../components/IssueUpdatePanel';
import { PageLoader, Show } from '../../../../../components';

const IssueUpdate: FC = () => {
	const { getIssues, isLoading, refetchOne } = useOneIssue();
	const [showScreen, setShowScreen] = useState(false);
	const [control, refresh] = useState(false);
	const { id } = useParams();

	useEffect(() => {
		refetchOne(id as string);
		setShowScreen(false);
		const timeoutId = setTimeout(() => {
			setShowScreen(true);
		}, 75);

		return () => clearTimeout(timeoutId);
	}, [control]);

	return (
		<>
			<main className={`issue-detail ${showScreen ? 'actived' : ''}`}>
				<Show when={showScreen} fallback={<PageLoader />}>
					<>
						<section className="left">
							<IssueUpdatePanel
								completeIssue={getIssues()}
								isLoading={isLoading}
							/>
						</section>
						<section className="right">
							<IssueChatDisplay
								isLoading={isLoading}
								selectedIssue={getIssues().issue}
								refetch={() => refresh(!control)}
							/>
						</section>
					</>
				</Show>
			</main>
		</>
	);
};

export default IssueUpdate;
