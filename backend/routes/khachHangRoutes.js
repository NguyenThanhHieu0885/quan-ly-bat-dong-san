const express = require('express');
const router = express.Router();
const khachHangController = require('../controllers/khachhangController');

router.get('/', khachHangController.getAllKhachHang);
router.post('/', khachHangController.createKhachHang);
router.put('/:id', khachHangController.updateKhachHang);
router.delete('/:id', khachHangController.deleteKhachHang);

module.exports = router;
