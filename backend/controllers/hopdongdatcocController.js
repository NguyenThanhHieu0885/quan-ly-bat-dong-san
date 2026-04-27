const dayjs = require('dayjs');
<<<<<<< Updated upstream
const { Op } = require('sequelize');
const { sequelize } = require('../config/db');
const KhachHang = require('../models/KhachHang');
const BatDongSan = require('../models/BatDongSan');
const HopDongDatCoc = require('../models/HopDongDatCoc');
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
=======
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const { Op } = require('sequelize');
const { sequelize } = require('../config/db');

// Models
const NhanVien = require('../models/NhanVienModel');
const KhachHang = require('../models/KhachHangModel');
const BatDongSan = require('../models/BatDongSanModel');
const HopDongDatCoc = require('../models/HopDongDatCocModel');
const HopDongChuyenNhuong = require('../models/HopDongChuyenNhuongModel');

// Cấu hình Dayjs cho múi giờ Việt Nam
dayjs.extend(utc);
dayjs.extend(timezone);
const VN_TZ = "Asia/Ho_Chi_Minh";

/**
 * 1. LẬP HỢP ĐỒNG ĐẶT CỌC
 */
exports.createHopDong = async (req, res) => {
    try {
        const { bdsid, khid, ngaylaphd, ngayhethan, giatri, kgid } = req.body;
        const nvid = req.body.nvid_auth; 

        // 1. Kiểm tra bắt buộc đầu vào TRƯỚC khi truy vấn CSDL
        if (!kgid) return res.status(400).json({ message: 'Vui lòng chọn Hợp đồng ký gửi liên kết.' });
        if (!bdsid) return res.status(400).json({ message: 'Vui lòng chọn Bất động sản.' });
        if (!khid) return res.status(400).json({ message: 'Vui lòng chọn Khách hàng.' });
        if (!nvid) return res.status(401).json({ message: 'Phiên đăng nhập không hợp lệ.' });

        // --- BỔ SUNG: CHẶN TRÙNG LẶP ---
        const checkTonTai = await HopDongDatCoc.findOne({ 
            where: { 
                kgid,
                tinhtrang: 1 // Tìm xem đã có HĐ đặt cọc ĐANG HIỆU LỰC nào cho KG này chưa
            }
        });
        if (checkTonTai) {
            return res.status(400).json({ message: 'Hợp đồng ký gửi này đang có một hợp đồng đặt cọc hiệu lực!' });
        }

        const t = await sequelize.transaction();
        try {
            // --- RÀNG BUỘC MỚI: 1 HĐ Ký gửi chỉ tạo 1 HĐ Đặt cọc ---
            const checkDatCocTonTai = await HopDongDatCoc.findOne({ 
                where: { kgid, tinhtrang: 1 }, transaction: t 
            });
            if (checkDatCocTonTai) {
                await t.rollback();
                return res.status(400).json({ message: 'Hợp đồng ký gửi này đang có hợp đồng đặt cọc hiệu lực. Vui lòng chọn hợp đồng khác!' });
            }

            // 2. Kiểm tra tồn tại BĐS (Giữ nguyên)
            const bds = await BatDongSan.findByPk(bdsid);
            if (!bds) {
                await t.rollback();
                return res.status(404).json({ message: 'Không tìm thấy thông tin Bất động sản này.' });
            }

            // --- PHẦN SỬA MỚI: Giải thích chi tiết lý do ---
            if (bds.tinhtrang !== 0) {
                await t.rollback();
                
                let lyDo = 'Bất động sản này hiện không khả dụng để đặt cọc.';
                
                if (bds.tinhtrang === 1) {
                    lyDo = 'Bất động sản này đã được đặt cọc hoặc đang trong giao dịch.';
                } else if (bds.tinhtrang === 2) {
                    lyDo = 'Bất động sản này đã bán/giao dịch thành công.';
                } else {
                    // Giải thích chi tiết về việc thiếu ký gửi như bạn muốn
                    lyDo = 'Bất động sản này chưa có hợp đồng ký gửi hợp lệ hoặc chưa được duyệt để đưa vào kinh doanh.';
                }

                return res.status(400).json({ message: lyDo });
            }
            // --- KẾT THÚC PHẦN SỬA MỚI ---

            // 4. Giữ nguyên kiểm tra tiền cọc tối thiểu 10%
            const minDeposit = bds.dongia * 0.1;
            if (!giatri || giatri < minDeposit) {
                await t.rollback();
                return res.status(400).json({ 
                    message: `Số tiền đặt cọc tối thiểu là 10% giá trị BĐS (${minDeposit.toLocaleString()} đ).` 
                });
            }

            // 5. Giữ nguyên kiểm tra ngày lập phiếu (Ngày hiện tại)
            const todayStr = dayjs().tz(VN_TZ).format('YYYY-MM-DD');
            const inputDateStr = dayjs(ngaylaphd).format('YYYY-MM-DD');

            if (!ngaylaphd || inputDateStr !== todayStr) {
                await t.rollback();
                return res.status(400).json({ 
                    message: `Ngày lập phiếu phải là ngày hiện tại (${dayjs().tz(VN_TZ).format('DD/MM/YYYY')}).` 
                });
            }

            // 6. Giữ nguyên phần tạo Hợp đồng mới (Giữ nguyên các field cũ)
            const newContract = await HopDongDatCoc.create({
                nvid,       
                khid,       
                bdsid,      
                kgid,     
                ngaylaphd,
                ngayhethan,
                giatri,     
                tinhtrang: 1, // Giữ nguyên giá trị cũ của bạn mình
                trangthai: 1  
            }, { transaction: t });

            // 7. Cập nhật trạng thái BĐS (Giữ nguyên)
            await BatDongSan.update(
                { tinhtrang: 1 }, 
                { where: { bdsid }, transaction: t }
            );

            await t.commit();
            res.status(201).json({ 
                message: 'Lập phiếu đặt cọc thành công!', 
                legalNote: 'Theo khoản 2 Điều 328 Bộ luật Dân sự 2015: Nếu khách hàng vi phạm, số tiền đặt cọc thuộc về bên nhận đặt cọc.',
                data: newContract 
            });

>>>>>>> Stashed changes
        } catch (dbErr) {
            await t.rollback();
            throw dbErr;
        }
    } catch (error) {
<<<<<<< Updated upstream
=======
        // Bắt lỗi Unique Constraint từ Database (Chốt chặn an toàn cuối cùng chống Race Condition)
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'Hợp đồng ký gửi này đang có hợp đồng đặt cọc hiệu lực (Phát hiện trùng lặp từ cơ sở dữ liệu)!' });
        }
