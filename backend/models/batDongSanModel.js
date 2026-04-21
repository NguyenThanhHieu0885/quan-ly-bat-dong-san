const { pool } = require('../config/db');

const BatDongSan = {
  async findAll() {
    // Câu SQL lấy tất cả BĐS. 
    // Lưu ý: Nếu tên bảng của bạn trong MySQL không phải là 'batdongsan', hãy sửa lại cho đúng.
    const [rows] = await pool.query('SELECT * FROM batdongsan');
    return rows;
  }
};

module.exports = BatDongSan;