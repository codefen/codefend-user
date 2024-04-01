import { type FC, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useOneIssue } from '@panelHooks/issues/useOneIssue.ts';
import { IssueChatDisplay } from '../components/IssueChatDisplay.tsx';
import IssueUpdatePanel from '../components/IssueUpdatePanel.tsx';
import { PageLoader } from '@defaults/loaders/Loader.tsx';
import Show from '@defaults/Show.tsx';
import { useShowScreen } from '#commonHooks/useShowScreen.ts';

const IssueUpdate: FC = () => {
	const { getIssues, isLoading, refetchOne } = useOneIssue();
	const [showScreen, control, refresh] = useShowScreen();
	const { id } = useParams();

	useEffect(() => {
		refetchOne(id as string);
	}, [control]);

	return (
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
							refetch={refresh}
						/>
					</section>
				</>
			</Show>
		</main>
	);
};

export default IssueUpdate;
