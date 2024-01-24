import { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { store } from './data/redux/store';
import { Provider } from 'react-redux';
import { Loader } from './views/components';
import { AppRouter } from './Router';

export const App = () => {
	return (
		<Provider store={store}>
			<BrowserRouter>
				<Suspense fallback={<Loader />}>
					<AppRouter />
				</Suspense>
			</BrowserRouter>
		</Provider>
	);
};
