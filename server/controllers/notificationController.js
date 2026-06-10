const Notification = require('../models/Notification');

const getNotifications = async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(20);
  res.json(notifications);
};

const markAllRead = async (req, res) => {
  await Notification.updateMany(
    { user: req.user._id, isRead: false },
    { isRead: true }
  );
  res.json({ message: 'All notifications marked as read' });
};

const markOneRead = async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
  res.json({ message: 'Notification marked as read' });
};

const deleteNotification = async (req, res) => {
  await Notification.findByIdAndDelete(req.params.id);
  res.json({ message: 'Notification deleted' });
};

const getUnreadCount = async (req, res) => {
  const count = await Notification.countDocuments({
    user: req.user._id,
    isRead: false
  });
  res.json({ count });
};

module.exports = {
  getNotifications,
  markAllRead,
  markOneRead,
  deleteNotification,
  getUnreadCount
};