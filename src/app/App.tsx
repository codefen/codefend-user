import { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { Loader } from './views/components';
import { AppRouter } from './Router';

export const App = () => {
	return (
			<BrowserRouter>
				<Suspense fallback={<Loader />}>
					<AppRouter />
				</Suspense>
			</BrowserRouter>
	);
};
