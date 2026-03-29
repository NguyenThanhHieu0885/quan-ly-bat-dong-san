// File: backend/controllers/nhanVienController.js
const NhanVien = require('../models/NhanVien');

exports.getAllNhanVien = async (req, res) => {
  try {
    const { keyword } = req.query; 
    let condition = {};
    if (keyword) {
      condition = { tennv: { [require('sequelize').Op.like]: `%${keyword}%` } };
    }
    const data = await NhanVien.findAll({ where: condition });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

exports.createNhanVien = async (req, res) => {
  try {
    const { taikhoan, matkhau, tennv } = req.body;
    
    if (!taikhoan || !matkhau || !tennv) {
      return res.status(400).json({ message: "Tài khoản, mật khẩu và tên không được rỗng" });
    }

    const exist = await NhanVien.findOne({ where: { taikhoan } });
    if (exist) {
      return res.status(400).json({ message: "Tài khoản đã tồn tại" });
    }

    const newNV = await NhanVien.create(req.body);
    res.status(201).json({ message: "Thêm thành công", data: newNV });
  } catch (error) {
    res.status(500).json({ message: "Lỗi thêm nhân viên", error });
  }
};

exports.updateNhanVien = async (req, res) => {
  try {
    const { id } = req.params;
    const { taikhoan, tennv } = req.body;

    if (!taikhoan || !tennv) {
      return res.status(400).json({ message: "Tài khoản và tên không được rỗng" });
    }

    await NhanVien.update(req.body, { where: { nvid: id } });
    res.json({ message: "Cập nhật thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi cập nhật", error });
  }
};

exports.deleteNhanVien = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Đổi trạng thái = 0 (Nghỉ việc) thay vì xóa hẳn dòng để giữ lịch sử hợp đồng
    await NhanVien.update({ trangthai: 0 }, { where: { nvid: id } }); 
    res.json({ message: "Đã chuyển trạng thái nhân viên thành Nghỉ việc" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa", error });
  }
};