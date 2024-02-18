import { PageLoader, Show } from '../../../../components';
import React, { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router';
import './issues.scss';
import {  useIssueContext } from './IssuesContext';

const IssuePage: React.FC<{}> = () => {
	const { status } = useIssueContext();
	const path = useLocation().pathname;
	const isNeedWaitScript =
		path.startsWith('/issues/create') || path.startsWith('/issues/update');

	return (
		<>
			<Suspense fallback={<PageLoader />}>
				
					<Show when={isNeedWaitScript ? status === 'ready' : true}>
						<Outlet />
					</Show>
			</Suspense>
		</>
	);
};

export default IssuePage;
