const KhachHang = require('../models/khachHangModel');

const getKhachHangs = async (req, res) => {
  try {
    const danhSachKH = await KhachHang.findAll();
    res.status(200).json(danhSachKH);
  } catch (error) {
    console.error('Error in getKhachHangs:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách khách hàng.' });
  }
};

module.exports = { getKhachHangs };