const Review = require('../models/Review');
const Order = require('../models/Order');
const Product = require('../models/Product');

// ── ADD REVIEW ────────────────────────────────────────────────────
const addReview = async (req, res) => {
  const { productId, rating, comment } = req.body;

  if (!productId || !rating || !comment) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Check if buyer has ordered this product
  const order = await Order.findOne({
    buyer: req.user._id,
    product: productId,
    status: 'delivered'
  });

  if (!order) {
    return res.status(400).json({
      message: 'You can only review products you have received'
    });
  }

  // Check if already reviewed
  const existingReview = await Review.findOne({
    product: productId,
    buyer: req.user._id
  });

  if (existingReview) {
    return res.status(400).json({ message: 'You have already reviewed this product' });
  }

  const review = await Review.create({
    product: productId,
    buyer: req.user._id,
    rating,
    comment
  });

  // Update product average rating
  const reviews = await Review.find({ product: productId });
  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  await Product.findByIdAndUpdate(productId, {
    averageRating: avgRating.toFixed(1),
    totalReviews: reviews.length
  });

  const populatedReview = await Review.findById(review._id)
    .populate('buyer', 'name place');

  res.status(201).json({
    message: 'Review added successfully',
    review: populatedReview
  });
};

// ── GET PRODUCT REVIEWS ───────────────────────────────────────────
const getProductReviews = async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId })
    .populate('buyer', 'name place')
    .sort({ createdAt: -1 });

  res.json(reviews);
};

// ── DELETE REVIEW ─────────────────────────────────────────────────
const deleteReview = async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return res.status(404).json({ message: 'Review not found' });
  }

  if (review.buyer.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  await Review.findByIdAndDelete(req.params.id);

  // Update product rating
  const reviews = await Review.find({ product: review.product });
  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  await Product.findByIdAndUpdate(review.product, {
    averageRating: avgRating.toFixed(1),
    totalReviews: reviews.length
  });

  res.json({ message: 'Review deleted successfully' });
};

module.exports = { addReview, getProductReviews, deleteReview };