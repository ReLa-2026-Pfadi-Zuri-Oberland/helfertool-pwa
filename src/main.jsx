import './index.css';

import App from './App.jsx';
import { BrowserRouter as Router } from 'react-router-dom';
import { StrictMode } from 'react';
import { UserProvider } from './context/UserContext.jsx';
import { createRoot } from 'react-dom/client';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <Router>
        <App />
      </Router>
    </UserProvider>
  </StrictMode>
);
