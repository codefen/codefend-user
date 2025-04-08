import { useUserLocation } from '@hooks/useUserLocation';
import { useUploadingStore } from '@stores/updating.store';
import { check } from '@tauri-apps/plugin-updater';
import { RUNNING_DESKTOP } from '@utils/helper';
import { useEffect, type PropsWithChildren } from 'react';

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

  return children;
};
