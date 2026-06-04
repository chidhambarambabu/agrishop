const Order = require('../models/Order');
const Product = require('../models/Product');

// ── PLACE ORDER (Buyer only) ──────────────────────────────────────
const placeOrder = async (req, res) => {
  const { productId, quantity, shippingAddress, paymentMethod } = req.body;

  if (!productId || !quantity || !shippingAddress) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  if (product.quantity < quantity) {
    return res.status(400).json({ message: 'Insufficient stock' });
  }

  const totalPrice = (product.price * quantity) + product.shippingCharges;

  const order = await Order.create({
    buyer: req.user._id,
    farmer: product.farmer,
    product: productId,
    quantity,
    totalPrice,
    shippingAddress,
    paymentMethod: paymentMethod || 'cod',
    statusHistory: [{ status: 'placed', note: 'Order placed successfully' }]
  });

  // Reduce product quantity
  product.quantity -= quantity;
  if (product.quantity === 0) product.isAvailable = false;
  await product.save();

  const populatedOrder = await Order.findById(order._id)
    .populate('product', 'name price unit')
    .populate('farmer', 'name phone');

  res.status(201).json({ message: 'Order placed successfully', order: populatedOrder });
};

// ── GET BUYER'S ORDERS ────────────────────────────────────────────
const getMyOrders = async (req, res) => {
  const orders = await Order.find({ buyer: req.user._id })
    .populate('product', 'name price unit image')
    .populate('farmer', 'name phone place')
    .sort({ createdAt: -1 });

  res.json(orders);
};

// ── GET FARMER'S ORDERS ───────────────────────────────────────────
const getFarmerOrders = async (req, res) => {
  const orders = await Order.find({ farmer: req.user._id })
    .populate('product', 'name price unit')
    .populate('buyer', 'name phone place')
    .sort({ createdAt: -1 });

  res.json(orders);
};

// ── UPDATE ORDER STATUS (Farmer only) ────────────────────────────
const updateOrderStatus = async (req, res) => {
  const { status, note } = req.body;

  const validStatuses = ['placed', 'confirmed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  if (order.farmer.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  order.status = status;
  order.statusHistory.push({ status, note: note || '' });
  await order.save();

  res.json({ message: 'Order status updated', order });
};

// ── GET ORDER BY ID ───────────────────────────────────────────────
const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('product', 'name price unit image')
    .populate('farmer', 'name phone place')
    .populate('buyer', 'name phone place');

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  res.json(order);
};

module.exports = {
  placeOrder,
  getMyOrders,
  getFarmerOrders,
  updateOrderStatus,
  getOrderById
};