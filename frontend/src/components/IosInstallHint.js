import React, { useState } from 'react';
import { isIos, isStandalone } from '../pwa/device';
import './IosInstallHint.css';

const DISMISS_KEY = 'ios-install-hint-dismissed';

const IosInstallHint = () => {
  const [dismissed, setDismissed] = useState(
    () => sessionStorage.getItem(DISMISS_KEY) === '1'
  );

  if (!isIos() || isStandalone() || dismissed) {
    return null;
  }

  const dismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, '1');
    setDismissed(true);
  };

  return (
    <div className="ios-install-hint" role="note">
      <p className="ios-install-hint__title">Установка на iPhone</p>
      <ol>
        <li>Откройте сайт в Safari</li>
        <li>Нажмите «Поделиться»</li>
        <li>Выберите «На экран Домой»</li>
      </ol>
      <button type="button" className="ios-install-hint__close" onClick={dismiss}>
        Понятно
      </button>
    </div>
  );
};

export default IosInstallHint;
