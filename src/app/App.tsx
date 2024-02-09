import { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { Loader } from './views/components';
import { AppRouter } from './Router';
import { ThemeProvider } from './views/ThemeContext';

export const App = () => {
	return (
		<ThemeProvider>
			<BrowserRouter>
				<Suspense fallback={<Loader />}>
					<AppRouter />
				</Suspense>
			</BrowserRouter>
		</ThemeProvider>
	);
};
