const KyGui = require('../models/HopDongKyGuiModel');
const BatDongSan = require('../models/BatDongSan');
const KhachHang = require('../models/KhachHang');
const NhanVien = require('../models/NhanVien');
const HopDongDatCoc = require('../models/HopDongDatCocModel');
const { Op } = require('sequelize');
const { sequelize } = require('../config/db');

const getKyGuis = async (req, res) => {
  try {
    const kyGuis = await KyGui.findAll({
      where: {
        trangthai: {
          [Op.ne]: 0 // 0 là trạng thái đã xóa mềm, không lấy lên bảng danh sách nữa
        }
      },
      include: [
        { model: BatDongSan },
        { 
          model: KhachHang, 
          attributes: ['khid', 'hoten', 'nvid'],
          include: [{ model: NhanVien, attributes: ['nvid', 'tennv'] }] 
        }
      ]
    });
    res.status(200).json(kyGuis);
  } catch (error) {
    console.error('Error in getKyGuis:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy dữ liệu ký gửi.' });
  }
};
const layDanhSachHieuLuc = async (req, res) => {
    try {
        // Lấy tất cả kgid đã được tạo HĐ đặt cọc ĐANG HIỆU LỰC
        const datCocs = await HopDongDatCoc.findAll({ 
            attributes: ['kgid'], 
            where: { 
                kgid: { [Op.not]: null },
                tinhtrang: 1 // Chỉ loại bỏ những Ký gửi đang có Đặt cọc hiệu lực
            } 
        });
        const excludedIds = datCocs.map(dc => dc.kgid);

        const danhSach = await KyGui.findAll({
            where: { 
                trangthai: 1, // Chỉ lấy cái còn hiệu lực
                ...(excludedIds.length > 0 && {
                    kgid: { [Op.notIn]: excludedIds } // Loại bỏ các kgid đã bị sử dụng
                })
            },
            include: [
                { model: BatDongSan, where: { tinhtrang: 0 } }, // Đảm bảo BĐS cũng phải đang trống (Chưa bị cọc/bán)
                { 
                  model: KhachHang,
                  include: [{ model: NhanVien, attributes: ['nvid', 'tennv'] }]
                }
            ]
        });
        res.set('Cache-Control', 'no-store'); // Ngăn trình duyệt cache dữ liệu API
        res.status(200).json(danhSach);
    } catch (error) {
        console.error('Lỗi layDanhSachHieuLuc:', error);
        res.status(500).json({ message: "Lỗi khi lấy danh sách hiệu lực" });
    }
};
const getKyGuiById = async (req, res) => {
  try {
    const { id } = req.params;
    const kyGui = await KyGui.findByPk(id, {
      include: [
        { model: BatDongSan }, 
        { 
          model: KhachHang, 
          attributes: ['khid', 'hoten', 'nvid'],
          include: [{ model: NhanVien, attributes: ['nvid', 'tennv'] }]
        }
      ]
    });
    if (kyGui) {
      res.status(200).json(kyGui);
    } else {
      res.status(404).json({ message: 'Không tìm thấy hợp đồng ký gửi.' });
    }
  } catch (error) {
    console.error('Error in getKyGuiById:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy dữ liệu hợp đồng.' });
  }
};

const createKyGui = async (req, res) => {
  try {
    const { khid, bdsid, giatri, chiphidv, ngaybatdau } = req.body;

    if (!khid || !bdsid || giatri === undefined || chiphidv === undefined || !ngaybatdau) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ các trường bắt buộc.' });
    }

    // --- RÀNG BUỘC: 1 BĐS chỉ có 1 HĐ ký gửi đang hiệu lực ---
    const checkTonTai = await KyGui.findOne({
      where: {
        bdsid: bdsid,
        trangthai: 1 // 1 = Đang hiệu lực
      }
    });
    if (checkTonTai) {
      return res.status(400).json({ message: 'Bất động sản này đã có hợp đồng ký gửi đang hiệu lực. Không thể tạo thêm.' });
    }

    const newKyGui = await KyGui.create({
      ...req.body,
      trangthai: 1 // Mặc định là Hiệu lực khi tạo mới (bỏ qua trạng thái "Mới tạo")
    });

    // Tự động cập nhật Khách hàng lên VIP (loaikh: 1) vì đã có hợp đồng ký gửi
    await KhachHang.update({ loaikh: 1 }, { where: { khid } });

    res.status(201).json({ message: 'Tạo hợp đồng ký gửi thành công!', data: newKyGui });
  } catch (error) {
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      if (error.sqlMessage.includes('khachhang')) {
        return res.status(400).json({ message: 'Mã Khách Hàng không tồn tại trong hệ thống. Vui lòng kiểm tra lại!' });
      } else if (error.sqlMessage.includes('bdsid')) {
        return res.status(400).json({ message: 'Mã Bất Động Sản không tồn tại trong hệ thống. Vui lòng kiểm tra lại!' });
      }
      return res.status(400).json({ message: 'Dữ liệu tham chiếu không tồn tại (Mã KH hoặc Mã BĐS bị sai).' });
    }
    console.error('Error in createKyGui:', error);
    res.status(500).json({ message: 'Lỗi server khi tạo hợp đồng ký gửi.' });
  }
};

