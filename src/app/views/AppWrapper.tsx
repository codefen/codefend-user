import { ThemeProvider } from '@/app/views/context/ThemeContext';
import { useUserLocation } from '#commonHooks/useUserLocation';
import { UpdateAppModal } from '@modals/UpdateAppModal';
import { UpdatingModal } from '@modals/UpdatingModal';
import { useUploadingStore } from '@stores/updating.store';
import { check } from '@tauri-apps/plugin-updater';
import { RUNNING_DESKTOP } from '@utils/helper';
import { useEffect, type PropsWithChildren } from 'react';
import { BrowserRouter } from 'react-router';
import { ToastContainer } from 'react-toastify';

export const AppWrapper = ({ children }: PropsWithChildren) => {
  const { setHas, setUpdate, ...updateState } = useUploadingStore();
  useUserLocation();
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
        {children}
      </BrowserRouter>
    </ThemeProvider>
  );
};
