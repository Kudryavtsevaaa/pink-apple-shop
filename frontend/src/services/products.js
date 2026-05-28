import api from './api';

export const productsService = {
  getAll: async (categoryId = null) => {
    const params = categoryId ? { category_id: categoryId } : {};
    const response = await api.get('/products/', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get('/categories/');
    return response.data;
  },
};