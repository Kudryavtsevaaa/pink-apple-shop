import React from 'react';
import { formatPrice, formatDateTime } from '../../utils/format';

const OrderViewModal = ({ order, onClose }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal-content order-modal" onClick={(e) => e.stopPropagation()}>
      <h2>Заказ #{order.id}</h2>

      <div className="order-info">
        <h3>Информация о клиенте</h3>
        <div className="info-row">
          <span>
            <strong>Имя:</strong> {order.customer_name}
          </span>
        </div>
        {order.customer_phone && (
          <div className="info-row">
            <span>
              <strong>Телефон:</strong> {order.customer_phone}
            </span>
          </div>
        )}
        {order.customer_email && (
          <div className="info-row">
            <span>
              <strong>Email:</strong> {order.customer_email}
            </span>
          </div>
        )}
        {order.delivery_address && (
          <div className="info-row">
            <span>
              <strong>Адрес доставки:</strong> {order.delivery_address}
            </span>
          </div>
        )}
        <div className="info-row">
          <span>
            <strong>Статус:</strong> {order.status}
          </span>
        </div>
        <div className="info-row">
          <span>
            <strong>Дата:</strong> {formatDateTime(order.created_at)}
          </span>
        </div>
      </div>

      <div className="order-items">
        <h3>Товары в заказе</h3>
        <table>
          <thead>
            <tr>
              <th>Товар</th>
              <th>Количество</th>
              <th>Цена</th>
              <th>Сумма</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, index) => (
              <tr key={item.id ?? index}>
                <td>
                  {item.product ? item.product.name : `Товар #${item.product_id} (удален)`}
                </td>
                <td>{item.quantity}</td>
                <td>{formatPrice(item.price)}</td>
                <td>{formatPrice(item.price * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3" style={{ textAlign: 'right', fontWeight: 'bold' }}>
                Итого:
              </td>
              <td style={{ fontWeight: 'bold', color: '#ff6b81' }}>
                {formatPrice(order.total_amount)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="modal-buttons">
        <button type="button" className="close-btn" onClick={onClose}>
          Закрыть
        </button>
      </div>
    </div>
  </div>
);

export default OrderViewModal;
