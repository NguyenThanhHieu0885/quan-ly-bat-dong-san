// File: backend/models/NhanVien.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // File cấu hình DB của Diệp Lân

const NhanVien = sequelize.define('NhanVien', {
  nvid: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  taikhoan: { type: DataTypes.STRING(50), allowNull: false },
  matkhau: { type: DataTypes.STRING(50), allowNull: false },
  tennv: { type: DataTypes.STRING(50), allowNull: false },
  sdt: { type: DataTypes.STRING(15) },
  diachi: { type: DataTypes.STRING(255) },
  ngaysinh: { type: DataTypes.DATEONLY },
  gioitinh: { type: DataTypes.BOOLEAN }, // 1: Nam, 0: Nữ
  doanhthu: { type: DataTypes.FLOAT, defaultValue: 0 },
  email: { type: DataTypes.STRING(100) },
  quyen: { type: DataTypes.BOOLEAN, defaultValue: false }, // 0: Nhân viên, 1: Quản lý
  trangthai: { type: DataTypes.BOOLEAN, defaultValue: true } // 1: Đang làm, 0: Nghỉ việc
}, {
  tableName: 'nhanvien',
  timestamps: false // Bỏ qua createdAt, updatedAt
});

module.exports = NhanVien;