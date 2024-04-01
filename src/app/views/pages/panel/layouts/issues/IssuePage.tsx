import { type FC, Suspense } from 'react';
import { Outlet, useLocation } from 'react-router';
import { useScript } from 'usehooks-ts';
import { PageLoader } from '@defaults/loaders/Loader.tsx';
import Show from '@defaults/Show.tsx';
import './issues.scss';

const IssuePage: FC = () => {
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
