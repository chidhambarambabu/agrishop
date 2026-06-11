const User = require('../models/User');
const bcrypt = require('bcryptjs');

// ── GET PROFILE ───────────────────────────────────────────────────
const getProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.json(user);
};

// ── UPDATE PROFILE ────────────────────────────────────────────────
const updateProfile = async (req, res) => {
  const { name, phone, place } = req.body;

  const user = await User.findById(req.user._id);

  if (name) user.name = name;
  if (phone) user.phone = phone;
  if (place) user.place = place;

  await user.save();

  res.json({
    message: 'Profile updated successfully',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      place: user.place
    }
  });
};

// ── CHANGE PASSWORD ───────────────────────────────────────────────
const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id);

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Current password is incorrect' });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.json({ message: 'Password changed successfully' });
};
// ── ENABLE BUY MODE ───────────────────────────────────────────────
const enableBuyMode = async (req, res) => {
  const user = await User.findById(req.user._id);
  user.canBuy = true;
  user.activeMode = 'buyer';
  await user.save();
  res.json({
    message: 'Buy mode enabled!',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      place: user.place,
      isAdmin: user.isAdmin,
      canBuy: user.canBuy,
      activeMode: user.activeMode
    }
  });
};

// ── SWITCH MODE ───────────────────────────────────────────────────
const switchMode = async (req, res) => {
  const { mode } = req.body;
  const user = await User.findById(req.user._id);

  if (mode === 'buyer' && !user.canBuy) {
    return res.status(400).json({ message: 'Buy mode not enabled' });
  }

  user.activeMode = mode;
  await user.save();

  res.json({
    message: `Switched to ${mode} mode`,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      place: user.place,
      isAdmin: user.isAdmin,
      canBuy: user.canBuy,
      activeMode: user.activeMode
    }
  });
};

module.exports = { getProfile, updateProfile, changePassword,enableBuyMode,switchMode };