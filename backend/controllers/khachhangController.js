const KhachHang = require('../models/KhachHang');

const getKhachHangs = async (req, res) => {
  try {
    const danhSachKH = await KhachHang.findAll();
    res.status(200).json(danhSachKH);
  } catch (error) {
    console.error('Error in getKhachHangs:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách khách hàng.' });
  }
};

const createKhachHang = async (req, res) => {
  res.status(501).json({ message: 'Chức năng tạo khách hàng chưa được triển khai.' });
};

const updateKhachHang = async (req, res) => {
  res.status(501).json({ message: 'Chức năng cập nhật khách hàng chưa được triển khai.' });
};

const deleteKhachHang = async (req, res) => {
  res.status(501).json({ message: 'Chức năng xóa khách hàng chưa được triển khai.' });
};

module.exports = { getKhachHangs, createKhachHang, updateKhachHang, deleteKhachHang };