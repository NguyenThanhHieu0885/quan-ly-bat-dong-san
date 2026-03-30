const khachhangMiddleware = {
    // 1. Giữ nguyên cái cũ của bạn (Dùng cho POST - Thêm mới)
    validateKhachHang: (req, res, next) => {
        const { hoten, cmnd, sdt } = req.body;
        // Bắt buộc phải có đủ 3 trường này
        if (!hoten || !cmnd || !sdt) {
            return res.status(400).json({ message: "Thông tin không được rỗng" });
        }
        next();
    },

    // 2. Bổ sung cái mới (Dùng riêng cho PUT - Cập nhật)
    validateUpdate: (req, res, next) => {
        const { hoten, cmnd, sdt } = req.body;
        
        // Nếu người dùng có gửi hoten lên thì không được để nó là chuỗi rỗng ""
        if (hoten !== undefined && String(hoten).trim() === "") {
            return res.status(400).json({ message: "Họ tên không được để trống" });
        }
        if (cmnd !== undefined && String(cmnd).trim() === "") {
            return res.status(400).json({ message: "CMND không được để trống" });
        }
        if (sdt !== undefined && String(sdt).trim() === "") {
            return res.status(400).json({ message: "SĐT không được để trống" });
        }
        
        next(); // Vượt qua hết thì cho đi tiếp
    },

    // 3. Giữ nguyên cái tra cứu
    validateSearch: (req, res, next) => {
        if (!req.query.q) {
            return res.status(400).json({ message: "Vui lòng nhập thông tin" });
        }
        next();
    }
};

module.exports = khachhangMiddleware;