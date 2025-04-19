import axios from 'axios';

const API_URL = 'http://localhost:3000/api'; // Đường dẫn tới backend của bạn

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true // Cho phép gửi cookie nếu backend sử dụng
});

// Thêm interceptor để tự động gắn token vào header của mỗi request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Hàm đăng ký
export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw error.response.data; // Ném lỗi nếu có
  }
};

// Hàm đăng nhập
export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Hàm đăng xuất
export const logout = async () => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.error('Lỗi đăng xuất:', error);
  }
};

// Hàm lấy thông tin hồ sơ
export const getProfile = async () => {
  try {
    const response = await api.get('/auth/profile');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export const getAllProducts = () => api.get("/products");
export const getProductById = (id) => api.get(`/products/${id}`);
export const searchProducts = (params) => api.get("/products/search", { params });

export default api;