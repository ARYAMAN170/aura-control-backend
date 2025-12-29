const express = require('express');
const router = express.Router();
const { signup, login, logout, getMe } = require('../controllers/authController');
const { registerValidation, loginValidation } = require('../utils/validators');
const { protect } = require('../middleware/authMiddleware');

router.post('/signup', registerValidation, signup);
router.post('/login', loginValidation, login);
router.post('/logout', logout);
router.get('/me', protect, getMe);

module.exports = router;