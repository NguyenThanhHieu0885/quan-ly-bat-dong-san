<<<<<<< Updated upstream
const NhanVien = require('../models/NhanVien');
const { sequelize, Sequelize } = require('../config/db');
const { Op } = require('sequelize');

const MIN_EMPLOYEE_AGE = 18;
const MAX_EMPLOYEE_AGE = 70;

const validateBirthDate = (inputDate) => {
  const birthDate = new Date(inputDate);
  if (Number.isNaN(birthDate.getTime())) {
    return 'Ngày sinh không hợp lệ!';
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  birthDate.setHours(0, 0, 0, 0);

  if (birthDate > today) {
    return 'Ngày sinh không được ở tương lai!';
  }

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1;
  }

  if (age < MIN_EMPLOYEE_AGE) {
    return `Nhân viên phải từ ${MIN_EMPLOYEE_AGE} tuổi trở lên!`;
  }

  if (age > MAX_EMPLOYEE_AGE) {
    return `Ngày sinh không hợp lệ (tuổi vượt quá ${MAX_EMPLOYEE_AGE})!`;
  }

  return null;
};

// 1. LẤY DANH SÁCH NHÂN VIÊN
exports.getAllNhanVien = async (req, res) => {
  try {
    const { keyword } = req.query;
    const trimmedKeyword = typeof keyword === 'string' ? keyword.trim() : '';
    let condition = {};
    if (trimmedKeyword) {
      condition = {
        [Op.or]: [
          { tennv: { [Op.like]: `%${trimmedKeyword}%` } },
          { taikhoan: { [Op.like]: `%${trimmedKeyword}%` } },
          { email: { [Op.like]: `%${trimmedKeyword}%` } },
        ],
      };
=======
const NhanVien = require('../models/NhanVienModel');
const sequelize = require('../config/db'); 

exports.getAllNhanVien = async (req, res) => {
  try {
    const { keyword } = req.query; 
    let condition = {};
    if (keyword) {
      condition = { tennv: { [require('sequelize').Op.like]: `%${keyword}%` } };
>>>>>>> Stashed changes
    }
    const data = await NhanVien.findAll({ where: condition });
    res.json(data);
  } catch (error) {
<<<<<<< Updated upstream
    res.status(500).json({ message: "Lỗi server khi lấy danh sách", error: error.message });
  }
};

// 2. THÊM MỚI NHÂN VIÊN
=======
    res.status(500).json({ message: "Lỗi server", error });
  }
};

>>>>>>> Stashed changes
exports.createNhanVien = async (req, res) => {
  try {
    const { taikhoan, matkhau, tennv, sdt, diachi, ngaysinh, email, gioitinh, quyen, trangthai } = req.body;
    
<<<<<<< Updated upstream
    // Kiểm tra các trường bắt buộc
    if (!taikhoan || !matkhau || !tennv || !sdt || !diachi || !ngaysinh || !email || 
        gioitinh === undefined || quyen === undefined || trangthai === undefined) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin nhân viên!" });
    }

    const birthDateError = validateBirthDate(ngaysinh);
    if (birthDateError) {
      return res.status(400).json({ message: birthDateError });
    }

    const exist = await NhanVien.findOne({ where: { taikhoan } });
    if (exist) return res.status(400).json({ message: "Tài khoản đã tồn tại" });
=======
    // Kiểm tra tất cả các trường không được rỗng (ngoại trừ doanhthu)
    // Dùng !== undefined cho các trường kiểu số/boolean vì giá trị 0 dễ bị hiểu nhầm là rỗng
    if (!taikhoan || !matkhau || !tennv || !sdt || !diachi || !ngaysinh || !email || 
        gioitinh === undefined || quyen === undefined || trangthai === undefined) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin nhân viên (chỉ doanh thu được để trống)!" });
    }

    const exist = await NhanVien.findOne({ where: { taikhoan } });
    if (exist) {
      return res.status(400).json({ message: "Tài khoản đã tồn tại" });
    }
>>>>>>> Stashed changes

    const newNV = await NhanVien.create(req.body);
    res.status(201).json({ message: "Thêm thành công", data: newNV });
  } catch (error) {
<<<<<<< Updated upstream
    res.status(500).json({ message: "Lỗi thêm nhân viên", error: error.message });
  }
};

