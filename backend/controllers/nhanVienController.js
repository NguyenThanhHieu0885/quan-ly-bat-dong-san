// File: backend/controllers/nhanVienController.js
const NhanVien = require('../models/NhanVien');
// Lưu ý: Nếu có check xóa thực tế, cần import thêm model KhachHang, HopDong...

// 1. Lấy danh sách & Tra cứu nhân viên (Gộp chung để tối ưu)
exports.getAllNhanVien = async (req, res) => {
  try {
    const { keyword } = req.query; // Nhận từ khóa tra cứu
    let condition = {};
    if (keyword) {
      // Logic tra cứu rẽ nhánh 1, 2, 3 trong sơ đồ [cite: 267, 269, 272]
      condition = { tennv: { [require('sequelize').Op.like]: `%${keyword}%` } };
    }
    const data = await NhanVien.findAll({ where: condition });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// 2. Thêm Nhân Viên
exports.createNhanVien = async (req, res) => {
  try {
    const { taikhoan, matkhau, tennv } = req.body;
    
    // Rẽ nhánh 1: Kiểm tra rỗng [cite: 92, 93]
    if (!taikhoan || !matkhau || !tennv) {
      return res.status(400).json({ message: "Thông tin không được rỗng" });
    }

    // Rẽ nhánh 2: Kiểm tra trùng [cite: 94, 95]
    const exist = await NhanVien.findOne({ where: { taikhoan } });
    if (exist) {
      return res.status(400).json({ message: "Thông tin Nhân Viên đã tồn tại" });
    }

    // Hợp lệ: Cập nhật CSDL [cite: 96, 97]
    const newNV = await NhanVien.create(req.body);
    res.status(201).json({ message: "Thêm thành công", data: newNV });
  } catch (error) {
    res.status(500).json({ message: "Lỗi thêm nhân viên", error });
  }
};

// 3. Cập nhật Nhân Viên
exports.updateNhanVien = async (req, res) => {
  try {
    const { id } = req.params;
    const { taikhoan, tennv } = req.body;

    // Rẽ nhánh 1: Kiểm tra rỗng [cite: 153, 154]
    if (!taikhoan || !tennv) {
      return res.status(400).json({ message: "Thông tin không được rỗng" });
    }

    await NhanVien.update(req.body, { where: { nvid: id } });
    res.json({ message: "Cập nhật thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi cập nhật", error });
  }
};

// 4. Xóa Nhân Viên
exports.deleteNhanVien = async (req, res) => {
  try {
    const { id } = req.params;
    
    // THEO SƠ ĐỒ TUẦN TỰ XÓA:
    // Rẽ nhánh 1 & 2: Kiểm tra BĐS ký gửi và HĐ Chuyển nhượng 
    // (Thực tế bạn sẽ gọi câu lệnh query DB để check số lượng hợp đồng thông qua Khách hàng do NV này quản lý)
    const dangCoBDSKyGui = false; // Thay bằng lệnh đếm thực tế `HopDongKyGui.count(...)`
    const dangCoHDChuyenNhuong = false; // Thay bằng lệnh đếm thực tế
    
    if (dangCoBDSKyGui) {
      return res.status(400).json({ message: "Nhân viên đang quản lý bất động sản ký gửi" }); // [cite: 211]
    }
    if (dangCoHDChuyenNhuong) {
      return res.status(400).json({ message: "Nhân viên đang có hợp đồng chuyển nhượng" }); // [cite: 213]
    }

    // Hợp lệ: Xóa hoặc Đổi trạng thái (Soft Delete) [cite: 214, 215]
    await NhanVien.update({ trangthai: 0 }, { where: { nvid: id } }); 
    // Dùng đổi trạng thái = 0 thay vì xóa vật lý để giữ vẹn toàn dữ liệu lịch sử.
    
    res.json({ message: "Xóa nhân viên thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi xóa", error });
  }
};