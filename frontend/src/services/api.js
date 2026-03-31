import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api", // backend địa phương (port 3000)
});

// gắn token tự động
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// APIs cho bất động sản
export const getBatDongSan = () => api.get("/batdongsan");
export const getChiTietBDS = (id) => api.get(`/batdongsan/${id}`);

export default api;