import axios from "axios";

const API = "http://localhost:3000/api/khachhang";

export const getAllKhachHang = () => axios.get(API);
export const createKhachHang = (data) => axios.post(API, data);
export const updateKhachHang = (id, data) => axios.put(`${API}/${id}`, data);
export const deleteKhachHang = (id) => axios.delete(`${API}/${id}`);