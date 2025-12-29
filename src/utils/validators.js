const { check } = require('express-validator');

exports.registerValidation = [
    check('fullName', 'Full name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
    // Advanced password strength check (Optional but recommended)
    // check('password', 'Password must be strong').isStrongPassword()
];

exports.loginValidation = [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
];

exports.updateProfileValidation = [
    check('fullName', 'Full name is required').optional().not().isEmpty(),
    check('email', 'Please include a valid email').optional().isEmail()
];

exports.changePasswordValidation = [
    check('currentPassword', 'Current password is required').exists(),
    check('newPassword', 'New password must be 6 or more characters').isLength({ min: 6 })
];