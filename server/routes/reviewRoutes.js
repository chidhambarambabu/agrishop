const express = require('express');
const router = express.Router();
const { addReview, getProductReviews, deleteReview } = require('../controllers/reviewController');
const { protect, buyerOnly } = require('../middleware/authMiddleware');

router.post('/', protect, buyerOnly, addReview);
router.get('/:productId', getProductReviews);
router.delete('/:id', protect, buyerOnly, deleteReview);

module.exports = router;