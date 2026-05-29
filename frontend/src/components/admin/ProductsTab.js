import React from 'react';
import { formatPrice } from '../../utils/format';

const ProductsTab = ({ products, onEdit, onDelete }) => (
  <div className="admin-section">
    <h2>Все товары ({products.length})</h2>
    <div className="admin-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Название</th>
            <th>Цена</th>
            <th>Остаток</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{formatPrice(product.price)}</td>
              <td>{product.stock_quantity}</td>
              <td>
                <button
                  type="button"
                  className="delete-btn"
                  onClick={() => onEdit(product)}
                  style={{ marginRight: '10px' }}
                >
                  Изменить
                </button>
                <button
                  type="button"
                  className="delete-btn"
                  onClick={() => onDelete(product.id)}
                >
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default ProductsTab;
