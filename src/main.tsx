import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import './i18n/i18n';
import { ErrorBoundary } from './components/common/ErrorBoundary';

// 1. Safe Service Worker cleanup: unregister any stale SWs without blocking main thread
if (typeof window !== 'undefined') {
  setTimeout(() => {
    try {
      if (window.self === window.top && 'serviceWorker' in navigator) {
        const sw = navigator.serviceWorker;
        if (sw && typeof sw.getRegistrations === 'function') {
          sw.getRegistrations()
            .then((registrations) => {
              if (Array.isArray(registrations)) {
                registrations.forEach((registration) => {
                  registration?.unregister?.().catch(() => {});
                });
              }
            })
            .catch(() => {});
        }
      }
    } catch {
      // Restricted in sandboxed iframe
    }

    try {
      if (window.self === window.top && 'caches' in window) {
        const c = window.caches;
        if (c && typeof c.keys === 'function') {
          c.keys()
            .then((keys) => {
              if (Array.isArray(keys)) {
                keys.forEach((key) => {
                  c.delete(key).catch(() => {});
                });
              }
            })
            .catch(() => {});
        }
      }
    } catch {
      // Restricted in sandboxed iframe
    }
  }, 1000);
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

