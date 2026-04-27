const KhachHang = require('../models/KhachHang');
const BatDongSan = require('../models/BatDongSan'); 
const HopDongDatCoc = require('../models/HopDongDatCoc');
const { Op, Sequelize } = require('sequelize');
const dayjs = require('dayjs');

// --- 1. HÀM VALIDATE (Chuẩn pháp lý BĐS) ---
const validateCustomer = (data) => {
    const { hoten, sdt, cmnd, email, ngaysinh } = data;
    
    if (!hoten || !sdt || !cmnd || !ngaysinh) return "Họ tên, SĐT, CMND và Ngày sinh là bắt buộc.";
    
    // Check SĐT (9-11 số)
    if (!/^\d{9,11}$/.test(String(sdt))) return "Số điện thoại phải từ 9-11 chữ số.";
    
    // Check Email (Chặt chẽ)
    if (email && email.trim() !== "") {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) return "Định dạng Email không hợp lệ.";
    }
    
    // Check CMND/CCCD (9 hoặc 12 số theo luật VN)
    if (!/^\d{9}$|^\d{12}$/.test(cmnd)) return "CMND phải là dãy số 9 hoặc 12 ký tự.";

    // Logic Độ tuổi
    const birthDate = dayjs(ngaysinh);
    const today = dayjs();
    const age = today.diff(birthDate, 'year');

    if (!birthDate.isValid()) return "Ngày sinh không hợp lệ.";
    if (birthDate.isAfter(today)) return "Ngày sinh không được ở tương lai.";
    if (age < 15) return "Khách hàng phải từ 15 tuổi trở lên.";
    if (age > 120) return "Ngày sinh không thực tế (>120 tuổi).";

    return null;
};

// --- 2. LẤY DANH SÁCH & TÌM KIẾM ---
exports.getAllKhachHang = async (req, res) => {
    try {
        const { keyword, trangthai, gioitinh } = req.query;
        let where = {};

        if (keyword?.trim()) {
            const s = `%${keyword.trim()}%`;
            where[Op.or] = [
                { hoten: { [Op.like]: s } },
                { cmnd: { [Op.like]: s } },
                { sdt: { [Op.like]: s } },
                { email: { [Op.like]: s } },
                // Tìm kiếm theo cả mã ID (Cần cast sang string)
                Sequelize.where(Sequelize.cast(Sequelize.col('khid'), 'CHAR'), { [Op.like]: s })
            ];
        }

        if (trangthai !== undefined && trangthai !== "") where.trangthai = trangthai;
        if (gioitinh !== undefined && gioitinh !== "") where.gioitinh = gioitinh;

        const data = await KhachHang.findAll({ where, order: [['khid', 'ASC']] });
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi lấy danh sách', error: err.message });
    }
};

// --- 3. THÊM MỚI (Có cảnh báo người giám hộ) ---
exports.createKhachHang = async (req, res) => {
    try {
        const errorMsg = validateCustomer(req.body);
        if (errorMsg) return res.status(400).json({ message: errorMsg });

        const existing = await KhachHang.findOne({ where: { cmnd: req.body.cmnd } });
        if (existing) return res.status(400).json({ message: 'Số CMND đã tồn tại!' });

        const age = dayjs().diff(dayjs(req.body.ngaysinh), 'year');
        const newKH = await KhachHang.create({ ...req.body, trangthai: 1 });

        let responseMsg = "Thêm khách hàng thành công!";
        if (age >= 15 && age < 18) {
            responseMsg = "Thành công! Lưu ý: Khách hàng dưới 18 tuổi cần văn bản đồng ý của người giám hộ khi giao dịch.";
        }

        res.status(201).json({ message: responseMsg, data: newKH });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi thêm mới', error: err.message });
    }
};

// --- 4. CẬP NHẬT ---
exports.updateKhachHang = async (req, res) => {
    try {
        const { id } = req.params;
        const errorMsg = validateCustomer(req.body);
        if (errorMsg) return res.status(400).json({ message: errorMsg });

        const duplicate = await KhachHang.findOne({ 
            where: { cmnd: req.body.cmnd, khid: { [Op.ne]: id } } 
        });
        if (duplicate) return res.status(400).json({ message: 'CMND đã thuộc về người khác!' });

        await KhachHang.update(req.body, { where: { khid: id } });
        res.json({ message: 'Cập nhật thành công' });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi cập nhật', error: err.message });
    }
};

// --- 5. XÓA MỀM (Chặn xóa theo ràng buộc nghiệp vụ) ---
exports.deleteKhachHang = async (req, res) => {
    try {
        const { id } = req.params;

        // Ràng buộc 1: Đang đứng tên BĐS
        const holdsBDS = await BatDongSan.findOne({ where: { khid: id } });
        if (holdsBDS) return res.status(400).json({ message: 'Khách hàng đang đứng tên BĐS, không thể ngưng hoạt động!' });

        // Ràng buộc 2: Đang có Hợp đồng đặt cọc có hiệu lực
        const holdsContract = await HopDongDatCoc.findOne({ where: { khid: id, tinhtrang: 1 } });
        if (holdsContract) return res.status(400).json({ message: 'Khách hàng đang có hợp đồng đặt cọc còn hiệu lực!' });

        await KhachHang.update({ trangthai: 0 }, { where: { khid: id } });
        res.json({ message: 'Đã chuyển trạng thái sang Ngưng hoạt động' });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi khi xóa', error: err.message });
    }
};

// --- 6. CHI TIẾT ---
exports.getKhachHangById = async (req, res) => {
    try {
        const data = await KhachHang.findByPk(req.params.id);
        data ? res.json(data) : res.status(404).json({ message: 'Không tìm thấy' });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};
