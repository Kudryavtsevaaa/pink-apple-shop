import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { getCartCount } = useCart();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Розовое яблоко
        </Link>
        
        <div className="navbar-menu">
          <Link to="/" className="navbar-link">Главное</Link>
          <Link to="/catalog" className="navbar-link">Каталог товаров</Link>
          <Link to="/cart" className="navbar-link">
            Корзина
            {getCartCount() > 0 && (
              <span className="cart-badge">{getCartCount()}</span>
            )}
          </Link>
          <Link to="/admin" className="navbar-link">Администратор</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;