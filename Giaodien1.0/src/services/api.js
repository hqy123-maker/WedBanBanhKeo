import axios from "axios";

const API_URL = process.env.VUE_APP_API_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Thêm interceptor để gắn token nếu cần (cho các yêu cầu cần xác thực)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Hàm lấy tất cả sản phẩm
export const getAllProducts = () => api.get("/products");

// Hàm tìm kiếm, lọc, sắp xếp và phân trang sản phẩm
export const searchProducts = (params) => api.get("/products/search", { params });

export default api;