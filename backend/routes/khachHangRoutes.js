const express = require('express');
const router = express.Router();
const { getKhachHangs } = require('../controllers/khachHangController');

// Lắng nghe request GET tại /api/khach-hang
router.get('/', getKhachHangs);

module.exports = router;