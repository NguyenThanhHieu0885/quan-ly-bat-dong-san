const express = require('express');
const router = express.Router();
const {
  getKyGuis,
  createKyGui,
  getKyGuiById,
  updateKyGui,
  deleteKyGui,
} = require('../controllers/kyGuiController');

router.route('/').get(getKyGuis).post(createKyGui);

router.route('/:id').get(getKyGuiById).put(updateKyGui).delete(deleteKyGui);

module.exports = router;
