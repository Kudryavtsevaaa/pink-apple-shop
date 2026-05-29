import React from 'react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/format';
import './Cart.css';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Корзина пуста</h2>
        <p>Добавьте товары из каталога</p>
      </div>
    );
  }

  return (
    <div className="cart">
      <h2>Ваша корзина</h2>
      
      <div className="cart-items">
        {cartItems.map(item => (
          <div key={item.id} className="cart-item">
            <div className="cart-item-image">
              <img 
                src={item.image_url || '/images/placeholder.jpg'} 
                alt={item.name}
              />
            </div>
            
            <div className="cart-item-info">
              <h3>{item.name}</h3>
              <p>{formatPrice(item.price)}</p>
            </div>
            
            <div className="cart-item-quantity">
              <button 
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button 
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
              >
                +
              </button>
            </div>
            
            <div className="cart-item-total">
              {formatPrice(item.price * item.quantity)}
            </div>
            
            <button 
              className="remove-btn"
              onClick={() => removeFromCart(item.id)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
      
      <div className="cart-summary">
        <div className="cart-total">
          <span>Итого:</span>
          <span>{formatPrice(getCartTotal())}</span>
        </div>
      </div>
    </div>
  );
};

export default Cart;