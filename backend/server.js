const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sequelize } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const nhanVienRoutes = require('./routes/nhanVienRoutes');
const khachHangRoutes = require('./routes/khachHangRoutes');

const app = express();
const PORT = Number(process.env.PORT) || 5000;

// --- 1. CẤU HÌNH MIDDLEWARE ---
app.use(cors());
app.use(express.json());

// --- 2. CÁC ROUTE KIỂM TRA HỆ THỐNG ---
app.get('/', (req, res) => res.json({ message: 'Backend Real Estate API is running' }));
app.get('/api/health', (req, res) => res.json({ status: 'ok', db: 'connected' }));

// --- 3. ĐỊNH NGHĨA API ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/nhanvien', nhanVienRoutes);
app.use('/api/khachhang', khachHangRoutes);

// --- 4. XỬ LÝ LỖI 404 (ROUTE KHÔNG TỒN TẠI) ---
app.use((req, res) => {
    res.status(404).json({ message: 'Đường dẫn API không tồn tại' });
});

// --- 5. KHỞI CHẠY SERVER ---
const startServer = async () => {
    try {
        // Kiểm tra kết nối DB trước khi cho Server lắng nghe
        await sequelize.authenticate();
        console.log('Connected to MySQL Database.');
        
        app.listen(PORT, () => {
            console.log(`Server is running at: http://localhost:${PORT}`);
            console.log(`DB User: ${process.env.DB_USER}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error.message);
        process.exit(1); // Thoát nếu không kết nối được DB
    }
};

startServer();

