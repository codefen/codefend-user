import { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { ThemeProvider } from './views/context/ThemeContext';
import { ErrorBoundary } from './views/components/ErrorBoundry/ErrorBoundry';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AppRouter } from './router/Routes';
import { UpdateAppModal } from '@modals/UpdateAppModal';
import { UpdatingModal } from '@modals/UpdatingModal';
import { Loader } from '@/app/views/components/loaders/Loader';
import { GlobalStoreProvider } from '@/app/views/context/AppContextProvider';
import { AppWrapper } from '@/app/views/AppWrapper';

export const App = () => {
  return (
    <GlobalStoreProvider>
      <ErrorBoundary>
        <AppWrapper>
          <ThemeProvider>
            <BrowserRouter>
              <UpdateAppModal />
              <UpdatingModal />
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
        </AppWrapper>
      </ErrorBoundary>
    </GlobalStoreProvider>
  );
};
