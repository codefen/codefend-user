import React, { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router';
import { useScript } from 'usehooks-ts';
import { PageLoader, Show } from '../../../../components';
import './issues.scss';

const IssuePage: React.FC<{}> = () => {
	const status = useScript('/editor-lib/visual/mce/tinymce.min.js', {
		removeOnUnmount: true,
	});
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
