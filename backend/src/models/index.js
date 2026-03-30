const sequelize = require('../configs/db.js');
const { DataTypes } = require('sequelize');

// Import thủ công các model bạn đã tạo
const Khachhang = require('./khachhangModel'); // Đổi tên cho đúng file của bạn
const Batdongsan = require('./batdongsanModel');
const Hopdongchuyennhuong = require('./hopdongchuyennhuongModel');
const Yeucaukhachhang = require('./yeucaukhachhangModel');

// Tạo Object chứa tất cả model
const db = {
    Sequelize: require('sequelize'),
    sequelize: sequelize,
    Khachhang: Khachhang,
    Batdongsan: Batdongsan,
    Hopdongchuyennhuong: Hopdongchuyennhuong,
    Yeucaukhachhang: Yeucaukhachhang
};

module.exports = db;