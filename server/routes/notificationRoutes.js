const express = require('express');
const router = express.Router();
const {
  getNotifications,
  markAllRead,
  markOneRead,
  deleteNotification,
  getUnreadCount
} = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getNotifications);
router.get('/unread-count', protect, getUnreadCount);
router.put('/mark-all-read', protect, markAllRead);
router.put('/:id/read', protect, markOneRead);
router.delete('/:id', protect, deleteNotification);

module.exports = router;