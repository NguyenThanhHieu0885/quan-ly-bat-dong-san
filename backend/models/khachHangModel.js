const { pool } = require('../config/db');

const KhachHang = {
  async findAll() {
    // Câu SQL lấy danh sách Khách Hàng. Cập nhật tên bảng nếu database của bạn đặt khác.
    const [rows] = await pool.query('SELECT * FROM khachhang');
    return rows;
  }
};

module.exports = KhachHang;