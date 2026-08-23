import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import './i18n/i18n';

// 1. Safe Service Worker cleanup: unregister any stale SWs and clear only SW CacheStorage
if (typeof window !== 'undefined') {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => {
        registration.unregister().catch(() => {});
      });
    }).catch(() => {});
  }

  // Clear any legacy Cache Storage created by service workers (DO NOT TOUCH localStorage / sessionStorage)
  if ('caches' in window) {
    caches.keys().then((keys) => {
      keys.forEach((key) => {
        caches.delete(key).catch(() => {});
      });
    }).catch(() => {});
  }

  // 2. Safe Stale Chunk Recovery (Handles dynamic import / chunk load failures after new Vercel deployments)
  // Protected by a sessionStorage guard to strictly prevent infinite reload loops
  window.addEventListener('error', (event) => {
    const message = event?.message || '';
    const isChunkError =
      message.includes('Loading chunk') ||
      message.includes('ChunkLoadError') ||
      message.includes('Failed to fetch dynamically imported module') ||
      message.includes('Importing a module script failed') ||
      message.includes('error loading dynamically imported module');

    if (isChunkError) {
      const reloadKey = 'hash_chunk_reload_guard';
      const hasReloaded = sessionStorage.getItem(reloadKey);
      if (!hasReloaded) {
        sessionStorage.setItem(reloadKey, 'true');
        window.location.reload();
      }
    }
  });

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event?.reason;
    const message = (typeof reason === 'string' ? reason : reason?.message) || '';
    const isChunkError =
      message.includes('Loading chunk') ||
      message.includes('ChunkLoadError') ||
      message.includes('Failed to fetch dynamically imported module') ||
      message.includes('Importing a module script failed') ||
      message.includes('error loading dynamically imported module');

    if (isChunkError) {
      const reloadKey = 'hash_chunk_reload_guard';
      const hasReloaded = sessionStorage.getItem(reloadKey);
      if (!hasReloaded) {
        sessionStorage.setItem(reloadKey, 'true');
        window.location.reload();
      }
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

