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

module.exports = { getProfile, updateProfile, changePassword };