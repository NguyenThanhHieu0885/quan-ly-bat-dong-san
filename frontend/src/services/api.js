import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

export const getBatDongSan = () => api.get('/batdongsan');

export const getChiTietBDS = (id) => api.get(`/batdongsan/${id}`);

export default api;