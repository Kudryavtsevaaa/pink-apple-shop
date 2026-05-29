import React from 'react';
import { getAdminUsername } from '../../utils/auth';

const AdminToolbar = ({ onLogout }) => (
  <div className="admin-toolbar">
    <span className="admin-user">{getAdminUsername()}</span>
    <button type="button" className="admin-logout-btn" onClick={onLogout}>
      Выйти
    </button>
  </div>
);

export default AdminToolbar;
