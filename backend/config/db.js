const { Sequelize } = require('sequelize');
require('dotenv').config();


const sequelize = new Sequelize(
  process.env.DB_NAME, 
  process.env.DB_USER, 
  process.env.DB_PASSWORD, 
  {
    host: process.env.DB_HOST,
    dialect: 'mysql'
  }
);

module.exports = sequelize;

// kiểm tra kết nối ngay khi chạy server
sequelize.authenticate()
  .then(() => {
    console.log('Kết nối Database thành công!');
  })
  .catch(err => {
    console.error('Không thể kết nối Database:', err);
  });