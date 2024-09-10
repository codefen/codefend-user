import { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { Loader } from './views/components';
import { AppRouter } from './Router';
import { ThemeProvider } from './views/ThemeContext';
import { ErrorBoundary } from './views/components/defaults/ErrorBoundry';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const App = () => {
	return (
		<ErrorBoundary>
			<ThemeProvider>
				<BrowserRouter>
					<ToastContainer
						position="top-right"
						autoClose={5000}
						hideProgressBar={false}
						newestOnTop={false}
						closeOnClick
						rtl={false}
						pauseOnFocusLoss
						draggable
						pauseOnHover
						theme="light"
					/>
					<Suspense fallback={<Loader />}>
						<AppRouter />
					</Suspense>
				</BrowserRouter>
			</ThemeProvider>
		</ErrorBoundary>
	);
};