>>>>>>> Stashed changes
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

<<<<<<< Updated upstream
=======


/**
 * 2. LẤY DANH SÁCH HỢP ĐỒNG
 */
>>>>>>> Stashed changes
exports.getAllHopDong = async (req, res) => {
    try {
        const { keyword } = req.query;
        let whereClause = {};

        if (keyword) {
            whereClause = {
                [Op.or]: [
<<<<<<< Updated upstream
                    // Tìm theo mã số (ép kiểu chuỗi để dùng LIKE)
                    { dcid: { [Op.like]: `%${keyword}%` } }, 
                    // Tìm theo tên khách hàng (dùng cú pháp '$Model.attribute$')
=======
                    { dcid: { [Op.like]: `%${keyword}%` } }, 
>>>>>>> Stashed changes
                    { '$KhachHang.hoten$': { [Op.like]: `%${keyword}%` } } 
                ]
            };
        }

        const list = await HopDongDatCoc.findAll({
<<<<<<< Updated upstream
            where: whereClause, // QUAN TRỌNG: Phải có dòng này thì lọc mới chạy
            include: [
                { 
                    model: BatDongSan, 
                    attributes: ['sonha', 'tenduong'] 
                },
                { 
                    model: KhachHang, 
                    attributes: ['hoten','sdt'] 
                }
=======
            where: whereClause,
            include: [
                { model: BatDongSan, attributes: ['sonha', 'tenduong'] },
                { model: KhachHang, attributes: ['hoten','sdt'] },
                { model: NhanVien, attributes: ['tennv'] }
>>>>>>> Stashed changes
            ],
            order: [['dcid', 'ASC']]
        });

        res.json(list);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

<<<<<<< Updated upstream
=======
/**
 * 3. HỦY HỢP ĐỒNG (KIỂM TRA RÀNG BUỘC THỜI GIAN & PHÁP LÝ)
 */
>>>>>>> Stashed changes
exports.cancelHopDong = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { dcid } = req.params;
        
<<<<<<< Updated upstream
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
=======
        const hd = await HopDongDatCoc.findByPk(dcid);
        if (!hd) {
            await t.rollback();
            return res.status(404).json({ message: 'Không tìm thấy hợp đồng.' });
        }

        // Ràng buộc 1: Kiểm tra liên kết Chuyển nhượng
        const checkLienKet = await HopDongChuyenNhuong.findOne({ where: { dcid } });
        if (checkLienKet) {
            await t.rollback();
>>>>>>> Stashed changes
            return res.status(400).json({ 
                message: 'Hợp đồng đang liên kết với Hợp đồng Chuyển nhượng. Không thể hủy!' 
            });
        }

<<<<<<< Updated upstream
        // 3. Nếu không vướng ràng buộc, tiến hành hủy (Xóa mềm) [cite: 25]
        await HopDongDatCoc.update(
            { tinhtrang: 0, trangthai: 0 }, 
            { where: { dcid }, transaction: t }
        );

        // Giải phóng Bất động sản về trạng thái trống (tinhtrang: 0)
=======
        // Ràng buộc 2: Kiểm tra thời gian (Phải trễ hơn ngày hết hạn ít nhất 1 ngày)
        const now = dayjs().tz(VN_TZ).startOf('day');
        const expirationDate = dayjs(hd.ngayhethan).tz(VN_TZ).startOf('day');

        if (!now.isAfter(expirationDate, 'day')) {
            await t.rollback();
            return res.status(400).json({ 
                message: `Hợp đồng vẫn còn trong thời hạn ký kết (Hạn đến: ${expirationDate.format('DD/MM/YYYY')}). Chỉ được hủy khi khách hàng quá hạn 01 ngày và vi phạm hợp đồng.` 
            });
        }

        // Thực hiện hủy: Cập nhật tinhtrang về 0 và giải phóng BĐS
        await HopDongDatCoc.update(
            { tinhtrang: 0 }, 
            { where: { dcid }, transaction: t }
        );

>>>>>>> Stashed changes
        await BatDongSan.update(
            { tinhtrang: 0 }, 
            { where: { bdsid: hd.bdsid }, transaction: t }
        );

        await t.commit();
<<<<<<< Updated upstream
        res.json({ message: 'Hủy thành công và giải phóng BĐS.' });
=======
        res.json({ message: 'Hủy thành công và giải phóng BĐS. Theo Điều 328 BLDS, số tiền cọc được xử lý cho bên nhận cọc do khách vi phạm thời hạn.' });

>>>>>>> Stashed changes
    } catch (error) {
        await t.rollback();
        res.status(500).json({ error: error.message });
    }
<<<<<<< Updated upstream
=======
};

/**
 * 4. TỰ ĐỘNG CẬP NHẬT TRẠNG THÁI THEO THỜI HẠN (Cron Job)
 * Chạy hàm này trong statusUpdater.js để đồng bộ
 */
exports.autoUpdateExpiredHDDC = async () => {
    try {
        const today = dayjs().tz(VN_TZ).format('YYYY-MM-DD');
        const [updatedRows] = await HopDongDatCoc.update(
            { tinhtrang: 2 }, // 2: Trạng thái Hết hạn
            {
                where: {
                    tinhtrang: 1, // Đang hiệu lực
                    ngayhethan: { [Op.lt]: today } // Ngày hết hạn < hôm nay
                }
            }
        );
        if (updatedRows > 0) {
            console.log(`[HD Đặt cọc] Đã tự động cập nhật ${updatedRows} hợp đồng sang Hết hạn.`);
        }
    } catch (error) {
        console.error('[HD Đặt cọc] Lỗi cập nhật trạng thái tự động:', error);
    }
>>>>>>> Stashed changes
};