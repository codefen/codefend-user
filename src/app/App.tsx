import { Suspense, useLayoutEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { Loader } from './views/components';
import { ThemeProvider } from './views/context/ThemeContext';
import { ErrorBoundary } from './views/components/defaults/ErrorBoundry';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AppRouter } from './router/Routes';
import { useSessionStorage } from 'usehooks-ts';
import { RUNNING_DESKTOP, type UpdateAppState } from './data';
import { check } from '@tauri-apps/plugin-updater';
import { UpdateAppModal } from '@modals/UpdateAppModal';
import { UpdatingModal } from '@modals/UpdatingModal';

export const App = () => {
  const [updateState, setHasUpdate] = useSessionStorage<UpdateAppState>('updateState', {
    hasUpdate: false,
  });

  useLayoutEffect(() => {
    if (RUNNING_DESKTOP() && !updateState.rejectUpdate) {
      check().then(update => {
        if (!!update && update.available) {
          setHasUpdate(prev => ({ ...prev, hasUpdate: true, update }));
        }
      });
    }
  }, [updateState]);

  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
};
