const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllUsers,
  deleteUser,
  getAllProducts,
  deleteProduct,
  getAllOrders,
  deleteReview
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.get('/stats', protect, adminOnly, getDashboardStats);
router.get('/users', protect, adminOnly, getAllUsers);
router.delete('/users/:id', protect, adminOnly, deleteUser);
router.get('/products', protect, adminOnly, getAllProducts);
router.delete('/products/:id', protect, adminOnly, deleteProduct);
router.get('/orders', protect, adminOnly, getAllOrders);
router.delete('/reviews/:id', protect, adminOnly, deleteReview);

module.exports = router;