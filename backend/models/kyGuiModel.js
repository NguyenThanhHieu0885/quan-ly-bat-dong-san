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
    type: DataTypes.DECIMAL(18, 0), // Sử dụng DECIMAL hoặc DOUBLE tùy kiểu dữ liệu DB của bạn
    allowNull: false
  },
  chiphidv: {
    type: DataTypes.DECIMAL(18, 0),
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
    defaultValue: 0
  }
}, {
  tableName: 'hopdongkygui', // Khớp với tên bảng trong cơ sở dữ liệu
  timestamps: false          // Đặt false nếu DB của bạn không có cột createdAt, updatedAt
});

module.exports = KyGui;
