const NhanVien = require('../models/NhanVien');
const { sequelize, Sequelize } = require('../config/db');
const { Op } = require('sequelize');

// 1. LẤY DANH SÁCH NHÂN VIÊN
exports.getAllNhanVien = async (req, res) => {
  try {
    const { keyword } = req.query; 
    let condition = {};
    if (keyword) {  
      condition = { tennv: { [Op.like]: `%${keyword}%` } };
    }
    const data = await NhanVien.findAll({ where: condition });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server khi lấy danh sách", error: error.message });
  }
};

// 2. THÊM MỚI NHÂN VIÊN
exports.createNhanVien = async (req, res) => {
  try {
    const { taikhoan, matkhau, tennv, sdt, diachi, ngaysinh, email, gioitinh, quyen, trangthai } = req.body;
    
    // Kiểm tra các trường bắt buộc
    if (!taikhoan || !matkhau || !tennv || !sdt || !diachi || !ngaysinh || !email || 
        gioitinh === undefined || quyen === undefined || trangthai === undefined) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin nhân viên!" });
    }

    const exist = await NhanVien.findOne({ where: { taikhoan } });
    if (exist) return res.status(400).json({ message: "Tài khoản đã tồn tại" });

    const newNV = await NhanVien.create(req.body);
    res.status(201).json({ message: "Thêm thành công", data: newNV });
  } catch (error) {
    res.status(500).json({ message: "Lỗi thêm nhân viên", error: error.message });
  }
};

// 3. CẬP NHẬT NHÂN VIÊN (Có xử lý mật khẩu cũ/mới)
exports.updateNhanVien = async (req, res) => {
  try {
    const { id } = req.params;
    const { taikhoan, matkhau, tennv, sdt, diachi, ngaysinh, email, gioitinh, quyen, trangthai } = req.body;

    if (!taikhoan || !tennv || !sdt || !diachi || !ngaysinh || !email || 
        gioitinh === undefined || quyen === undefined || trangthai === undefined) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin!" });
    }

    const exist = await NhanVien.findOne({ where: { taikhoan } });
    if (exist && exist.nvid != id) {
      return res.status(400).json({ message: "Tài khoản bị trùng lặp!" });
    }

    const updateData = { ...req.body }; 
    // Nếu không nhập mật khẩu mới thì giữ nguyên mật khẩu cũ
    if (!matkhau || matkhau.trim() === "") {
      delete updateData.matkhau;
    }

    await NhanVien.update(updateData, { where: { nvid: id } });
    res.json({ message: "Cập nhật thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi cập nhật", error: error.message });
  }
};

// 4. XÓA NHÂN VIÊN (Kiểm tra ràng buộc cực kỳ chặt chẽ)
exports.deleteNhanVien = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Kiểm tra Bất Động Sản phụ trách
    const checkBDS = await sequelize.query(
      `SELECT COUNT(b.bdsid) as count 
       FROM batdongsan b 
       JOIN khachhang kh ON b.khid = kh.khid 
       WHERE kh.nvid = :id`,
      { replacements: { id }, type: Sequelize.QueryTypes.SELECT }
    );
    if (checkBDS[0].count > 0) {
      return res.status(400).json({ message: "Không thể xóa! Nhân viên này đang phụ trách khách hàng có Bất động sản." });
    }

    // 2. Kiểm tra Hợp Đồng Ký Gửi
    const checkKyGui = await sequelize.query(
      `SELECT COUNT(kg.kgid) as count 
       FROM hopdongkygui kg 
       JOIN khachhang kh ON kg.khid = kh.khid 
       WHERE kh.nvid = :id`,
      { replacements: { id }, type: Sequelize.QueryTypes.SELECT }
    );
    if (checkKyGui[0].count > 0) {
      return res.status(400).json({ message: "Không thể xóa! Nhân viên đang phụ trách khách hàng có HĐ ký gửi." });
    }

    // 3. Kiểm tra Hợp Đồng Chuyển Nhượng
    const checkChuyenNhuong = await sequelize.query(
      `SELECT COUNT(cn.cnid) as count 
       FROM hopdongchuyennhuong cn 
       JOIN khachhang kh ON cn.khid = kh.khid 
       WHERE kh.nvid = :id`,
      { replacements: { id }, type: Sequelize.QueryTypes.SELECT }
    );
    if (checkChuyenNhuong[0].count > 0) {
      return res.status(400).json({ message: "Không thể xóa! Nhân viên đang phụ trách khách hàng có HĐ chuyển nhượng." });
    }

    // Nếu không vướng víu gì mới được xóa thật
    const deletedRows = await NhanVien.destroy({ where: { nvid: id } });
    if (deletedRows === 0) return res.status(404).json({ message: "Không tìm thấy nhân viên!" });
    
    res.json({ message: "Xóa nhân viên thành công!" });
  } catch (error) {
    console.error("Lỗi SQL khi xóa:", error);
    res.status(500).json({ message: "Lỗi hệ thống khi xóa", error: error.message });
  }
};