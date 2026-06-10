const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Review = require('../models/Review');

// ── DASHBOARD STATS ───────────────────────────────────────────────
const getDashboardStats = async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalFarmers = await User.countDocuments({ role: 'farmer' });
  const totalBuyers = await User.countDocuments({ role: 'buyer' });
  const totalProducts = await Product.countDocuments();
  const totalOrders = await Order.countDocuments();
  const totalReviews = await Review.countDocuments();

  const revenueData = await Order.aggregate([
    { $match: { status: { $ne: 'cancelled' } } },
    { $group: { _id: null, total: { $sum: '$totalPrice' } } }
  ]);

  const totalRevenue = revenueData[0]?.total || 0;

  const recentOrders = await Order.find()
    .populate('buyer', 'name email')
    .populate('product', 'name price')
    .populate('farmer', 'name')
    .sort({ createdAt: -1 })
    .limit(5);

  res.json({
    totalUsers,
    totalFarmers,
    totalBuyers,
    totalProducts,
    totalOrders,
    totalReviews,
    totalRevenue,
    recentOrders
  });
};

// ── GET ALL USERS ─────────────────────────────────────────────────
const getAllUsers = async (req, res) => {
  const users = await User.find()
    .select('-password')
    .sort({ createdAt: -1 });
  res.json(users);
};

// ── DELETE USER ───────────────────────────────────────────────────
const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User deleted successfully' });
};

// ── GET ALL PRODUCTS ──────────────────────────────────────────────
const getAllProducts = async (req, res) => {
  const products = await Product.find()
    .populate('farmer', 'name email')
    .sort({ createdAt: -1 });
  res.json(products);
};

// ── DELETE PRODUCT ────────────────────────────────────────────────
const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Product deleted successfully' });
};

// ── GET ALL ORDERS ────────────────────────────────────────────────
const getAllOrders = async (req, res) => {
  const orders = await Order.find()
    .populate('buyer', 'name email')
    .populate('farmer', 'name email')
    .populate('product', 'name price')
    .sort({ createdAt: -1 });
  res.json(orders);
};

// ── DELETE REVIEW ─────────────────────────────────────────────────
const deleteReview = async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return res.status(404).json({ message: 'Review not found' });
  }
  await Review.findByIdAndDelete(req.params.id);
  res.json({ message: 'Review deleted successfully' });
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  deleteUser,
  getAllProducts,
  deleteProduct,
  getAllOrders,
  deleteReview
};