// 3. CẬP NHẬT NHÂN VIÊN (Có xử lý mật khẩu cũ/mới)
=======
    res.status(500).json({ message: "Lỗi thêm nhân viên", error });
  }
};

>>>>>>> Stashed changes
exports.updateNhanVien = async (req, res) => {
  try {
    const { id } = req.params;
    const { taikhoan, matkhau, tennv, sdt, diachi, ngaysinh, email, gioitinh, quyen, trangthai } = req.body;

<<<<<<< Updated upstream
    if (!taikhoan || !tennv || !sdt || !diachi || !ngaysinh || !email || 
        gioitinh === undefined || quyen === undefined || trangthai === undefined) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin!" });
    }

    const birthDateError = validateBirthDate(ngaysinh);
    if (birthDateError) {
      return res.status(400).json({ message: birthDateError });
    }

    const exist = await NhanVien.findOne({ where: { taikhoan } });
    if (exist && exist.nvid != id) {
      return res.status(400).json({ message: "Tài khoản bị trùng lặp!" });
    }

    const updateData = { ...req.body }; 
    // Nếu không nhập mật khẩu mới thì giữ nguyên mật khẩu cũ
=======
    // 1. Kiểm tra các trường bắt buộc (Không kiểm tra matkhau ở đây)
    if (!taikhoan || !tennv || !sdt || !diachi || !ngaysinh || !email || 
        gioitinh === undefined || quyen === undefined || trangthai === undefined) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin nhân viên!" });
    }

    // 2. Kiểm tra trùng lặp tài khoản
    const exist = await NhanVien.findOne({ where: { taikhoan } });
    if (exist && exist.nvid != id) {
      return res.status(400).json({ message: "Tài khoản này đã tồn tại (bị trùng lặp)!" });
    }

    // 3. XỬ LÝ LOGIC MẬT KHẨU
    // Tạo một bản sao của req.body để tránh can thiệp trực tiếp
    const updateData = { ...req.body }; 
    
    // Nếu mật khẩu bị bỏ trống (chuỗi rỗng), ta xóa luôn key này khỏi dữ liệu cập nhật
    // Khi đó Sequelize sẽ bỏ qua cột matkhau, giữ nguyên mật khẩu cũ trong DB.
>>>>>>> Stashed changes
    if (!matkhau || matkhau.trim() === "") {
      delete updateData.matkhau;
    }

<<<<<<< Updated upstream
    await NhanVien.update(updateData, { where: { nvid: id } });
    res.json({ message: "Cập nhật thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi cập nhật", error: error.message });
  }
};

// 4. XÓA NHÂN VIÊN (Kiểm tra ràng buộc cực kỳ chặt chẽ)
=======
    // 4. Cập nhật vào DB
    await NhanVien.update(updateData, { where: { nvid: id } });
    res.json({ message: "Cập nhật thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi cập nhật", error });
  }
};

