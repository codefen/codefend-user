import { Suspense, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { Loader } from './views/components';
import { ThemeProvider } from './views/context/ThemeContext';
import { ErrorBoundary } from './views/components/defaults/ErrorBoundry';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AppRouter } from './router/Routes';
import { RUNNING_DESKTOP } from './data';
import { check } from '@tauri-apps/plugin-updater';
import { UpdateAppModal } from '@modals/UpdateAppModal';
import { UpdatingModal } from '@modals/UpdatingModal';
import { useUploadingStore } from '@stores/updating.store';

export const App = () => {
  const { setHas, setUpdate, ...updateState } = useUploadingStore();

  useEffect(() => {
    if (RUNNING_DESKTOP()) {
      if (!updateState.reject && !updateState.accept && !updateState.has) {
        check().then(update => {
          if (!!update && update.available) {
            setHas(true);
            setUpdate(update);
          }
        });
      }
    }
    return () => {};
  }, []);

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
