import { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { Loader } from './views/components';
import { AppRouter } from './Router';
import { ThemeProvider } from './views/ThemeContext';
import { ErrorBoundary } from './views/components/defaults/ErrorBoundry';

export const App = () => {
	return (
		<ErrorBoundary>
			<ThemeProvider>
				<BrowserRouter>
					<Suspense fallback={<Loader />}>
						<AppRouter />
					</Suspense>
				</BrowserRouter>
			</ThemeProvider>
		</ErrorBoundary>
	);
};
