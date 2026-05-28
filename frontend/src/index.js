import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
console.log('🔥 VERSION 2 - API URL:', process.env.REACT_APP_API_URL);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <CartProvider>
        <App />
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// Регистрируем service worker
serviceWorkerRegistration.register({
  onSuccess: () => {
    console.log('✅ PWA успешно зарегистрировано!');
  },
  onUpdate: () => {
    console.log('🔄 Доступна новая версия приложения');
    if (window.confirm('Доступна новая версия! Перезагрузить?')) {
      window.location.reload();
    }
  },
});