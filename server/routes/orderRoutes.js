const express = require('express');
const router = express.Router();
const {
  placeOrder,
  getMyOrders,
  getFarmerOrders,
  updateOrderStatus,
  getOrderById
} = require('../controllers/orderController');
const { protect, farmerOnly, buyerOnly } = require('../middleware/authMiddleware');

router.post('/', protect, buyerOnly, placeOrder);
router.get('/my-orders', protect, buyerOnly, getMyOrders);
router.get('/farmer-orders', protect, farmerOnly, getFarmerOrders);
router.put('/:id/status', protect, farmerOnly, updateOrderStatus);
router.get('/:id', protect, getOrderById);

module.exports = router;