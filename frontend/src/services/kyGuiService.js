import api from './api';

export const taoKyGuiMoi = (data) => {
  return api.post('/ky-gui', data);
};

export const layDanhSachKyGui = () => {
  return api.get('/ky-gui');
};

export const layKyGuiTheoId = (id) => {
  return api.get(`/ky-gui/${id}`);
};

export const capNhatKyGui = (id, data) => {
  return api.put(`/ky-gui/${id}`, data);
};

export const xoaKyGui = (id) => {
  return api.delete(`/ky-gui/${id}`);
};

export const layDanhSachBDS = () => {
  return api.get('/bat-dong-san');
};

export const layDanhSachKhachHang = () => {
  return api.get('/khach-hang');
};