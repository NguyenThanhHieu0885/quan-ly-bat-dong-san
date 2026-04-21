const express = require('express');
const router = express.Router();
// Sửa lại tên import để tránh lỗi hoa/thường trên Linux/Mac
<<<<<<< Updated upstream
const khachHangController = require('../controllers/khachhangController');
=======
const khachHangController = require('../controllers/khachHangController');
>>>>>>> Stashed changes

router.get('/', khachHangController.getAllKhachHang);
router.post('/', khachHangController.createKhachHang);
router.put('/:id', khachHangController.updateKhachHang);
router.delete('/:id', khachHangController.deleteKhachHang);

module.exports = router;
