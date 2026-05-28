import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productsService } from '../services/products';
import { ordersService } from '../services/orders';
import './Admin.css';

const API_BASE_URL = 'https://slick-bobcats-drop.loca.lt/api';

const Admin = () => {
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Для редактирования товара
  const [editingProduct, setEditingProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Для просмотра заказа
  const [viewingOrder, setViewingOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  
  // Form state for new product
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    image_url: '',
    category_id: '',
    stock_quantity: ''
  });

  // 🔐 ПРОВЕРКА АВТОРИЗАЦИИ ПРИ ЗАГРУЗКЕ
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('admin_logged_in');
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [navigate]);

  // Загрузка данных
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [prods, cats, ords] = await Promise.all([
        productsService.getAll(),
        productsService.getCategories(),
        ordersService.getAll()
      ]);
      setProducts(prods);
      setCategories(cats);
      setOrders(ords);
    } catch (error) {
      console.error('Error fetching admin ', error);
      setError('Не удалось загрузить данные. Убедитесь, что backend запущен.');
    } finally {
      setLoading(false);
    }
  };

  const handleProductChange = (e) => {
    setNewProduct({
      ...newProduct,
      [e.target.name]: e.target.value
    });
  };

  // 🔐 ФУНКЦИЯ ВЫХОДА
  const handleLogout = () => {
    localStorage.removeItem('admin_logged_in');
    localStorage.removeItem('admin_username');
    navigate('/login');
  };

  // ✏️ НАЧАТЬ РЕДАКТИРОВАНИЕ ТОВАРА
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowEditModal(true);
  };

  // ✏️ СОХРАНИТЬ ИЗМЕНЕНИЯ ТОВАРА
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        name: editingProduct.name,
        description: editingProduct.description || '',
        price: parseFloat(editingProduct.price),
        image_url: editingProduct.image_url || '',
        category_id: editingProduct.category_id ? parseInt(editingProduct.category_id) : null,
        stock_quantity: parseInt(editingProduct.stock_quantity) || 0
      };
      
      const response = await fetch(`${API_BASE_URL}/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      
      if (!response.ok) {
        throw new Error('Ошибка при обновлении товара');
      }
      
      alert('✅ Товар обновлен!');
      setShowEditModal(false);
      setEditingProduct(null);
      fetchData();
    } catch (error) {
      console.error('Error updating product:', error);
      alert('❌ Ошибка: ' + error.message);
    }
  };

  // 🗑️ УДАЛИТЬ ТОВАР
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот товар?')) {
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Ошибка при удалении товара');
      }
      
      alert('✅ Товар успешно удален!');
      fetchData();
    } catch (error) {
      console.error('❌ Error deleting product:', error);
      alert(`❌ Ошибка: ${error.message}`);
    }
  };

  // 📦 ПРОСМОТР ЗАКАЗА
  const handleViewOrder = async (orderId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`);
      if (!response.ok) throw new Error('Failed to fetch order');
      
      const order = await response.json();
      setViewingOrder(order);
      setShowOrderModal(true);
    } catch (error) {
      console.error('Error fetching order:', error);
      alert('❌ Не удалось загрузить заказ');
    }
  };

  // 🔄 ОБНОВИТЬ СТАТУС ЗАКАЗА
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status?status=${encodeURIComponent(newStatus)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) throw new Error('Failed to update');
      
      alert(`✅ Статус заказа #${orderId} изменен на "${newStatus}"!`);
      fetchData();
    } catch (error) {
      console.error('❌ Error updating order:', error);
      alert(`❌ Ошибка: ${error.message}`);
    }
  };

  // ➕ ДОБАВИТЬ НОВЫЙ ТОВАР
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        name: newProduct.name,
        description: newProduct.description || '',
        price: parseFloat(newProduct.price),
        image_url: newProduct.image_url || '',
        category_id: newProduct.category_id ? parseInt(newProduct.category_id) : null,
        stock_quantity: parseInt(newProduct.stock_quantity) || 0
      };
      
      const response = await fetch(`${API_BASE_URL}/products/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      
      if (!response.ok) throw new Error('Failed to add product');
      
      alert('✅ Товар успешно добавлен!');
      
      setNewProduct({
        name: '',
        description: '',
        price: '',
        image_url: '',
        category_id: '',
        stock_quantity: ''
      });
      
      fetchData();
    } catch (error) {
      console.error('❌ Error adding product:', error);
      alert(`❌ Ошибка: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Загрузка данных...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-error">
        <h2>⚠️ Ошибка</h2>
        <p>{error}</p>
        <button onClick={fetchData}>Попробовать снова</button>
      </div>
    );
  }

  return (
    <div className="admin">
      <h1>Панель администратора</h1>
      
      {/* 🔐 КНОПКА ВЫХОДА */}
      <div style={{ textAlign: 'right', marginBottom: '20px' }}>
        <span style={{ marginRight: '15px', color: '#666' }}>
          👤 {localStorage.getItem('admin_username') || 'Админ'}
        </span>
        <button 
          onClick={handleLogout}
          style={{
            padding: '8px 20px',
            background: '#ff4757',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          Выйти
        </button>
      </div>
      
      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          Товары
        </button>
        <button 
          className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Заказы
        </button>
        <button 
          className={`tab-btn ${activeTab === 'add' ? 'active' : ''}`}
          onClick={() => setActiveTab('add')}
        >
          Добавить товар
        </button>
      </div>

      {/* Products Tab */}
      {activeTab === 'products' && (
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
                {products.map(product => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>{Number(product.price).toLocaleString('ru-RU')} руб.</td>
                    <td>{product.stock_quantity}</td>
                    <td>
                      <button 
                        className="delete-btn"
                        onClick={() => handleEditProduct(product)}
                        style={{ marginRight: '10px' }}
                      >
                        Изменить
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDeleteProduct(product.id)}
                        style={{ marginRight: '10px' }}
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
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
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
                {orders.map(order => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.customer_name}</td>
                    <td>{Number(order.total_amount).toLocaleString('ru-RU')} руб.</td>
                    <td>
                      <select 
                        value={order.status}
                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                        className="status-select"
                      >
                        <option value="new">Новый</option>
                        <option value="processing">В обработке</option>
                        <option value="shipped">Отправлен</option>
                        <option value="delivered">Доставлен</option>
                        <option value="cancelled">Отменен</option>
                      </select>
                    </td>
                    <td>{new Date(order.created_at).toLocaleDateString('ru-RU')}</td>
                    <td>
                      <button 
                        className="view-btn"
                        onClick={() => handleViewOrder(order.id)}
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
      )}

      {/* Add Product Tab */}
      {activeTab === 'add' && (
        <div className="admin-section">
          <h2>Добавить новый товар</h2>
          <form onSubmit={handleAddProduct} className="add-product-form">
            <div className="form-row">
              <div className="form-group">
                <label>Название товара *</label>
                <input
                  type="text"
                  name="name"
                  value={newProduct.name}
                  onChange={handleProductChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Цена (руб.) *</label>
                <input
                  type="number"
                  name="price"
                  value={newProduct.price}
                  onChange={handleProductChange}
                  required
                  step="0.01"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Описание</label>
              <textarea
                name="description"
                value={newProduct.description}
                onChange={handleProductChange}
                rows="3"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Категория</label>
                <select
                  name="category_id"
                  value={newProduct.category_id}
                  onChange={handleProductChange}
                >
                  <option value="">Выберите категорию</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Остаток на складе</label>
                <input
                  type="number"
                  name="stock_quantity"
                  value={newProduct.stock_quantity}
                  onChange={handleProductChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>URL изображения</label>
              <input
                type="url"
                name="image_url"
                value={newProduct.image_url}
                onChange={handleProductChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <button type="submit" className="submit-btn">
              Добавить товар
            </button>
          </form>
        </div>
      )}

      {/* ✏️ МОДАЛЬНОЕ ОКНО РЕДАКТИРОВАНИЯ ТОВАРА */}
      {showEditModal && editingProduct && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>✏️ Редактировать товар</h2>
            <form onSubmit={handleSaveProduct} className="edit-form">
              <div className="form-group">
                <label>Название</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Цена (руб.)</label>
                <input
                  type="number"
                  step="0.01"
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Остаток на складе</label>
                <input
                  type="number"
                  value={editingProduct.stock_quantity}
                  onChange={(e) => setEditingProduct({...editingProduct, stock_quantity: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Описание</label>
                <textarea
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                  rows="3"
                />
              </div>
              
              <div className="form-group">
                <label>URL изображения</label>
                <input
                  type="url"
                  value={editingProduct.image_url || ''}
                  onChange={(e) => setEditingProduct({...editingProduct, image_url: e.target.value})}
                />
              </div>

              <div className="modal-buttons">
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setShowEditModal(false)}
                >
                  Отмена
                </button>
                <button type="submit" className="save-btn">
                  Сохранить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 📦 МОДАЛЬНОЕ ОКНО ПРОСМОТРА ЗАКАЗА */}
      {showOrderModal && viewingOrder && (
        <div className="modal-overlay" onClick={() => setShowOrderModal(false)}>
          <div className="modal-content order-modal" onClick={(e) => e.stopPropagation()}>
            <h2>📦 Заказ #{viewingOrder.id}</h2>
            
            <div className="order-info">
              <h3>Информация о клиенте</h3>
              <div className="info-row">
                <span><strong>Имя:</strong> {viewingOrder.customer_name}</span>
              </div>
              {viewingOrder.customer_phone && (
                <div className="info-row">
                  <span><strong>Телефон:</strong> {viewingOrder.customer_phone}</span>
                </div>
              )}
              {viewingOrder.customer_email && (
                <div className="info-row">
                  <span><strong>Email:</strong> {viewingOrder.customer_email}</span>
                </div>
              )}
              {viewingOrder.delivery_address && (
                <div className="info-row">
                  <span><strong>Адрес доставки:</strong> {viewingOrder.delivery_address}</span>
                </div>
              )}
              <div className="info-row">
                <span><strong>Статус:</strong> {viewingOrder.status}</span>
              </div>
              <div className="info-row">
                <span><strong>Дата:</strong> {new Date(viewingOrder.created_at).toLocaleString('ru-RU')}</span>
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
  {viewingOrder.items.map((item, index) => (
    <tr key={index}>
      <td>
        {item.product ? (
          item.product.name
        ) : (
          `Товар #${item.product_id} (удален)`
        )}
      </td>
      <td>{item.quantity}</td>
      <td>{Number(item.price).toLocaleString('ru-RU')} руб.</td>
      <td>{Number(item.price * item.quantity).toLocaleString('ru-RU')} руб.</td>
    </tr>
  ))}
</tbody>
                <tfoot>
                  <tr>
                    <td colSpan="3" style={{ textAlign: 'right', fontWeight: 'bold' }}>Итого:</td>
                    <td style={{ fontWeight: 'bold', color: '#ff6b81' }}>
                      {Number(viewingOrder.total_amount).toLocaleString('ru-RU')} руб.
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
            
            <div className="modal-buttons">
              <button 
                className="close-btn"
                onClick={() => setShowOrderModal(false)}
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;