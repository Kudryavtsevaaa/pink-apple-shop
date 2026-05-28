import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>🍎 Розовое яблоко</h3>
          <p>Ваш магазин косметики</p>
        </div>
        
        <div className="footer-section">
          <h4>Контакты</h4>
          <p>📞 +7 (999) 000-00-00</p>
          <p>📧 info@pinkapple.ru</p>
        </div>
        
        <div className="footer-section">
          <h4>Адрес</h4>
          <p>г. Москва, ул. Красоты, д. 1</p>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>© 2026 Розовое яблоко. Все права защищены.</p>
      </div>
    </footer>
  );
};

export default Footer;