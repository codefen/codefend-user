import React from 'react';
import ReactDOM from 'react-dom/client';
import { relaunch } from '@tauri-apps/api/process';
import { checkUpdate, installUpdate } from '@tauri-apps/api/updater';
import { listen } from '@tauri-apps/api/event';

import './app/views/styles/index.scss';
import './app/views/styles/card.scss';
import './app/views/styles/forms.scss';

import { App } from './app/App';
import { RUNNING_DESKTOP } from './app/data';

// Tauri
const _startInstall = () => {
  installUpdate().then(relaunch);
};

const checkTauriUpdates = async () => {
  if (RUNNING_DESKTOP()) {
    try {
      listen('tauri://update-available', res => console.log('New version available: ', res));

      const { shouldUpdate } = await checkUpdate();

      if (shouldUpdate) {
        await installUpdate();
        await relaunch();
      }
    } catch (e) {
      alert(e);
    }
  }
};

(async () => {
  await checkTauriUpdates();
})();

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
