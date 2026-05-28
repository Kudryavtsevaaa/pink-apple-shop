// frontend/src/pages/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await fetch('https://slick-bobcats-drop.loca.lt/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Ошибка входа');
      }
      
      const data = await response.json();
      
      // Сохраняем, что админ вошёл
      localStorage.setItem('admin_logged_in', 'true');
      localStorage.setItem('admin_username', data.username);
      
      // Сообщаем родителю, что вошли
      if (onLogin) onLogin();
      
      // Переходим в админку
      navigate('/admin');
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>🔐 Вход для администратора</h1>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Логин</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="admin"
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label>Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              disabled={loading}
            />
          </div>
          
          {error && <div className="error-message">❌ {error}</div>}
          
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>
        
        <p className="login-hint">
          Демо-доступ: <strong>admin</strong> / <strong>admin123</strong>
        </p>
      </div>
    </div>
  );
};

export default Login;