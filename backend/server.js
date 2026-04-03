const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sequelize } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
// Hiếu
const nhanVienRoutes = require('./routes/nhanVienRoutes');
// Phương Minh
const batDongSanRoutes = require('./routes/batdongsan'); 
// Lân
const khachHangRoutes = require('./routes/khachHangRoutes');
// Nam (Ký gửi)
const kyGuiRoutes = require('./routes/kyGuiRoutes');

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const { scheduleStatusUpdates } = require('./models/statusUpdater');

// --- 1. CẤU HÌNH MIDDLEWARE ---
app.use(cors());
// Tăng giới hạn để nhận base64 ảnh lớn từ FE
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// --- 2. CÁC ROUTE KIỂM TRA HỆ THỐNG ---
app.get('/', (req, res) => res.json({ message: 'Backend Real Estate API is running' }));
app.get('/api/health', (req, res) => res.json({ status: 'ok', db: 'connected' }));

// --- 3. ĐỊNH NGHĨA API ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/nhanvien', nhanVienRoutes);
app.use('/api/batdongsan', batDongSanRoutes);
app.use('/api/khachhang', khachHangRoutes);

app.use('/api/ky-gui', kyGuiRoutes);
if (typeof scheduleStatusUpdates === 'function') scheduleStatusUpdates();

// --- 4. XỬ LÝ LỖI 404 (ROUTE KHÔNG TỒN TẠI) ---
app.use((req, res) => {
    res.status(404).json({ message: 'Đường dẫn API không tồn tại' });
});

// --- 5. KHỞI CHẠY SERVER ---
const startServer = async () => {
    try {
        // Kiểm tra kết nối DB trước khi cho Server lắng nghe
        if (sequelize) {
            await sequelize.authenticate();
            console.log('Connected to MySQL Database.');
        }
        
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
