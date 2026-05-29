import api from './api';

export const ordersService = {
  create: async (orderData) => {
    const response = await api.post('/orders/', orderData);
    return response.data;
  },

  getAll: async () => {
    const response = await api.get('/orders/');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await api.put(`/orders/${id}/status`, null, {
      params: { status },
    });
    return response.data;
  },
};