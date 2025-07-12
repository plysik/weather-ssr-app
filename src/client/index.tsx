

import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from '../common/App';
import store from '../store';
import '../styles/global.css';
/**
 * Entry point for the client-side application.
 * Hydrates the server-rendered markup and sets up client-side routing and state management.
 */
hydrateRoot(
  document.getElementById('root')!,
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);