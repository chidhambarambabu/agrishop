const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// ── Generate 6-digit OTP ──────────────────────────────────────────
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// ── Send OTP Email ────────────────────────────────────────────────
const sendOTPEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  await transporter.sendMail({
    from: `"AgriShop" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your AgriShop OTP Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #16a34a;">AgriShop 🌾</h2>
        <p>Your OTP verification code is:</p>
        <h1 style="color: #16a34a; letter-spacing: 8px;">${otp}</h1>
        <p>This code expires in <strong>10 minutes</strong>.</p>
      </div>
    `
  });
};

// ── Generate JWT ──────────────────────────────────────────────────
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// ── REGISTER ──────────────────────────────────────────────────────
const register = async (req, res) => {
  const { name, email, password, phone, role, place } = req.body;

  if (!name || !email || !password || !phone || !role || !place) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'Email already registered' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    phone,
    role,
    place,
    otp,
    otpExpiry
  });

  // Send response immediately — don't wait for email
  res.status(201).json({
    message: 'Registration successful. OTP sent to your email.',
    userId: user._id
  });

  // Send email in background after response
  try {
    await sendOTPEmail(email, otp);
    console.log('✅ OTP email sent to:', email);
  } catch (emailError) {
    console.log('❌ Email error:', emailError.message);
  }
};

// ── VERIFY OTP ────────────────────────────────────────────────────
const verifyOTP = async (req, res) => {
  const { userId, otp } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (user.otp !== otp) {
    return res.status(400).json({ message: 'Invalid OTP' });
  }

  if (user.otpExpiry < new Date()) {
    return res.status(400).json({ message: 'OTP has expired' });
  }

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();

  const token = generateToken(user._id);

  res.json({
    message: 'Email verified successfully!',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      place: user.place
    }
  });
};

// ── LOGIN ─────────────────────────────────────────────────────────
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'Invalid email or password' });
  }

  if (!user.isVerified) {
    return res.status(400).json({ message: 'Please verify your email first' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid email or password' });
  }

  const token = generateToken(user._id);

  res.json({
    message: 'Login successful',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      place: user.place
    }
  });
};

// ── RESEND OTP ────────────────────────────────────────────────────
const resendOTP = async (req, res) => {
  const { userId } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (user.isVerified) {
    return res.status(400).json({ message: 'User already verified' });
  }

  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

  user.otp = otp;
  user.otpExpiry = otpExpiry;
  await user.save();

  // Send response immediately
  res.json({ message: 'OTP resent successfully' });

  // Send email in background
  try {
    await sendOTPEmail(user.email, otp);
    console.log('✅ Resend OTP email sent to:', user.email);
  } catch (emailError) {
    console.log('❌ Resend email error:', emailError.message);
  }
};

module.exports = { register, verifyOTP, login, resendOTP };