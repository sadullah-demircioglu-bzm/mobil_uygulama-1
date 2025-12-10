import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import './theme/global.css';

const container = document.getElementById('root');
const root = createRoot(container!);
// Note: React.StrictMode in React 18 intentionally double-invokes
// effects in development to surface side-effects. This can cause
// API calls in useEffect(() => {}, []) to run twice in dev.
// We render App without StrictMode to avoid duplicate API calls during development.
root.render(
  <App />
);