// Xóa Nhân Viên (Sửa lại theo chuẩn sơ đồ tuần tự)
>>>>>>> Stashed changes
exports.deleteNhanVien = async (req, res) => {
  try {
    const { id } = req.params;

<<<<<<< Updated upstream
    // 1. Kiểm tra Bất Động Sản phụ trách
=======
    // 1. Kiểm tra Bất Động Sản (Nhân viên có đang phụ trách BĐS nào không?)
>>>>>>> Stashed changes
    const checkBDS = await sequelize.query(
      `SELECT COUNT(b.bdsid) as count 
       FROM batdongsan b 
       JOIN khachhang kh ON b.khid = kh.khid 
       WHERE kh.nvid = :id`,
<<<<<<< Updated upstream
      { replacements: { id }, type: Sequelize.QueryTypes.SELECT }
    );
    if (checkBDS[0].count > 0) {
      return res.status(400).json({ message: "Không thể xóa! Nhân viên này đang phụ trách khách hàng có Bất động sản." });
=======
      { replacements: { id }, type: sequelize.QueryTypes.SELECT }
    );
    if (checkBDS[0].count > 0) {
      return res.status(400).json({ message: "Không thể xóa! Nhân viên này đang phụ trách Bất động sản của khách hàng." });
>>>>>>> Stashed changes
    }

    // 2. Kiểm tra Hợp Đồng Ký Gửi
    const checkKyGui = await sequelize.query(
      `SELECT COUNT(kg.kgid) as count 
       FROM hopdongkygui kg 
       JOIN khachhang kh ON kg.khid = kh.khid 
       WHERE kh.nvid = :id`,
<<<<<<< Updated upstream
      { replacements: { id }, type: Sequelize.QueryTypes.SELECT }
    );
    if (checkKyGui[0].count > 0) {
      return res.status(400).json({ message: "Không thể xóa! Nhân viên đang phụ trách khách hàng có HĐ ký gửi." });
=======
      { replacements: { id }, type: sequelize.QueryTypes.SELECT }
    );
    if (checkKyGui[0].count > 0) {
      return res.status(400).json({ message: "Không thể xóa! Nhân viên đang phụ trách khách hàng có Hợp đồng ký gửi." });
>>>>>>> Stashed changes
    }

    // 3. Kiểm tra Hợp Đồng Chuyển Nhượng
    const checkChuyenNhuong = await sequelize.query(
      `SELECT COUNT(cn.cnid) as count 
       FROM hopdongchuyennhuong cn 
       JOIN khachhang kh ON cn.khid = kh.khid 
       WHERE kh.nvid = :id`,
<<<<<<< Updated upstream
      { replacements: { id }, type: Sequelize.QueryTypes.SELECT }
    );
    if (checkChuyenNhuong[0].count > 0) {
      return res.status(400).json({ message: "Không thể xóa! Nhân viên đang phụ trách khách hàng có HĐ chuyển nhượng." });
    }

    // Nếu không vướng víu gì mới được xóa thật
    const deletedRows = await NhanVien.destroy({ where: { nvid: id } });
    if (deletedRows === 0) return res.status(404).json({ message: "Không tìm thấy nhân viên!" });
    
    res.json({ message: "Xóa nhân viên thành công!" });
  } catch (error) {
    console.error("Lỗi SQL khi xóa:", error);
    res.status(500).json({ message: "Lỗi hệ thống khi xóa", error: error.message });
=======
      { replacements: { id }, type: sequelize.QueryTypes.SELECT }
    );
    if (checkChuyenNhuong[0].count > 0) {
      return res.status(400).json({ message: "Không thể xóa! Nhân viên đang phụ trách khách hàng có Hợp đồng chuyển nhượng." });
    }

    // 5. Nếu vượt qua TẤT CẢ các vòng kiểm tra trên -> Tiến hành Xóa mềm (Đổi trạng thái)
    const [updatedRows] = await NhanVien.update({ trangthai: false }, { where: { nvid: id } });
    
    // Đề phòng trường hợp Frontend gửi ID ảo không có trong Database
    if (updatedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy nhân viên này trong CSDL để xóa!" });
    }
    
    res.json({ message: "Xóa nhân viên thành công (Đã chuyển trạng thái Nghỉ việc)!" });
  } catch (error) {
    console.error("Lỗi SQL khi xóa:", error);
    res.status(500).json({ message: "Lỗi hệ thống khi xóa", error });
>>>>>>> Stashed changes
  }
};