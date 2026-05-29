import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import Cart from '../components/Cart';
import OrderForm from '../components/OrderForm';
import './CartPage.css';

const CartPage = () => {
  const { cartItems } = useCart();
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [stockError, setStockError] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const checkStock = () => {
    for (const item of cartItems) {
      if (item.stock_quantity < item.quantity) {
        setStockError(
          `Недостаточно «${item.name}» на складе. Доступно: ${item.stock_quantity}, в корзине: ${item.quantity}`
        );
        return false;
      }
    }
    setStockError(null);
    return true;
  };

  const handleCheckout = () => {
    if (checkStock()) {
      setShowOrderForm(true);
      setOrderSuccess(false);
    }
  };

  const handleOrderSuccess = () => {
    setOrderSuccess(true);
    setStockError(null);
    setShowOrderForm(false);
  };

  useEffect(() => {
    setStockError(null);
  }, [cartItems]);

  if (cartItems.length === 0 && !showOrderForm) {
    return (
      <div className="cart-page">
        <h1>Корзина</h1>
        {orderSuccess && (
          <div className="order-success-message">Заказ оформлен. Мы свяжемся с вами.</div>
        )}
        <Cart />
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Корзина</h1>

      {orderSuccess && (
        <div className="order-success-message">Заказ оформлен. Мы свяжемся с вами.</div>
      )}

      {stockError && (
        <div className="stock-error-message">
          <span>{stockError}</span>
          <button type="button" onClick={() => setStockError(null)}>
            Закрыть
          </button>
        </div>
      )}

      {!showOrderForm ? (
        <>
          <Cart />
          <div className="checkout-section">
            <button type="button" className="checkout-btn" onClick={handleCheckout}>
              Оформить заказ
            </button>
          </div>
        </>
      ) : (
        <OrderForm
          onSuccess={handleOrderSuccess}
          onCancel={() => setShowOrderForm(false)}
        />
      )}
    </div>
  );
};

export default CartPage;
