import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import './i18n/i18n';
import { ErrorBoundary } from './components/common/ErrorBoundary';

import { registerSW } from 'virtual:pwa-register';

// Register PWA service worker with auto-update
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  try {
    registerSW({
      immediate: true,
      onRegisteredSW(_swUrl, r) {
        if (r) {
          // Check for service worker updates periodically
          setInterval(() => {
            r.update().catch(() => {});
          }, 60 * 60 * 1000);
        }
      },
      onRegisterError(error) {
        console.warn('[PWA] Service worker registration error:', error);
      },
    });
  } catch (err) {
    console.warn('[PWA] Registration failed:', err);
  }
}

const rootElement = document.getElementById('root') || (() => {
  const el = document.createElement('div');
  el.id = 'root';
  document.body.appendChild(el);
  return el;
})();

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
);

