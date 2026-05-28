import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { ordersService } from '../services/orders';
import './OrderForm.css';

const OrderForm = ({ totalAmount, onSuccess, onCancel }) => {
  const { cartItems, clearCart } = useCart();
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    delivery_address: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const orderData = {
        ...formData,
        items: cartItems.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price
        }))
      };

      await ordersService.create(orderData);
      clearCart();
      onSuccess();
    } catch (err) {
      setError('Ошибка при оформлении заказа. Попробуйте позже.');
      console.error('Order error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="order-form-container">
      <h2>Оформление заказа</h2>
      
      <div className="order-summary">
        <h3>Ваш заказ:</h3>
        <ul>
          {cartItems.map(item => (
            <li key={item.id}>
              {item.name} x {item.quantity} = {Number(item.price * item.quantity).toLocaleString('ru-RU')} руб.
            </li>
          ))}
        </ul>
        <div className="order-total">
          <strong>Итого: {totalAmount.toLocaleString('ru-RU')} руб.</strong>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="order-form">
        <div className="form-group">
          <label htmlFor="customer_name">Ваше имя *</label>
          <input
            type="text"
            id="customer_name"
            name="customer_name"
            value={formData.customer_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="customer_phone">Телефон</label>
          <input
            type="tel"
            id="customer_phone"
            name="customer_phone"
            value={formData.customer_phone}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="customer_email">Email</label>
          <input
            type="email"
            id="customer_email"
            name="customer_email"
            value={formData.customer_email}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="delivery_address">Адрес доставки</label>
          <textarea
            id="delivery_address"
            name="delivery_address"
            value={formData.delivery_address}
            onChange={handleChange}
            rows="3"
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="form-buttons">
          <button 
            type="button" 
            className="cancel-btn"
            onClick={onCancel}
          >
            Назад
          </button>
          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Отправка...' : 'Подтвердить заказ'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrderForm;