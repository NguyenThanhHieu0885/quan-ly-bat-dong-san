require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { sequelize } = require('./config/db');

// --- 1. IMPORT CÁC ROUTES ---
const authRoutes = require('./routes/authRoutes');
const hopdongdatcocRoutes = require('./routes/hopdongdatcocRoutes');
const nhanVienRoutes = require('./routes/nhanVienRoutes');
const khachHangRoutes = require('./routes/khachHangRoutes');
const batDongSanRoutes = require('./routes/batdongsanRoutes');

// --- 2. IMPORT CÁC MODELS ĐỂ THIẾT LẬP QUAN HỆ (PHẢI Ở ĐÂY) ---
const HopDongDatCoc = require('./models/HopDongDatCoc');
const BatDongSan = require('./models/BatDongSan');
const KhachHang = require('./models/KhachHang');
const NhanVien = require('./models/NhanVien');

// --- 3. THIẾT LẬP MỐI QUAN HỆ (ASSOCIATIONS) ---
// Phải chạy trước khi định nghĩa API Routes
HopDongDatCoc.belongsTo(BatDongSan, { foreignKey: 'bdsid' });
BatDongSan.hasMany(HopDongDatCoc, { foreignKey: 'bdsid' });

HopDongDatCoc.belongsTo(KhachHang, { foreignKey: 'khid' });
KhachHang.hasMany(HopDongDatCoc, { foreignKey: 'khid' });

// HopDongDatCoc.belongsTo(NhanVien, { foreignKey: 'nvid' });
// NhanVien.hasMany(HopDongDatCoc, { foreignKey: 'nvid' });

KhachHang.belongsTo(NhanVien, { foreignKey: 'nvid' });
NhanVien.hasMany(KhachHang, { foreignKey: 'nvid' });


const app = express();
const PORT = Number(process.env.PORT) || 5000;

// --- 4. CẤU HÌNH MIDDLEWARE ---
app.use(cors());
app.use(express.json());

// --- 5. ĐỊNH NGHĨA API ROUTES (SAU KHI ĐÃ CÓ QUAN HỆ) ---
app.get('/', (req, res) => res.json({ message: 'Backend Real Estate API is running' }));
app.get('/api/health', (req, res) => res.json({ status: 'ok', db: 'connected' }));

app.use('/api/auth', authRoutes);
app.use('/api/hopdong', hopdongdatcocRoutes);
app.use('/api/nhanvien', nhanVienRoutes);
app.use('/api/khachhang', khachHangRoutes);
app.use('/api/batdongsan', batDongSanRoutes);

// --- 6. XỬ LÝ LỖI 404 ---
app.use((req, res) => {
    res.status(404).json({ message: 'Đường dẫn API không tồn tại' });
});

// --- 7. KHỞI CHẠY SERVER ---
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to MySQL Database.');
        
        app.listen(PORT, () => {
            console.log(`Server is running at: http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error.message);
        process.exit(1);
    }
};

startServer();