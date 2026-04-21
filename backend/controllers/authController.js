<<<<<<< Updated upstream
const NhanVien = require('../models/NhanVien');
=======
const NhanVien = require('../models/NhanVienModel');
>>>>>>> Stashed changes
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

const JWT_SECRET = process.env.JWT_SECRET;
<<<<<<< Updated upstream
const JWT_EXPIRES = '1h'; 

// Kiểm tra cấu hình hệ thống ngay khi khởi động
if (!JWT_SECRET) {
    console.error("CRITICAL ERROR: JWT_SECRET is not defined in .env file");
    // Trong môi trường Production, Server nên dừng nếu thiếu cái này
    // process.exit(1); 
=======
const JWT_EXPIRES = process.env.JWT_EXPIRES || '1h';
if (!JWT_SECRET) {
    console.error("CRITICAL ERROR: JWT_SECRET is not defined in .env file");
    process.exit(1); // Dừng server nếu thiếu cấu hình quan trọng
>>>>>>> Stashed changes
}

const getRoleName = (quyen) => {
    return Number(quyen) === 1 ? 'admin' : 'nhanvien';
};

<<<<<<< Updated upstream
// --- 1. ĐĂNG NHẬP ---
=======
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
    const payload = { id: user.nvid, email: user.email, role: roleName };
    
    // Ký token với thời hạn 1 giờ
    const token = jwt.sign(payload, JWT_SECRET || 'fallback_secret', { expiresIn: JWT_EXPIRES });
=======
    console.log(`>>> Login thành công: ${user.tennv} - Role: ${roleName}`);

    const payload = { id: user.nvid, email: user.email, role: roleName };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
>>>>>>> Stashed changes

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

<<<<<<< Updated upstream
// --- 2. ĐĂNG KÝ ---
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Thiếu email hoặc mật khẩu' });
=======
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Vui lòng cung cấp email và mật khẩu' });
>>>>>>> Stashed changes

    const exist = await NhanVien.findOne({ 
      where: { [Op.or]: [{ email }, { taikhoan: email }] } 
    });
    
<<<<<<< Updated upstream
    if (exist) return res.status(400).json({ message: 'Tài khoản đã tồn tại' });

    await NhanVien.create({
=======
    if (exist) return res.status(400).json({ message: 'Email hoặc tài khoản đã tồn tại' });

    const newUser = await NhanVien.create({
>>>>>>> Stashed changes
      taikhoan: email,
      matkhau: password,
      tennv: String(email).split('@')[0],
      email,
<<<<<<< Updated upstream
      quyen: 0, 
=======
      gioitinh: 0,
      quyen: 0, // Mặc định là nhân viên
>>>>>>> Stashed changes
      trangthai: 1
    });

    return res.status(201).json({ message: 'Đăng ký thành công' });
  } catch (error) {
<<<<<<< Updated upstream
    res.status(500).json({ message: 'Lỗi đăng ký', error: error.message });
  }
};

// --- 3. MIDDLEWARE XÁC THỰC ---
=======
    res.status(500).json({ message: 'Lỗi server khi đăng ký', error: error.message });
  }
};

exports.logout = async (req, res) => {
  res.json({ message: 'Đã đăng xuất' });
};

// --- fix lỗi 500 ---
>>>>>>> Stashed changes
exports.verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token không hợp lệ' });
    }

    const token = authHeader.split(' ')[1];
<<<<<<< Updated upstream
    const decoded = jwt.verify(token, JWT_SECRET || 'fallback_secret');
    
    const user = await NhanVien.findByPk(decoded.id);
    if (!user) return res.status(401).json({ message: 'User không tồn tại' });

=======
    const decoded = jwt.verify(token, JWT_SECRET);
    
    const user = await NhanVien.findByPk(decoded.id);
    if (!user) return res.status(401).json({ message: 'Người dùng không tồn tại' });

    // QUAN TRỌNG: Phải dùng hàm getRoleName ở đây luôn để đồng bộ với Login
>>>>>>> Stashed changes
    req.user = { 
        id: user.nvid, 
        tennv: user.tennv, 
        email: user.email, 
        role: getRoleName(user.quyen) 
    };
    next();
  } catch (err) {
<<<<<<< Updated upstream
    // Nếu token hết hạn (sau 1h), trả về lỗi 401 để Front-end đá ra trang Login
=======
>>>>>>> Stashed changes
    return res.status(401).json({ message: 'Token hết hạn', error: err.message });
  }
};

exports.requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
<<<<<<< Updated upstream
    return res.status(403).json({ message: 'Quyền Admin bị từ chối' });
=======
    return res.status(403).json({ message: 'Chỉ Admin mới có quyền này' });
>>>>>>> Stashed changes
  }
  next();
};

exports.me = (req, res) => {
  if (!req.user) return res.status(401).json({ message: 'Chưa đăng nhập' });
  res.json({ user: req.user });
<<<<<<< Updated upstream
};

exports.logout = (req, res) => res.json({ message: 'Đã đăng xuất' });
=======
};
>>>>>>> Stashed changes
