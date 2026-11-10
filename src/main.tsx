import ReactDOM from 'react-dom/client';

import './app/views/styles/index.scss';
import './app/views/styles/card.scss';
import './app/views/styles/forms.scss';
import './app/views/styles/flags/flags.scss';
import './app/views/styles/codefend-identity.css';
import './app/views/styles/panel-spacing.scss';

import { App } from './app/App';

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
