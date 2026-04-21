// File: frontend/src/services/hdChuyenNhuongService.js
import api from './api'; // Import file api.js gốc của nhóm

export const hdChuyenNhuongService = {
  getAll: (keyword = '') => api.get(`/hdchuyennhuong?keyword=${keyword}`),
<<<<<<< Updated upstream
  getDetail: (id) => api.get(`/hdchuyennhuong/chitiet/${id}`),
=======
>>>>>>> Stashed changes
  create: (data) => api.post('/hdchuyennhuong', data),
  delete: (id) => api.delete(`/hdchuyennhuong/${id}`),
  getBDSInfo: (bdsid) => api.get(`/hdchuyennhuong/bds/${bdsid}`),
  
  // API lấy danh sách HĐ đặt cọc chưa được chuyển nhượng
<<<<<<< Updated upstream
  getHDDatCocHopLe: (params = {}) => api.get('/hdchuyennhuong/hopdongdatcoc', { params })
=======
  getHDDatCocHopLe: () => api.get('/hdchuyennhuong/hopdongdatcoc') 
>>>>>>> Stashed changes
};