import axios from 'axios';

// The Vite development server proxies requests starting with /api to the backend server (e.g. http://localhost:5000)
// For production, this base URL might need to be configured differently if the frontend and backend are hosted separately.
const api = axios.create({
  baseURL: '/api',
});

// Fetch all products
export const getProducts = async (params = {}) => {
  try {
    const response = await api.get('/products', { params });
    if (Array.isArray(response.data)) {
      return response.data;
    }
    console.error('getProducts: Expected array, but received:', typeof response.data, response.data);
    return [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

// Fetch a single product by ID
export const getProductById = async (id) => {
  try {
    const response = await api.get(`/products/${id}`);
    if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    return null;
  }
};

export default api;
