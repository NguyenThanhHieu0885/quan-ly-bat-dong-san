const express = require('express');
const router = express.Router();
const { getBatDongSans } = require('../controllers/batDongSanController');

// Đường dẫn này sẽ thực thi hàm getBatDongSans khi có request GET
router.get('/', getBatDongSans);

module.exports = router;