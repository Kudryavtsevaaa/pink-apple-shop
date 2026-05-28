import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import Cart from '../components/Cart';
import OrderForm from '../components/OrderForm';
import './CartPage.css';

const CartPage = () => {
  const { cartItems, getCartTotal } = useCart();
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [stockError, setStockError] = useState(null);

  // 🔍 ПРОВЕРКА ОСТАТКОВ ПЕРЕД ОФОРМЛЕНИЕМ
  const checkStock = () => {
    for (const item of cartItems) {
      if (item.stock_quantity < item.quantity) {
        setStockError(
          `❌ Недостаточно "${item.name}" на складе. ` +
          `Доступно: ${item.stock_quantity}, в корзине: ${item.quantity}`
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
    }
  };

  const handleOrderSuccess = () => {
    alert('✅ Заказ успешно оформлен! Мы свяжемся с вами.');
    setStockError(null);
    setShowOrderForm(false);
  };

  // Сброс ошибки при изменении корзины
  React.useEffect(() => {
    setStockError(null);
  }, [cartItems]);

  if (cartItems.length === 0 && !showOrderForm) {
    return (
      <div className="cart-page">
        <h1>Корзина</h1>
        <Cart />
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Корзина</h1>
      
      {/* ⚠️ ОШИБКА НЕДОСТАТОЧНОГО ОСТАТКА */}
      {stockError && (
        <div className="stock-error-message">
          <span>{stockError}</span>
          <button onClick={() => setStockError(null)}>✕</button>
        </div>
      )}
      
      {!showOrderForm ? (
        <>
          <Cart />
          <div className="checkout-section">
            <button className="checkout-btn" onClick={handleCheckout}>
              Оформить заказ
            </button>
          </div>
        </>
      ) : (
        <OrderForm 
          totalAmount={getCartTotal()} 
          onSuccess={handleOrderSuccess}
          onCancel={() => setShowOrderForm(false)}
        />
      )}
    </div>
  );
};

export default CartPage;