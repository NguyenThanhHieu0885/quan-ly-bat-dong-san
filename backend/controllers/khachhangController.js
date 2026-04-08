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
  try {
    const newKH = await KhachHang.create(req.body);
    res.status(201).json({ message: 'Thêm khách hàng thành công', data: newKH });
  } catch (error) {
    console.error('Error in createKhachHang:', error);
    res.status(500).json({ message: 'Lỗi server khi thêm khách hàng.' });
  }
};

const updateKhachHang = async (req, res) => {
  try {
    const { id } = req.params;
    // Sequelize update trả về một mảng, phần tử đầu tiên là số dòng bị ảnh hưởng
    const [updatedRows] = await KhachHang.update(req.body, { where: { khid: id } });
    
    if (updatedRows > 0) {
      res.status(200).json({ message: 'Cập nhật khách hàng thành công.' });
    } else {
      res.status(404).json({ message: 'Không tìm thấy khách hàng để cập nhật.' });
    }
  } catch (error) {
    console.error('Error in updateKhachHang:', error);
    res.status(500).json({ message: 'Lỗi server khi cập nhật khách hàng.' });
  }
};

const deleteKhachHang = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRows = await KhachHang.destroy({ where: { khid: id } });
    
    if (deletedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy khách hàng này trong hệ thống để xóa!' });
    }
    
    res.status(200).json({ message: 'Xóa khách hàng thành công.' });
  } catch (error) {
    console.error('Error in deleteKhachHang:', error);
    res.status(500).json({ message: 'Lỗi server khi xóa khách hàng.' });
  }
};

module.exports = { getKhachHangs, createKhachHang, updateKhachHang, deleteKhachHang };