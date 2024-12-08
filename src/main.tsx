import ReactDOM from 'react-dom/client';
import { relaunch } from '@tauri-apps/plugin-process';
import { check } from '@tauri-apps/plugin-updater';

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
        if (window.confirm(`Nueva versión disponible: ${update?.version}. ¿Deseas actualizar?`)) {
          await update.downloadAndInstall();
          await relaunch();
        }
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
