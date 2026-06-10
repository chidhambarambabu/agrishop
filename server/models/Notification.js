const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: {
    type: String,
    enum: ['order_placed', 'order_confirmed', 'order_shipped',
           'order_delivered', 'order_cancelled', 'new_review'],
    required: true
  },
  isRead: { type: Boolean, default: false },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);