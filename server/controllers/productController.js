const Product = require('../models/Product');

// ── ADD PRODUCT (Farmer only) ─────────────────────────────────────
const addProduct = async (req, res) => {
  const { name, description, category, price, quantity, unit, locality, shippingCharges } = req.body;

  if (!name || !description || !category || !price || !quantity || !unit || !locality) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const product = await Product.create({
    farmer: req.user._id,
    name,
    description,
    category,
    price,
    quantity,
    unit,
    locality,
    shippingCharges: shippingCharges || 0
  });

  res.status(201).json({ message: 'Product added successfully', product });
};

// ── GET ALL PRODUCTS (Public) ─────────────────────────────────────
const getAllProducts = async (req, res) => {
  const { category, search } = req.query;

  let filter = { isAvailable: true, quantity: { $gt: 0 } };

  if (category) filter.category = category;
  if (search) filter.name = { $regex: search, $options: 'i' };

  const products = await Product.find(filter)
    .populate('farmer', 'name place phone')
    .sort({ createdAt: -1 });

  res.json(products);
};

// ── GET SINGLE PRODUCT ────────────────────────────────────────────
const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('farmer', 'name place phone email');

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  res.json(product);
};

// ── GET FARMER'S OWN PRODUCTS ─────────────────────────────────────
const getMyProducts = async (req, res) => {
  const products = await Product.find({ farmer: req.user._id })
    .sort({ createdAt: -1 });

  res.json(products);
};

// ── UPDATE PRODUCT (Farmer only) ──────────────────────────────────
const updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  if (product.farmer.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized to update this product' });
  }

  const updated = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json({ message: 'Product updated successfully', product: updated });
};

// ── DELETE PRODUCT (Farmer only) ──────────────────────────────────
const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  if (product.farmer.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized to delete this product' });
  }

  await Product.findByIdAndDelete(req.params.id);

  res.json({ message: 'Product deleted successfully' });
};

module.exports = {
  addProduct,
  getAllProducts,
  getProductById,
  getMyProducts,
  updateProduct,
  deleteProduct
};