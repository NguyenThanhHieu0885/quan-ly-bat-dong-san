const express = require('express');
const router = express.Router();
const khachhangController = require('../controllers/khachhangController');
const khachhangMiddleware = require('../middleware/khachhangMiddleware');

// 1. Tra cứu khách hàng (Sơ đồ Tracuukh.txt)
// Dùng validateSearch để bắt lỗi nếu không nhập từ khóa q
router.get('/search', khachhangMiddleware.validateSearch, khachhangController.search);

// 2. Thêm khách hàng (Sơ đồ Themkh.txt)
// Dùng validateKhachHang để bắt lỗi nếu thiếu 1 trong 3 (hoten, cmnd, sdt)
router.post('/', khachhangMiddleware.validateKhachHang, khachhangController.create);

// 3. Cập nhật khách hàng (Sơ đồ Capnhatkh.txt)
// Dùng validateUpdate mới để cho phép sửa lẻ tẻ từng trường mà không báo lỗi "rỗng"
router.put('/:id', khachhangMiddleware.validateUpdate, khachhangController.update);

// 4. Xóa khách hàng (Sơ đồ Xoakh.txt)
router.delete('/:id', khachhangController.delete);

// 5. Lập yêu cầu khách hàng (Sơ đồ Lapyeucaukh.txt)
router.post('/request', khachhangController.addRequest);

module.exports = router;