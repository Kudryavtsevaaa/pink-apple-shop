import { Workbox } from 'workbox-window';

export function registerServiceWorker({ onOfflineReady, onNeedRefresh }) {
  if (process.env.NODE_ENV !== 'production') {
    return null;
  }

  if (!('serviceWorker' in navigator)) {
    return null;
  }

  const wb = new Workbox(`${process.env.PUBLIC_URL}/service-worker.js`);

  wb.addEventListener('installed', (event) => {
    if (!event.isUpdate) {
      onOfflineReady?.();
    }
  });

  wb.addEventListener('waiting', () => {
    onNeedRefresh?.(() => {
      wb.messageSkipWaiting();
    });
  });

  wb.addEventListener('controlling', () => {
    window.location.reload();
  });

  wb.register();
  return wb;
}
