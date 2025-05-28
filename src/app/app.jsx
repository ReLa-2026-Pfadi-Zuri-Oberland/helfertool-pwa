import '../styles/cssClasses.css';
import '../styles/reLaCSS.css';

import AppProvider from './provider.jsx';
import { HashRouter } from 'react-router-dom';
import Router from './router.jsx'; // changed to lowercase
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppProvider>
      <HashRouter>
        <Router />
      </HashRouter>
    </AppProvider>
  </StrictMode>
);
