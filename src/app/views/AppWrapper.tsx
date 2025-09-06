import { ThemeProvider } from '@/app/views/context/ThemeContext';
import { useUserLocation } from '#commonHooks/useUserLocation';
import { UpdateAppModal } from '@modals/UpdateAppModal';
import { UpdatingModal } from '@modals/UpdatingModal';
import { useUploadingStore } from '@stores/updating.store';
import { check } from '@tauri-apps/plugin-updater';
import { RUNNING_DESKTOP } from '@utils/helper';
import { useEffect, type PropsWithChildren } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { BrowserRouter } from 'react-router';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '@/app/views/styles/toast.scss';

export const AppWrapper = ({ children }: PropsWithChildren) => {
  const { setHas, setUpdate, ...updateState } = useUploadingStore();
  useUserLocation();
  useEffect(() => {
    if (RUNNING_DESKTOP()) {
      if (!updateState.reject && !updateState.accept && !updateState.has) {
        check().then(update => {
          if (!!update && update.available) {
            // Ensure update object is set before opening the modal
            setUpdate(update);
            setHas(true);
          }
        });
      }
    }
    return () => {};
  }, []);

  // Enable DevTools toggle with F12 or Ctrl+Shift+I in desktop builds (including production)
  useEffect(() => {
    if (!RUNNING_DESKTOP()) return;
    const handler = (e: KeyboardEvent) => {
      const isF12 = e.key === 'F12';
      const isCtrlShiftI =
        (e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'i');
      if (isF12 || isCtrlShiftI) {
        invoke('open_devtools_for_main').catch(() => {
          console.error('Failed to open DevTools');
        });
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <ThemeProvider>
      <BrowserRouter>
        <UpdateAppModal />
        <UpdatingModal />
        <ToastContainer
          position="bottom-center"
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
