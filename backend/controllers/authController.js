const NhanVien = require('../models/NhanVien');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES = '1h'; 

// Kiểm tra cấu hình hệ thống ngay khi khởi động
if (!JWT_SECRET) {
    console.error("CRITICAL ERROR: JWT_SECRET is not defined in .env file");
    // Trong môi trường Production, Server nên dừng nếu thiếu cái này
    // process.exit(1); 
}

const getRoleName = (quyen) => {
    return Number(quyen) === 1 ? 'admin' : 'nhanvien';
};

// --- 1. ĐĂNG NHẬP ---
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await NhanVien.findOne({ 
      where: {
        [Op.or] : [{ email: email }, { taikhoan: email }]
      }
    });

    if (!user || String(user.matkhau) !== String(password)) {
      return res.status(401).json({ message: 'Sai tài khoản hoặc mật khẩu' });
    }

    const roleName = getRoleName(user.quyen);
    const payload = { id: user.nvid, email: user.email, role: roleName };
    
    // Ký token với thời hạn 1 giờ
    const token = jwt.sign(payload, JWT_SECRET || 'fallback_secret', { expiresIn: JWT_EXPIRES });

    return res.json({
      token,
      user: {
        id: user.nvid,
        tennv: user.tennv,
        email: user.email,
        role: roleName
      }
    });
  } catch (error) {
    console.error("Lỗi Login:", error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// --- 2. ĐĂNG KÝ ---
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Thiếu email hoặc mật khẩu' });

    const exist = await NhanVien.findOne({ 
      where: { [Op.or]: [{ email }, { taikhoan: email }] } 
    });
    
    if (exist) return res.status(400).json({ message: 'Tài khoản đã tồn tại' });

    await NhanVien.create({
      taikhoan: email,
      matkhau: password,
      tennv: String(email).split('@')[0],
      email,
      quyen: 0, 
      trangthai: 1
    });

    return res.status(201).json({ message: 'Đăng ký thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi đăng ký', error: error.message });
  }
};

// --- 3. MIDDLEWARE XÁC THỰC ---
exports.verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token không hợp lệ' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET || 'fallback_secret');
    
    const user = await NhanVien.findByPk(decoded.id);
    if (!user) return res.status(401).json({ message: 'User không tồn tại' });

    req.user = { 
        id: user.nvid, 
        tennv: user.tennv, 
        email: user.email, 
        role: getRoleName(user.quyen) 
    };
    next();
  } catch (err) {
    // Nếu token hết hạn (sau 1h), trả về lỗi 401 để Front-end đá ra trang Login
    return res.status(401).json({ message: 'Token hết hạn', error: err.message });
  }
};

exports.requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Quyền Admin bị từ chối' });
  }
  next();
};

exports.me = (req, res) => {
  if (!req.user) return res.status(401).json({ message: 'Chưa đăng nhập' });
  res.json({ user: req.user });
};

exports.logout = (req, res) => res.json({ message: 'Đã đăng xuất' });