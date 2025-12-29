const express = require('express');
const router = express.Router();
const { getAllUsers, updateUserStatus, updateProfile, getDashboardStats, changePassword } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');
const { updateProfileValidation, changePasswordValidation } = require('../utils/validators');

// Admin Routes
router.get('/stats', protect, adminOnly, getDashboardStats);
router.get('/', protect, adminOnly, getAllUsers);
router.patch('/:id/status', protect, adminOnly, updateUserStatus);

// User Routes
router.put('/profile', protect, updateProfileValidation, updateProfile);
router.put('/change-password', protect, changePasswordValidation, changePassword);

module.exports = router;