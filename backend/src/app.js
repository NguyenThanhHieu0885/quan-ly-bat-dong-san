const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Kiểm tra kỹ dòng này: có dấu chấm (.) và xuyệt (/) đúng folder configs
const sequelize = require('./configs/db.js'); 

const app = express();
app.use(cors());
app.use(express.json());

// Import Routes
const khachhangRoute = require('./routes/khachhangRoute');
app.use('/api/khachhang', khachhangRoute);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Kết nối database thành công.');
        app.listen(PORT, () => console.log(`Server đang chạy tại port ${PORT}`));
    } catch (error) {
        console.error('Không thể kết nối database:', error);
    }
};

startServer();