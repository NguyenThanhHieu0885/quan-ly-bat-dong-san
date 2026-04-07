const dayjs = require('dayjs');
const { Op, Sequelize } = require('sequelize');
const KhachHang = require('../models/KhachHang');

// Import an toàn theo từng model để không ảnh hưởng lẫn nhau
let BatDongSan;

try {
    BatDongSan = require('../models/BatDongSan');
} catch (e) {
    console.warn(">>> Cảnh báo: Không tải được model BatDongSan, sẽ bỏ qua kiểm tra BĐS ký gửi khi ngưng khách.");
}

// --- CẤU CỨU HÀM VALIDATE (SẠCH & GỌN) ---
const validateCustomer = (data) => {
    const { hoten, sdt, cmnd, email, ngaysinh } = data;
    if (!hoten || !sdt || !cmnd || !ngaysinh) return "Họ tên, SĐT, CMND và Ngày sinh là bắt buộc.";
    
    if (!/^[0-9]{9,11}$/.test(String(sdt))) return "Số điện thoại phải từ 9-11 chữ số.";
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Định dạng Email không hợp lệ.";
    if (!/^\d{9,12}$/.test(cmnd)) return "CMND phải là dãy số từ 9 đến 12 ký tự.";

    const birthDate = dayjs(ngaysinh);
    if (!birthDate.isValid() || birthDate.isAfter(dayjs())) return "Ngày sinh không hợp lệ.";
    if (dayjs().diff(birthDate, 'year') > 100) return "Khách hàng không được quá 100 tuổi.";

    return null;
};

// --- CÁC HÀM XỬ LÝ CHÍNH ---

// 1. LẤY DANH SÁCH & TÌM KIẾM
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
                Sequelize.where(Sequelize.cast(Sequelize.col('khid'), 'CHAR'), { [Op.like]: s })
            ];
        }

        if (trangthai) where.trangthai = trangthai;
        if (gioitinh) where.gioitinh = gioitinh;

        const data = await KhachHang.findAll({ where, order: [['khid', 'ASC']] });
        res.json(data);
    } catch (err) {
        console.error("LỖI GET ALL:", err.message);
        res.status(500).json({ message: 'Lỗi hệ thống', error: err.message });
    }
};

// 2. THÊM MỚI (Đã gộp validate và check trùng)
exports.createKhachHang = async (req, res) => {
    try {
        const errorMsg = validateCustomer(req.body);
        if (errorMsg) return res.status(400).json({ message: errorMsg });

        const existing = await KhachHang.findOne({ where: { cmnd: req.body.cmnd } });
        if (existing) return res.status(400).json({ message: 'Số CMND đã tồn tại!' });

        const newKH = await KhachHang.create({ ...req.body, trangthai: 1 });
        res.status(201).json({ message: 'Thêm thành công!', data: newKH });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

// 3. CẬP NHẬT
exports.updateKhachHang = async (req, res) => {
    try {
        const { id } = req.params;
        const errorMsg = validateCustomer(req.body);
        if (errorMsg) return res.status(400).json({ message: errorMsg });

        const duplicate = await KhachHang.findOne({ where: { cmnd: req.body.cmnd, khid: { [Op.ne]: id } } });
        if (duplicate) return res.status(400).json({ message: 'CMND đã thuộc về người khác!' });

        await KhachHang.update(req.body, { where: { khid: id } });
        res.json({ message: 'Cập nhật thành công' });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi cập nhật', error: err.message });
    }
};

// 4. XÓA MỀM (NGƯNG HOẠT ĐỘNG)
exports.deleteKhachHang = async (req, res) => {
    try {
        const { id } = req.params;
        const checkOptions = { where: { khid: id } };

        // Kiểm tra ràng buộc dữ liệu trước khi ngưng hoạt động
        if (BatDongSan && await BatDongSan.findOne(checkOptions)) 
            return res.status(400).json({ message: 'Khách đang có BĐS ký gửi, không thể ngưng!' });

        await KhachHang.update({ trangthai: 0 }, { where: { khid: id } });
        res.json({ message: 'Đã chuyển sang Ngưng hoạt động' });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi hệ thống', error: err.message });
    }
};

// 5. CHI TIẾT
exports.getKhachHangById = async (req, res) => {
    try {
        const data = await KhachHang.findByPk(req.params.id);
        data ? res.json(data) : res.status(404).json({ message: 'Không tìm thấy' });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};