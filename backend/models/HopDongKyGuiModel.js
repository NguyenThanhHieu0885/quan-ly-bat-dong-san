const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const KyGui = sequelize.define('KyGui', {
  kgid: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  khid: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  bdsid: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  giatri: {
    type: DataTypes.DOUBLE(18, 0),
    allowNull: false
  },
  chiphidv: {
    type: DataTypes.DOUBLE(18, 0),
    allowNull: false
  },
  ngaybatdau: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  ngayketthuc: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  trangthai: {
    type: DataTypes.INTEGER,
    defaultValue: 1 // Đổi mặc định thành 1 (Đang hiệu lực) để đồng bộ với logic nghiệp vụ mới
  }
}, {
  tableName: 'hopdongkygui', // Khớp với tên bảng trong cơ sở dữ liệu
  timestamps: false          // Đặt false nếu DB của bạn không có cột createdAt, updatedAt
});

// Thiết lập quan hệ (Associations)
// Import các model liên quan để định nghĩa mối quan hệ
const KhachHang = require('./KhachHangModel');
const BatDongSan = require('./BatDongSanModel');
const NhanVien = require('./NhanVienModel');

KyGui.belongsTo(KhachHang, { foreignKey: 'khid' });
KyGui.belongsTo(BatDongSan, { foreignKey: 'bdsid' });

module.exports = KyGui;
