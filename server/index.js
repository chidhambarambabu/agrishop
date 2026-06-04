const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));  // ← add this
app.use('/api/orders', require('./routes/orderRoutes'));      // ← add this
app.get('/', (req, res) => {
  res.json({ message: 'AgriShop API is running 🌾' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 8080;

mongoose.connect(process.env.MONGO_URI, {
  tlsAllowInvalidCertificates: true
})
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.log('❌ DB connection error:', err));