import axios from 'axios';
import { Product } from './store';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? ' https://quick-ecom-server.onrender.com' 
  : 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const productAPI = {
  getAll: async (search?: string) => {
    const params = search ? { search } : {};
    const response = await api.get('/api/products', { params });
    return response.data;
  },
  
  create: async (product: Omit<Product, 'id'>) => {
    const response = await api.post('/api/products', product);
    return response.data;
  },
  
  update: async (id: number, product: Partial<Product>) => {
    const response = await api.put(`/api/products/${id}`, product);
    return response.data;
  },
  
  delete: async (id: number) => {
    await api.delete(`/api/products/${id}`);
  }
};

export default api;