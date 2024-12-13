import ReactDOM from 'react-dom/client';
import { relaunch } from '@tauri-apps/plugin-process';
import { check } from '@tauri-apps/plugin-updater';
import { ask, message } from '@tauri-apps/plugin-dialog';

import './app/views/styles/index.scss';
import './app/views/styles/card.scss';
import './app/views/styles/forms.scss';

import { App } from './app/App';
import { RUNNING_DESKTOP } from './app/data';

const checkTauriUpdates = async () => {
  if (RUNNING_DESKTOP()) {
    try {
      const update = await check();
      if (update && update.available) {
        const yes = await ask(
          `Update to ${update.version} is available!\n\nRelease notes: ${update.body}`,
          {
            title: 'Update Available',
            kind: 'info',
            okLabel: 'Update',
            cancelLabel: 'Cancel',
          }
        );
        if (yes) {
          await update.downloadAndInstall();
          await relaunch();
        }
      }
    } catch {
      await message('Failed to check for updates.\nPlease try again later.', {
        title: 'Error',
        kind: 'error',
        okLabel: 'OK',
      });
    }
  }
};

(async () => {
  await checkTauriUpdates();
})();

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
