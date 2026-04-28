const express = require('express');
const router = express.Router();
const BatDongSan = require('../models/BatDongSan');
const bdsController = require('../controllers/batDongSanControllers');

// API lấy danh sách BĐS còn trống (tinhtrang = 0)
// router.get('/', async (req, res) => {
//     try {
//         const list = await BatDongSan.findAll({
//             where: { tinhtrang: 0 } // Chỉ lấy những căn chưa bán/chưa cọc
//         });
//         res.json(list);
//     } catch (error) {
//         res.status(500).json({ message: 'Lỗi lấy danh sách BĐS', error: error.message });
//     }
// });

router.get('/', bdsController.getAllBDS);
router.get('/tra-cuu', bdsController.traCuuBDS);
router.get('/hinh-anh/:id', bdsController.getHinhAnhBDS);
router.get('/:id', bdsController.getBDSById);
router.put('/:id', bdsController.updateBDS);
router.delete('/:id', bdsController.deleteBDS);

router.post('/', async (req, res) => {
  try {
    const bds = await BatDongSan.create(req.body);
    res.status(201).json(bds);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi thêm BĐS', error: error.message });
  }
});

module.exports = router;