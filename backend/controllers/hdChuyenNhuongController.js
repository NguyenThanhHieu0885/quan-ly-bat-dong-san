// File: backend/controllers/hdChuyenNhuongController.js
const HopDongChuyenNhuong = require('../models/HopDongChuyenNhuong');
const { sequelize, Sequelize } = require('../config/db');

// 1. Mở màn hình & Tra cứu HĐCN
exports.getAll = async (req, res) => {
  try {
    const { keyword } = req.query;
    // Dùng query thuần để JOIN lấy thông tin Khách Hàng và BĐS cho dễ hiển thị lên Table
    let sql = `
      SELECT cn.*, kh.hoten as tenkhachhang, bds.masoqsdd, bds.tenduong 
      FROM hopdongchuyennhuong cn
      LEFT JOIN khachhang kh ON cn.khid = kh.khid
      LEFT JOIN batdongsan bds ON cn.bdsid = bds.bdsid
      WHERE 1=1
    `;
    if (keyword) {
      sql += ` AND kh.hoten LIKE '%${keyword}%'`;
    }
    const data = await sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy danh sách hợp đồng", error });
  }
};

// 1.1 Lấy danh sách HĐ Đặt cọc hợp lệ để tạo HĐ chuyển nhượng
exports.getHDDatCocHopLe = async (req, res) => {
  try {
    const sql = `
      SELECT dc.dcid, dc.khid, dc.bdsid, dc.giatri
      FROM hopdongdatcoc dc
      LEFT JOIN hopdongchuyennhuong cn ON cn.dcid = dc.dcid
      WHERE cn.dcid IS NULL
      ORDER BY dc.dcid DESC
    `;

    const data = await sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy danh sách hợp đồng đặt cọc", error });
  }
};

// 2. Thêm HĐCN (Tạo từ HĐ Đặt Cọc)
exports.create = async (req, res) => {
  try {
    const { khid, bdsid, dcid, giatri, ngaylap } = req.body;

    if (!khid || !bdsid || !dcid || !giatri) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin hợp đồng!" });
    }

    // Kiểm tra trùng lặp HĐ Đặt cọc (dcid là UNIQUE)
    const exist = await HopDongChuyenNhuong.findOne({ where: { dcid } });
    if (exist) {
      return res.status(400).json({ message: "Hợp đồng đặt cọc này đã được chuyển nhượng rồi!" });
    }

    // Lưu hợp đồng
    const newHD = await HopDongChuyenNhuong.create(req.body);

    // Cập nhật doanh thu cho nhân viên phụ trách khách hàng này (Ràng buộc số 10 trong PTTK)
    await sequelize.query(
      `UPDATE nhanvien nv 
       JOIN khachhang kh ON nv.nvid = kh.nvid 
       SET nv.doanhthu = nv.doanhthu + :giatri 
       WHERE kh.khid = :khid`,
      { replacements: { giatri, khid }, type: Sequelize.QueryTypes.UPDATE }
    );

    res.status(201).json({ message: "Thêm Hợp đồng Chuyển nhượng thành công!", data: newHD });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi thêm hợp đồng", error });
  }
};

// 3. Xóa HĐCN
exports.deleteHD = async (req, res) => {
  try {
    const { id } = req.params;

    // Lấy dcid của HĐCN này để kiểm tra
    const hdcn = await HopDongChuyenNhuong.findByPk(id);
    if (!hdcn) return res.status(404).json({ message: "Không tìm thấy hợp đồng" });

    // Kiểm tra trạng thái thanh toán của HĐ Đặt cọc liên kết (Giả sử tinhtrang = 1 là chưa thanh toán xong)
    const checkDatCoc = await sequelize.query(
      `SELECT tinhtrang FROM hopdongdatcoc WHERE dcid = :dcid`,
      { replacements: { dcid: hdcn.dcid }, type: Sequelize.QueryTypes.SELECT }
    );

    if (checkDatCoc.length > 0 && checkDatCoc[0].tinhtrang === 1) {
      return res.status(400).json({ message: "Hợp đồng đặt cọc chưa thanh toán xong, từ chối xóa!" });
    }

    await HopDongChuyenNhuong.destroy({ where: { cnid: id } });
    res.json({ message: "Xóa Hợp đồng chuyển nhượng thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi xóa hợp đồng", error });
  }
};

// 4. Xem thông tin BĐS (Phục vụ Modal Xem BĐS)
exports.getBDSInfo = async (req, res) => {
  try {
    const { bdsid } = req.params;
    const bds = await sequelize.query(
      `SELECT * FROM batdongsan WHERE bdsid = :bdsid`,
      { replacements: { bdsid }, type: Sequelize.QueryTypes.SELECT }
    );
    if (bds.length === 0) return res.status(404).json({ message: "Không tìm thấy BĐS" });
    res.json(bds[0]);
  } catch (error) {
    res.status(500).json({ message: "Lỗi hệ thống", error });
  }
};