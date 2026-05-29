import React from 'react';

const ProductEditModal = ({ product, onChange, onClose, onSubmit }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <h2>Редактировать товар</h2>
      <form onSubmit={onSubmit} className="edit-form">
        <div className="form-group">
          <label htmlFor="edit-product-name">Название</label>
          <input
            id="edit-product-name"
            type="text"
            value={product.name}
            onChange={(e) => onChange({ ...product, name: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="edit-product-price">Цена (руб.)</label>
          <input
            id="edit-product-price"
            type="number"
            step="0.01"
            value={product.price}
            onChange={(e) => onChange({ ...product, price: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="edit-product-stock">Остаток на складе</label>
          <input
            id="edit-product-stock"
            type="number"
            value={product.stock_quantity}
            onChange={(e) => onChange({ ...product, stock_quantity: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="edit-product-description">Описание</label>
          <textarea
            id="edit-product-description"
            value={product.description || ''}
            onChange={(e) => onChange({ ...product, description: e.target.value })}
            rows="3"
          />
        </div>

        <div className="form-group">
          <label htmlFor="edit-product-image">URL изображения</label>
          <input
            id="edit-product-image"
            type="url"
            value={product.image_url || ''}
            onChange={(e) => onChange({ ...product, image_url: e.target.value })}
          />
        </div>

        <div className="modal-buttons">
          <button type="button" className="cancel-btn" onClick={onClose}>
            Отмена
          </button>
          <button type="submit" className="save-btn">
            Сохранить
          </button>
        </div>
      </form>
    </div>
  </div>
);

export default ProductEditModal;
