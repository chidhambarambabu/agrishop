const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, invalid token' });
    }
  }
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const farmerOnly = (req, res, next) => {
  if (req.user && req.user.role === 'farmer' && req.user.activeMode === 'farmer') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Farmers only.' });
  }
};

const buyerOnly = (req, res, next) => {
  // Allow buyers OR farmers who switched to buyer mode
  if (req.user && (req.user.role === 'buyer' ||
    (req.user.role === 'farmer' && req.user.activeMode === 'buyer' && req.user.canBuy))) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Switch to buyer mode first.' });
  }
};

module.exports = { protect, farmerOnly, buyerOnly };