const updateKyGui = async (req, res) => {
  try {
    const { id } = req.params;
    const { khid, bdsid, giatri, chiphidv, ngaybatdau } = req.body;

    const existingKyGui = await KyGui.findByPk(id);
    if (!existingKyGui) {
      return res.status(404).json({ message: 'Không tìm thấy hợp đồng ký gửi để cập nhật.' });
    }

    if (!khid || !bdsid || giatri === undefined || chiphidv === undefined || !ngaybatdau) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ các trường bắt buộc.' });
    }

    // --- RÀNG BUỘC: 1 BĐS chỉ có 1 HĐ ký gửi đang hiệu lực ---
    // Chỉ kiểm tra nếu hợp đồng đang được cập nhật sang trạng thái "Hiệu lực"
    if (Number(req.body.trangthai) === 1) {
      const checkTonTai = await KyGui.findOne({
        where: {
          bdsid: bdsid,
          trangthai: 1,
          kgid: { [Op.ne]: id } // Loại trừ chính hợp đồng đang sửa
        }
      });
      if (checkTonTai) {
        return res.status(400).json({ message: 'Bất động sản này đã có một hợp đồng ký gửi khác đang hiệu lực. Không thể cập nhật.' });
      }
    }

    await KyGui.update(req.body, { where: { kgid: id } });
    res.status(200).json({ message: 'Cập nhật hợp đồng ký gửi thành công.' });

  } catch (error) {
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      if (error.sqlMessage.includes('khachhang')) {
        return res.status(400).json({ message: 'Mã Khách Hàng không tồn tại trong hệ thống. Vui lòng kiểm tra lại!' });
      } else if (error.sqlMessage.includes('bdsid')) {
        return res.status(400).json({ message: 'Mã Bất Động Sản không tồn tại trong hệ thống. Vui lòng kiểm tra lại!' });
      }
      return res.status(400).json({ message: 'Dữ liệu tham chiếu không tồn tại (Mã KH hoặc Mã BĐS bị sai).' });
    }
    console.error('Error in updateKyGui:', error);
    res.status(500).json({ message: 'Lỗi server khi cập nhật hợp đồng ký gửi.' });
  }
};

const deleteKyGui = async (req, res) => {
  try {
    const { id } = req.params;

    // Bước 1: Lấy thông tin hợp đồng để kiểm tra.
    const kyGuiToDelete = await KyGui.findByPk(id);
    if (!kyGuiToDelete) {
      return res.status(404).json({ message: 'Không tìm thấy hợp đồng ký gửi để xóa.' });
    }

    // Bước 2: Validation - Kiểm tra hợp đồng có còn hiệu lực không.
    if (String(kyGuiToDelete.trangthai) === '1') {
      return res.status(400).json({ message: 'Không thể xóa hợp đồng đang còn hiệu lực. Vui lòng cập nhật trạng thái sang "Chấm dứt HĐ" trước.' });
    }

    // Bước 3: Thay vì xóa cứng khỏi DB, ta tiến hành Xóa Mềm (Cập nhật trạng thái = 0)
    await KyGui.update({ trangthai: 0 }, { where: { kgid: id } });
    res.status(200).json({ message: 'Xóa hợp đồng ký gửi thành công (Đã chuyển vào thùng rác).' });
  } catch (error) {
    console.error('Error in deleteKyGui:', error);
    res.status(500).json({ message: 'Lỗi server khi xóa hợp đồng ký gửi.' });
  }
};

module.exports = {
  getKyGuis,
  layDanhSachHieuLuc,
  getKyGuiById,
  createKyGui,
  updateKyGui,
  deleteKyGui,
};