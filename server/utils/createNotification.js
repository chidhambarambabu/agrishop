const Notification = require('../models/Notification');

const createNotification = async (userId, title, message, type, orderId = null) => {
  try {
    await Notification.create({
      user: userId,
      title,
      message,
      type,
      orderId
    });
  } catch (err) {
    console.log('Notification error:', err.message);
  }
};

module.exports = createNotification;