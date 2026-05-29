import React from 'react';
import { formatPrice, formatDate } from '../../utils/format';

const ORDER_STATUSES = [
  { value: 'new', label: 'Новый' },
  { value: 'processing', label: 'В обработке' },
  { value: 'shipped', label: 'Отправлен' },
  { value: 'delivered', label: 'Доставлен' },
  { value: 'cancelled', label: 'Отменен' },
];

const OrdersTab = ({ orders, onStatusChange, onView }) => (
  <div className="admin-section">
    <h2>Все заказы ({orders.length})</h2>
    <div className="admin-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Клиент</th>
            <th>Сумма</th>
            <th>Статус</th>
            <th>Дата</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.customer_name}</td>
              <td>{formatPrice(order.total_amount)}</td>
              <td>
                <select
                  value={order.status}
                  onChange={(e) => onStatusChange(order.id, e.target.value)}
                  className="status-select"
                >
                  {ORDER_STATUSES.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </td>
              <td>{formatDate(order.created_at)}</td>
              <td>
                <button
                  type="button"
                  className="view-btn"
                  onClick={() => onView(order.id)}
                >
                  Просмотр
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default OrdersTab;
