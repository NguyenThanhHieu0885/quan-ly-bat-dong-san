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

export default api;