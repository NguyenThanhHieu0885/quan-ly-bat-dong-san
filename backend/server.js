require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { sequelize } = require('./config/db');

// --- 1. IMPORT CÁC ROUTES (Giữ nguyên của tất cả các bạn) ---
const authRoutes = require('./routes/authRoutes');
const khachHangRoutes = require('./routes/khachHangRoutes');
const nhanVienRoutes = require('./routes/nhanVienRoutes'); // Hiếu
const hdChuyenNhuongRoutes = require('./routes/hdChuyenNhuongRoutes'); // Hiếu
const batDongSanRoutes = require('./routes/batdongsanRoutes'); // Phương Minh
const khachHangRoutes = require('./routes/khachHangRoutes'); // Lân
const hopdongdatcocRoutes = require('./routes/hopdongdatcocRoutes'); // Lân (Module mới)

// --- 2. IMPORT CÁC MODELS ĐỂ THIẾT LẬP QUAN HỆ ---
const HopDongDatCoc = require('./models/HopDongDatCoc');
const BatDongSan = require('./models/BatDongSan');
const KhachHang = require('./models/KhachHang');
const NhanVien = require('./models/NhanVien');

// --- 3. THIẾT LẬP MỐI QUAN HỆ (ASSOCIATIONS) ---
// Những dòng này CHỈ bổ sung thêm, không xóa bỏ bất kỳ logic cũ nào
HopDongDatCoc.belongsTo(BatDongSan, { foreignKey: 'bdsid' });
BatDongSan.hasMany(HopDongDatCoc, { foreignKey: 'bdsid' });

HopDongDatCoc.belongsTo(KhachHang, { foreignKey: 'khid' });
KhachHang.hasMany(HopDongDatCoc, { foreignKey: 'khid' });

KhachHang.belongsTo(NhanVien, { foreignKey: 'nvid' });
NhanVien.hasMany(KhachHang, { foreignKey: 'nvid' });

const app = express();
const PORT = Number(process.env.PORT) || 5000;

// --- 4. CẤU HÌNH MIDDLEWARE (Giữ giới hạn 50mb để các bạn khác upload ảnh không lỗi) ---
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// --- 5. ĐỊNH NGHĨA API ROUTES ---
app.get('/', (req, res) => res.json({ message: 'Backend Real Estate API is running' }));
app.get('/api/health', (req, res) => res.json({ status: 'ok', db: 'connected' }));

// Các API cũ của nhóm (Giữ nguyên đường dẫn để Front-end của các bạn không bị 404)
app.use('/api/auth', authRoutes);
app.use('/api/nhanvien', nhanVienRoutes);
app.use('/api/hdchuyennhuong', hdChuyenNhuongRoutes);
app.use('/api/batdongsan', batDongSanRoutes);
app.use('/api/khachhang', khachHangRoutes);

// API Hợp đồng mới của Fen
app.use('/api/hopdong', hopdongdatcocRoutes);

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
            console.log(`DB User: ${process.env.DB_USER}`); // Giữ lại để debug giống bản cũ
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error.message);
        process.exit(1);
    }
};

startServer();