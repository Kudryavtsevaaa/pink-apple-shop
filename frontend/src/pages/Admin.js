import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { productsService } from '../services/products';
import { ordersService } from '../services/orders';
import { isAdminLoggedIn, clearAdminSession } from '../utils/auth';
import AdminToolbar from '../components/admin/AdminToolbar';
import ProductsTab from '../components/admin/ProductsTab';
import OrdersTab from '../components/admin/OrdersTab';
import AddProductForm from '../components/admin/AddProductForm';
import ProductEditModal from '../components/admin/ProductEditModal';
import OrderViewModal from '../components/admin/OrderViewModal';
import { getErrorMessage } from '../utils/errors';
import './Admin.css';

const EMPTY_PRODUCT = {
  name: '',
  description: '',
  price: '',
  image_url: '',
  category_id: '',
  stock_quantity: '',
};

function toProductPayload(form) {
  return {
    name: form.name,
    description: form.description || '',
    price: parseFloat(form.price),
    image_url: form.image_url || '',
    category_id: form.category_id ? parseInt(form.category_id, 10) : null,
    stock_quantity: parseInt(form.stock_quantity, 10) || 0,
  };
}

const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);

  const [editingProduct, setEditingProduct] = useState(null);
  const [viewingOrder, setViewingOrder] = useState(null);
  const [newProduct, setNewProduct] = useState(EMPTY_PRODUCT);

  useEffect(() => {
    if (!isAdminLoggedIn()) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (!statusMessage) return undefined;
    const timer = setTimeout(() => setStatusMessage(null), 4000);
    return () => clearTimeout(timer);
  }, [statusMessage]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [prods, cats, ords] = await Promise.all([
        productsService.getAll(),
        productsService.getCategories(),
        ordersService.getAll(),
      ]);
      setProducts(prods);
      setCategories(cats);
      setOrders(ords);
    } catch (err) {
      setError('Не удалось загрузить данные. Убедитесь, что backend запущен.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLogout = () => {
    clearAdminSession();
    navigate('/login');
  };

  const handleProductChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      await productsService.update(editingProduct.id, toProductPayload(editingProduct));
      setStatusMessage('Товар обновлен');
      setEditingProduct(null);
      fetchData();
    } catch (err) {
      setStatusMessage(getErrorMessage(err, 'Не удалось обновить товар'));
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Удалить этот товар?')) return;
    try {
      await productsService.delete(productId);
      setStatusMessage('Товар удален');
      fetchData();
    } catch (err) {
      setStatusMessage(getErrorMessage(err, 'Не удалось удалить товар'));
    }
  };

  const handleViewOrder = async (orderId) => {
    try {
      const order = await ordersService.getById(orderId);
      setViewingOrder(order);
    } catch (err) {
      setStatusMessage('Не удалось загрузить заказ');
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await ordersService.updateStatus(orderId, newStatus);
      setStatusMessage(`Статус заказа #${orderId} обновлен`);
      fetchData();
    } catch (err) {
      setStatusMessage('Не удалось обновить статус заказа');
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await productsService.create(toProductPayload(newProduct));
      setStatusMessage('Товар добавлен');
      setNewProduct(EMPTY_PRODUCT);
      fetchData();
    } catch (err) {
      setStatusMessage(getErrorMessage(err, 'Не удалось добавить товар'));
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner" />
        <p>Загрузка данных...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-error">
        <h2>Ошибка</h2>
        <p>{error}</p>
        <button type="button" onClick={fetchData}>
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div className="admin">
      <h1>Панель администратора</h1>

      <AdminToolbar onLogout={handleLogout} />

      {statusMessage && <div className="admin-status-message">{statusMessage}</div>}

      <div className="admin-tabs">
        <button
          type="button"
          className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          Товары
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Заказы
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'add' ? 'active' : ''}`}
          onClick={() => setActiveTab('add')}
        >
          Добавить товар
        </button>
      </div>

      {activeTab === 'products' && (
        <ProductsTab
          products={products}
          onEdit={setEditingProduct}
          onDelete={handleDeleteProduct}
        />
      )}

      {activeTab === 'orders' && (
        <OrdersTab
          orders={orders}
          onStatusChange={handleUpdateOrderStatus}
          onView={handleViewOrder}
        />
      )}

      {activeTab === 'add' && (
        <AddProductForm
          newProduct={newProduct}
          categories={categories}
          onChange={handleProductChange}
          onSubmit={handleAddProduct}
        />
      )}

      {editingProduct && (
        <ProductEditModal
          product={editingProduct}
          onChange={setEditingProduct}
          onClose={() => setEditingProduct(null)}
          onSubmit={handleSaveProduct}
        />
      )}

      {viewingOrder && (
        <OrderViewModal order={viewingOrder} onClose={() => setViewingOrder(null)} />
      )}
    </div>
  );
};

export default Admin;
