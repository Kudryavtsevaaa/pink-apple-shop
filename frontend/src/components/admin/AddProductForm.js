import React from 'react';

const AddProductForm = ({ newProduct, categories, onChange, onSubmit }) => (
  <div className="admin-section">
    <h2>Добавить новый товар</h2>
    <form onSubmit={onSubmit} className="add-product-form">
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="new-product-name">Название товара *</label>
          <input
            id="new-product-name"
            type="text"
            name="name"
            value={newProduct.name}
            onChange={onChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="new-product-price">Цена (руб.) *</label>
          <input
            id="new-product-price"
            type="number"
            name="price"
            value={newProduct.price}
            onChange={onChange}
            required
            step="0.01"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="new-product-description">Описание</label>
        <textarea
          id="new-product-description"
          name="description"
          value={newProduct.description}
          onChange={onChange}
          rows="3"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="new-product-category">Категория</label>
          <select
            id="new-product-category"
            name="category_id"
            value={newProduct.category_id}
            onChange={onChange}
          >
            <option value="">Выберите категорию</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="new-product-stock">Остаток на складе</label>
          <input
            id="new-product-stock"
            type="number"
            name="stock_quantity"
            value={newProduct.stock_quantity}
            onChange={onChange}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="new-product-image">URL изображения</label>
        <input
          id="new-product-image"
          type="url"
          name="image_url"
          value={newProduct.image_url}
          onChange={onChange}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <button type="submit" className="submit-btn">
        Добавить товар
      </button>
    </form>
  </div>
);

export default AddProductForm;
