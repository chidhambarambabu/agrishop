const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  changePassword,
  enableBuyMode,
  switchMode
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.put('/enable-buy-mode', protect, enableBuyMode);
router.put('/switch-mode', protect, switchMode);

module.exports = router;