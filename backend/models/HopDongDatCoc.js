const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const HopDongDatCoc = sequelize.define('HopDongDatCoc', {
  dcid: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  khid: { type: DataTypes.INTEGER, allowNull: true },
  bdsid: { type: DataTypes.INTEGER, allowNull: true },
  ngaylaphd: { type: DataTypes.DATEONLY, allowNull: true }, // Khớp tên ngaylaphd
  giatri: { type: DataTypes.FLOAT, allowNull: true },
  tinhtrang: { type: DataTypes.INTEGER, allowNull: true },
  trangthai: { type: DataTypes.BOOLEAN, allowNull: true },
  ngayhethan: { type: DataTypes.DATEONLY, allowNull: true },
}, {
  tableName: 'hopdongdatcoc',
  timestamps: false
});

module.exports = HopDongDatCoc;