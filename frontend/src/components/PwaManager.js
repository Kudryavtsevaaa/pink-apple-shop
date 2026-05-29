import React, { useEffect, useState, useCallback } from 'react';
import { registerServiceWorker } from '../pwa/registerServiceWorker';
import { canUseInstallPrompt } from '../pwa/device';
import './PwaManager.css';

const PwaManager = () => {
  const [showReload, setShowReload] = useState(false);
  const [reloadApp, setReloadApp] = useState(null);
  const [offlineReady, setOfflineReady] = useState(false);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [installDismissed, setInstallDismissed] = useState(
    () => sessionStorage.getItem('pwa-install-dismissed') === '1'
  );

  const onNeedRefresh = useCallback((reload) => {
    setReloadApp(() => reload);
    setShowReload(true);
  }, []);

  useEffect(() => {
    registerServiceWorker({
      onOfflineReady: () => setOfflineReady(true),
      onNeedRefresh,
    });
  }, [onNeedRefresh]);

  useEffect(() => {
    if (!offlineReady) return undefined;
    const timer = setTimeout(() => setOfflineReady(false), 4000);
    return () => clearTimeout(timer);
  }, [offlineReady]);

  useEffect(() => {
    if (!canUseInstallPrompt()) {
      return undefined;
    }

    const handleBeforeInstall = (event) => {
      event.preventDefault();
      setInstallPrompt(event);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstallPrompt(null);
    }
  };

  const dismissInstall = () => {
    sessionStorage.setItem('pwa-install-dismissed', '1');
    setInstallDismissed(true);
    setInstallPrompt(null);
  };

  return (
    <>
      {offlineReady && (
        <div className="pwa-toast" role="status">
          Приложение готово к работе офлайн
        </div>
      )}

      {showReload && (
        <div className="pwa-banner pwa-banner--update" role="alert">
          <span>Доступна новая версия приложения</span>
          <div className="pwa-banner__actions">
            <button type="button" onClick={() => reloadApp?.()}>
              Обновить
            </button>
            <button type="button" className="pwa-banner__secondary" onClick={() => setShowReload(false)}>
              Позже
            </button>
          </div>
        </div>
      )}

      {installPrompt && !installDismissed && (
        <div className="pwa-banner pwa-banner--install" role="dialog" aria-label="Установка приложения">
          <span>Установите «Розовое яблоко» на главный экран для быстрого доступа</span>
          <div className="pwa-banner__actions">
            <button type="button" onClick={handleInstall}>
              Установить
            </button>
            <button type="button" className="pwa-banner__secondary" onClick={dismissInstall}>
              Не сейчас
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PwaManager;
