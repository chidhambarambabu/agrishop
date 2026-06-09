const express = require('express');
const router = express.Router();
const {
  addProduct,
  getAllProducts,
  getProductById,
  getMyProducts,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { protect, farmerOnly } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

router.get('/', getAllProducts);
router.get('/my-products', protect, farmerOnly, getMyProducts);
router.get('/:id', getProductById);
router.post('/', protect, farmerOnly, upload.single('image'), addProduct);
router.put('/:id', protect, farmerOnly, upload.single('image'), updateProduct);
router.delete('/:id', protect, farmerOnly, deleteProduct);

module.exports = router;