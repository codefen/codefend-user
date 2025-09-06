import ModalWrapper from '@modals/modalwrapper/ModalWrapper';
import scss from './updating.module.scss';
import { useEffect, useRef, useState } from 'react';
import { RUNNING_DESKTOP } from '@utils/helper';
import { relaunch } from '@tauri-apps/plugin-process';
import { useUploadingStore } from '@stores/updating.store';

export const UpdatingModal = () => {
  const { setHas, setAccept, setReject, ...updateState } = useUploadingStore();
  const [progress, setProgress] = useState(0);
  const [totalSize, setTotalSize] = useState(0);
  const [downloaded, setDownloaded] = useState(0);
  const [hasError, setHasError] = useState<string | null>(null);
  const isStartingRef = useRef(false);

  const startUpdate = async () => {
    console.log('startUpdate - 1');
    try {
      if (!updateState.update) {
        throw new Error('No update payload available');
      }

      let finished = false;

      await updateState.update.downloadAndInstall(event => {
        console.log('event', event);
        console.log('event?.event', event?.event);
        console.log('event?.data', (event as any)?.data);
        switch (event?.event) {
          case 'Started': {
            const size = event.data?.contentLength ?? 0;
            setTotalSize(size);
            setDownloaded(0);
            setProgress(0);
            setHasError(null);
            break;
          }
          case 'Progress': {
            const chunkLength = event.data?.chunkLength ?? 0;
            setDownloaded(prev => prev + chunkLength);
            break;
          }
          case 'Finished': {
            setProgress(100);
            finished = true;
            break;
          }
        }
      });

      return { finished };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown update error';
      setHasError(message);
      console.error('Updater error:', err);
      throw err;
    }
  };

  useEffect(() => {
    if (!RUNNING_DESKTOP()) return;
    if (!updateState.accept) return;
    if (isStartingRef.current) return;
    isStartingRef.current = true;

    // reset state when starting
    setProgress(0);
    setTotalSize(0);
    setDownloaded(0);
    setHasError(null);

    startUpdate()
      .then(({ finished }) => {
        if (!finished) {
          isStartingRef.current = false;
          return;
        }
        // Hide modals/state before relaunching
        setHas(false);
        setAccept(false);
        setReject(false);
        relaunch().catch(err => console.error('Failed to relaunch:', err));
      })
      .catch(() => {
        isStartingRef.current = false;
      });
  }, [updateState.update, updateState.accept]);

  useEffect(() => {
    const progressPercentage = totalSize > 0 ? Math.round((downloaded / totalSize) * 100) : 0;
    setProgress(progressPercentage);
  }, [downloaded, totalSize]);

  if (!updateState.accept || !RUNNING_DESKTOP()) return null;
  // if (false) return null;

  return (
    <ModalWrapper
      showCloseBtn={false}
      className={scss['updating-modal-overlay']}
      type={`${scss['updating-modal-container']} update-app-modal`}>
      <div className={scss['updating-top-modal']}>
        <img src="/codefend/logo-light.svg" alt="Codefend logo" width={200} height={80} />
      </div>
      <div className={scss['updating-mid-modal']}>
        <div className={scss['updating-mid-modal-left']}>
          <h2>
            THERE&apos;S AN UPDATE!{' '}
            <span className="codefend-text-red">V. {updateState.update?.version}</span>
          </h2>
          <p>
            We have made some updates in our systems! Please update from version{' '}
            {updateState.update?.currentVersion} to version
            {updateState.update?.version} to enjoy the latest features and bug fixes.
          </p>
        </div>
        <div className={scss['updating-modal-vl']}></div>
        <div>
          <p>
            {updateState.update?.body ||
              "Oops, looks like we forgot to include the release notes for this release. We promise we've been working hard to improve the app!"}
          </p>
        </div>
      </div>
      <div className={scss['updating-bot-modal']}>
        <div className={scss['updating-bot-text']}>
          <span>
            {hasError ? `UPDATE FAILED: ${hasError}` : `UPDATE IN PROGRESS ${progress}%...`}
          </span>
          <span className="codefend-text-red">V. {updateState?.update?.version}</span>
        </div>
        <div className={scss['updating-bot-progress-bar']}>
          <div className={scss['updating-bot-progress-stick']} style={{ width: `${progress}%` }} />
        </div>
      </div>
    </ModalWrapper>
  );
};
