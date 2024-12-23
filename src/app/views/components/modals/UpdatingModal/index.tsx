import ModalWrapper from '@modals/modalwrapper/ModalWrapper';
import scss from './updating.module.scss';
import { useEffect, useState } from 'react';
import { RUNNING_DESKTOP } from '@utils/helper';
import { relaunch } from '@tauri-apps/plugin-process';
import { useUploadingStore } from '@stores/updating.store';

export const UpdatingModal = () => {
  const { setHas, setAccept, setReject, ...updateState } = useUploadingStore();
  const [progress, setProgress] = useState(0);
  const [totalSize, setTotalSize] = useState(0);
  const [downloaded, setDownloaded] = useState(0);

  const startUpdate = async () => {
    return updateState.update?.downloadAndInstall(event => {
      switch (event.event) {
        case 'Started':
          const size = event.data?.contentLength ?? 0;
          setTotalSize(size);
          break;
        case 'Progress':
          const chunkLength = event.data?.chunkLength ?? 0;
          setDownloaded(prev => prev + chunkLength);
          break;
        case 'Finished':
          setProgress(100);
          setHas(true);
          setAccept(false);
          setReject(false);
          break;
      }
    });
  };

  useEffect(() => {
    if (RUNNING_DESKTOP() && updateState.accept && progress === 0) {
      startUpdate().then(() => {
        relaunch().then(() => {
          console.log('relaunch...');
        });
      });
    }
  }, [updateState.update, updateState.accept]);

  useEffect(() => {
    const progressPercentage = totalSize > 0 ? Math.round((downloaded / totalSize) * 100) : 0;
    setProgress(progressPercentage);
  }, [downloaded, totalSize]);

  if (!updateState.accept || !RUNNING_DESKTOP()) return null;

  return (
    <ModalWrapper
      showCloseBtn={false}
      className={scss['updating-modal-overlay']}
      type={scss['updating-modal-container']}>
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
          <span>UPDATE IN PROGRESS {progress}%...</span>
          <span className="codefend-text-red">V. {updateState?.update?.version}</span>
        </div>
        <div className={scss['updating-bot-progress-bar']}>
          <div className={scss['updating-bot-progress-stick']} style={{ width: `${progress}%` }} />
        </div>
      </div>
    </ModalWrapper>
  );
};
