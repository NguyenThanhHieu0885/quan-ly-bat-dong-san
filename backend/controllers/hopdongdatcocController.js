const dayjs = require('dayjs');
const { Op } = require('sequelize');
const { sequelize } = require('../config/db');
const NhanVien = require('../models/NhanVien');
const KhachHang = require('../models/KhachHang');
const BatDongSan = require('../models/BatDongSan');
const HopDongDatCoc = require('../models/HopDongDatCocModel');
const HopDongChuyenNhuong = require('../models/HopDongChuyenNhuong');
// const NhanVien = require('../models/NhanVien'); // Có thể bỏ luôn import này nếu không dùng chỗ khác

exports.createHopDong = async (req, res) => {
    try {
        const { bdsid, khid, ngaylaphd, ngayhethan, giatri } = req.body;

        // 1. Validation cơ bản
        if (!bdsid) return res.status(400).json({ message: 'Vui lòng chọn Bất động sản.' });
        if (!khid) return res.status(400).json({ message: 'Vui lòng chọn Khách hàng.' });

        // --- XỬ LÝ DATABASE (TRANSACTION) ---
        const t = await sequelize.transaction();
        try {
            // Lấy thông tin BĐS bao gồm đơn giá để kiểm tra 10%
            const bds = await BatDongSan.findByPk(bdsid);
            
            if (!bds || bds.tinhtrang !== 0) {
                await t.rollback();
                return res.status(400).json({ message: 'Bất động sản này không khả dụng.' });
            }

            // 2. LOGIC NGHIỆP VỤ: Kiểm tra tiền cọc >= 10% giá trị BĐS
            const minDeposit = bds.dongia * 0.1; // Tính 1/10 giá trị
            if (!giatri || giatri < minDeposit) {
                await t.rollback();
                return res.status(400).json({ 
                    message: `Số tiền đặt cọc không đủ. Tối thiểu 10% giá trị BĐS (${minDeposit.toLocaleString()} đ).` 
                });
            }

            const today = dayjs().format('YYYY-MM-DD'); // Lấy đúng ngày hiện tại theo giờ VN

            if (!ngaylaphd || dayjs(ngaylaphd).format('YYYY-MM-DD') !== today) {
                await t.rollback();
                return res.status(400).json({ 
                    message: `Ngày lập phiếu phải là ngày hiện tại (${today}).` 
                });
            }

            // Tạo hợp đồng
            const newContract = await HopDongDatCoc.create({
                khid,
                bdsid,
                ngaylaphd,
                ngayhethan,
                giatri,
                tinhtrang: 1, 
                trangthai: 1  
            }, { transaction: t });

            await BatDongSan.update({ tinhtrang: 1 }, { where: { bdsid }, transaction: t });

            await t.commit();
            res.status(201).json({ message: 'Lập phiếu thành công!', data: newContract });
        } catch (dbErr) {
            await t.rollback();
            throw dbErr;
        }
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

exports.getAllHopDong = async (req, res) => {
    try {
        const { keyword } = req.query;
        let whereClause = {};

        if (keyword) {
            whereClause = {
                [Op.or]: [
                    // Tìm theo mã số (ép kiểu chuỗi để dùng LIKE)
                    { dcid: { [Op.like]: `%${keyword}%` } }, 
                    // Tìm theo tên khách hàng (dùng cú pháp '$Model.attribute$')
                    { '$KhachHang.hoten$': { [Op.like]: `%${keyword}%` } } 
                ]
            };
        }

        const list = await HopDongDatCoc.findAll({
            where: whereClause, // QUAN TRỌNG: Phải có dòng này thì lọc mới chạy
            include: [
                { 
                    model: BatDongSan, 
                    attributes: ['sonha', 'tenduong'] 
                },
                { 
                    model: KhachHang, 
                    attributes: ['hoten','sdt'],
                    include: [
                        { 
                            model: NhanVien, 
                            attributes: ['tennv'] 
                        }
                    ]
                }
            ],
            order: [['dcid', 'ASC']]
        });

        res.json(list);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.cancelHopDong = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { dcid } = req.params;
        
        // 1. Tìm thông tin hợp đồng đặt cọc
        const hd = await HopDongDatCoc.findByPk(dcid);
        if (!hd) return res.status(404).json({ message: 'Không tìm thấy hợp đồng.' });

        // 2. KIỂM TRA RÀNG BUỘC (Theo Activity Diagram AD_HDDC_02)
        // Kiểm tra xem mã dcid này có đang tồn tại trong bảng Chuyển nhượng không 
        const checkLienKet = await HopDongChuyenNhuong.findOne({ 
            where: { dcid: dcid } 
        });

        if (checkLienKet) {
            await t.rollback();
            // Trả về lỗi 400 và thông báo đúng như sơ đồ yêu cầu 
            return res.status(400).json({ 
                message: 'Hợp đồng đang liên kết với Hợp đồng Chuyển nhượng. Không thể hủy!' 
            });
        }

        // 3. Nếu không vướng ràng buộc, tiến hành hủy (Xóa mềm) [cite: 25]
        await HopDongDatCoc.update(
            { tinhtrang: 0, trangthai: 0 }, 
            { where: { dcid }, transaction: t }
        );

        // Giải phóng Bất động sản về trạng thái trống (tinhtrang: 0)
        await BatDongSan.update(
            { tinhtrang: 0 }, 
            { where: { bdsid: hd.bdsid }, transaction: t }
        );

        await t.commit();
        res.json({ message: 'Hủy thành công và giải phóng BĐS.' });
    } catch (error) {
        await t.rollback();
        res.status(500).json({ error: error.message });
    }
};