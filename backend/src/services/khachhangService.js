const { Op } = require('sequelize');
const sequelize = require('../configs/db');
const initModels = require("../models/init-models");

// Khởi tạo models
const models = initModels(sequelize);

// Lấy đúng tên biến viết thường từ file init-models của bạn
const KhachhangModel = models.khachhang; 
const BatdongsanModel = models.batdongsan;
const HopdongChuyenNhuongModel = models.hopdongchuyennhuong;
const YeucauKhachhangModel = models.yeucaukhachhang;

const khachhangService = {
    // 1. Tra cứu (Sơ đồ: Tracuukh.txt)
    search: async (q) => {
        const list = await KhachhangModel.findAll({
            where: { 
                [Op.or]: [
                    { hoten: { [Op.like]: `%${q}%` } }, 
                    { sdt: { [Op.like]: `%${q}%` } }, 
                    { cmnd: { [Op.like]: `%${q}%` } }
                ] 
            }
        });
        
        if (!list || list.length === 0) {
            throw new Error("Không tồn tại thông tin khách hàng");
        }
        return list;
    },

    // 2. Thêm mới (Sơ đồ: Themkh.txt)
    create: async (data) => {
        // Kiểm tra CMND đã tồn tại chưa
        const exist = await KhachhangModel.findOne({ where: { cmnd: data.cmnd } });
        if (exist) {
            throw new Error("Thông tin bị trùng");
        }
        return await KhachhangModel.create(data);
    },

    // 3. Cập nhật (Sơ đồ: Capnhatkh.txt)
    update: async (id, data) => {
        const kh = await KhachhangModel.findByPk(id);
        if (!kh) {
            throw new Error("Không tồn tại khách hàng");
        }
        
        if (data.cmnd) {
            const exist = await KhachhangModel.findOne({ 
                where: { 
                    cmnd: data.cmnd, 
                    khid: { [Op.ne]: id } 
                } 
            });
            if (exist) {
                throw new Error("Thông tin bị trùng");
            }
        }
        
        return await kh.update(data);
    },

    // 4. Xóa (Sơ đồ: Xoakh.txt)
    delete: async (id) => {
        // Kiểm tra ràng buộc Bất động sản
        const hasBds = await BatdongsanModel.findOne({ where: { khid: id } });
        if (hasBds) {
            throw new Error("Khách hàng đang có bất động sản ký gửi");
        }

        // Kiểm tra ràng buộc Hợp đồng chuyển nhượng
        const hasHd = await HopdongChuyenNhuongModel.findOne({ where: { khid: id } });
        if (hasHd) {
            throw new Error("Khách hàng đang có hợp đồng chuyển nhượng");
        }

        const kh = await KhachhangModel.findByPk(id);
        if (kh) {
            await kh.destroy();
            return true;
        }
        throw new Error("Không tìm thấy khách hàng để xóa");
    },

    // 5. Lập yêu cầu (Sơ đồ: Lapyeucaukh.txt)
    request: async (data) => {
        const kh = await KhachhangModel.findByPk(data.khid);
        if (!kh) {
            throw new Error("Khách hàng không tồn tại");
        }
        return await YeucauKhachhangModel.create(data);
    }
};

module.exports = khachhangService;