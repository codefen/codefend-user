import Show from '@defaults/Show';
import type { UpdateAppState } from '@interfaces/user';
import ModalWrapper from '@modals/modalwrapper/ModalWrapper';
import { useSessionStorage } from 'usehooks-ts';
import scss from './updating.module.scss';
import { useEffect, useState } from 'react';
import { RUNNING_DESKTOP } from '@utils/helper';
import { relaunch } from '@tauri-apps/plugin-process';

export const UpdatingModal = () => {
  const [updateState, setUpdateState] = useSessionStorage<UpdateAppState>('updateState', {
    hasUpdate: false,
  });
  const [progress, setProgress] = useState(0);

  const startUpdate = async () => {
    await updateState.update?.downloadAndInstall(event => {
      switch (event.event) {
        case 'Started':
          break;
        case 'Progress':
          setProgress(prev => prev + event.data.chunkLength);
          break;
        case 'Finished':
          break;
      }
    });
  };

  useEffect(() => {
    if (RUNNING_DESKTOP() && updateState?.update && updateState.acceptUpdate) {
      startUpdate().then(() => {
        relaunch().then(() => {
          setUpdateState(prev => ({ ...prev, hasUpdate: false, acceptUpdate: false }));
        });
      });
    }
  }, [updateState]);

  return (
    <Show when={!!updateState.acceptUpdate}>
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
            <span>UPDATE IN PROGRESS...</span>
            <span className="codefend-text-red">V. {updateState?.update?.version}</span>
          </div>
          <div className={scss['updating-bot-progress-bar']}>
            <div
              className={scss['updating-bot-progress-stick']}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </ModalWrapper>
    </Show>
  );
};
