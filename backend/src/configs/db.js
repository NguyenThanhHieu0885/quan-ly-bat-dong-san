const { Sequelize } = require('sequelize');
require('dotenv').config();

// Khởi tạo kết nối Sequelize
const sequelize = new Sequelize(
    process.env.DB_NAME || 'quanlybatdongsan', 
    process.env.DB_USER || 'root', 
    process.env.DB_PASSWORD || '', 
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql',
        logging: false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        define: {
            timestamps: false, 
            freezeTableName: true 
        }
    }
);

// Kiểm tra kết nối
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Kết nối Database thành công (Sequelize).');
    } catch (error) {
        console.error('Lỗi kết nối Database:', error);
    }
};

testConnection();

module.exports = sequelize;