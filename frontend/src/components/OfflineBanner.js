import React, { useEffect, useState } from 'react';
import './OfflineBanner.css';

const OfflineBanner = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const goOffline = () => setIsOffline(true);
    const goOnline = () => setIsOffline(false);

    window.addEventListener('offline', goOffline);
    window.addEventListener('online', goOnline);
    return () => {
      window.removeEventListener('offline', goOffline);
      window.removeEventListener('online', goOnline);
    };
  }, []);

  if (!isOffline) {
    return null;
  }

  return (
    <div className="offline-banner" role="status">
      Нет подключения к интернету. Доступны сохранённые страницы и ранее загруженные данные.
    </div>
  );
};

export default OfflineBanner;
