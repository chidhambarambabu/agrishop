const Order = require('../models/Order');
const Product = require('../models/Product');
const createNotification = require('../utils/createNotification');

// ── PLACE ORDER ───────────────────────────────────────────────────
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

  // Notify farmer
  await createNotification(
    product.farmer,
    '🛒 New Order Received!',
    `${req.user.name} ordered ${quantity} ${product.unit} of ${product.name}`,
    'order_placed',
    order._id
  );

  // Notify buyer
  await createNotification(
    req.user._id,
    '✅ Order Placed Successfully!',
    `Your order for ${product.name} has been placed. Total: ₹${totalPrice}`,
    'order_placed',
    order._id
  );

  const populatedOrder = await Order.findById(order._id)
    .populate('product', 'name price unit')
    .populate('farmer', 'name phone');

  res.status(201).json({ message: 'Order placed successfully', order: populatedOrder });
};

// ── GET BUYER ORDERS ──────────────────────────────────────────────
const getMyOrders = async (req, res) => {
  const orders = await Order.find({ buyer: req.user._id })
    .populate('product', 'name price unit image')
    .populate('farmer', 'name phone place')
    .sort({ createdAt: -1 });
  res.json(orders);
};

// ── GET FARMER ORDERS ─────────────────────────────────────────────
const getFarmerOrders = async (req, res) => {
  const orders = await Order.find({ farmer: req.user._id })
    .populate('product', 'name price unit')
    .populate('buyer', 'name phone place')
    .sort({ createdAt: -1 });
  res.json(orders);
};

// ── UPDATE ORDER STATUS ───────────────────────────────────────────
const updateOrderStatus = async (req, res) => {
  const { status, note } = req.body;

  const validStatuses = ['placed', 'confirmed', 'shipped',
    'out_for_delivery', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  const order = await Order.findById(req.params.id)
    .populate('product', 'name')
    .populate('buyer', 'name');

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  if (order.farmer.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  order.status = status;
  order.statusHistory.push({ status, note: note || '' });
  await order.save();

  // Notify buyer about status update
  const statusMessages = {
    confirmed: `Your order for ${order.product?.name} has been confirmed! 🎉`,
    shipped: `Your order for ${order.product?.name} has been shipped! 🚚`,
    out_for_delivery: `Your order for ${order.product?.name} is out for delivery! 🛵`,
    delivered: `Your order for ${order.product?.name} has been delivered! 🎉`,
    cancelled: `Your order for ${order.product?.name} has been cancelled. ❌`
  };

  const statusTitles = {
    confirmed: '✅ Order Confirmed',
    shipped: '🚚 Order Shipped',
    out_for_delivery: '🛵 Out for Delivery',
    delivered: '🎉 Order Delivered',
    cancelled: '❌ Order Cancelled'
  };

  if (statusMessages[status]) {
    await createNotification(
      order.buyer,
      statusTitles[status],
      statusMessages[status],
      `order_${status}`,
      order._id
    );
  }

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