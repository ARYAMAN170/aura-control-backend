const User = require('../models/User');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

// @desc    Get all users (Admin only)
// @route   GET /api/users
exports.getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const users = await User.find()
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalUsers = await User.countDocuments();

        res.status(200).json({
            success: true,
            count: users.length,
            pagination: {
                totalUsers,
                currentPage: page,
                totalPages: Math.ceil(totalUsers / limit),
            },
            data: users,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update user status (Admin only)
// @route   PATCH /api/users/:id/status
exports.updateUserStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!['active', 'inactive'].includes(status)) {
            return res.status(400).json({ message: "Invalid status. Use 'active' or 'inactive'" });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) return res.status(404).json({ message: 'User not found' });

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update own profile
// @route   PUT /api/users/profile
exports.updateProfile = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const userId = req.user.id;
        const { fullName, email } = req.body;

        // Check email uniqueness if changing
        if (email) {
            const emailExists = await User.findOne({ email });
            if (emailExists && emailExists._id.toString() !== userId) {
                return res.status(400).json({ message: 'Email already in use' });
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { fullName, email },
            { new: true, runValidators: true }
        ).select('-password');

        res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
// @desc    Get dashboard statistics (Admin only)
// @route   GET /api/users/stats
exports.getDashboardStats = async (req, res) => {
    try {
        // Calculate the start of the current month for "New This Month"
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        // Run all queries in parallel for performance
        const [total, active, inactive, newThisMonth] = await Promise.all([
            User.countDocuments({}), // Total Users
            User.countDocuments({ status: 'active' }), // Active
            User.countDocuments({ status: 'inactive' }), // Inactive
            User.countDocuments({ createdAt: { $gte: firstDayOfMonth } }) // New This Month
        ]);

        // Note: Since our schema currently only has 'active'/'inactive',
        // we return 0 for pending unless you add 'pending' to your User model enum.
        const pending = 0;

        res.status(200).json({
            success: true,
            data: {
                totalUsers: total,
                activeUsers: active,
                inactiveUsers: inactive,
                pendingUsers: pending,
                newUsersThisMonth: newThisMonth
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error: Unable to fetch stats',
            error: error.message
        });
    }
};
// @desc    Change password
// @route   PUT /api/users/change-password
exports.changePassword = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { currentPassword, newPassword } = req.body;

    try {
        // Get user with password field specifically
        const user = await User.findById(req.user.id);

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Incorrect current password' });

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.status(200).json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};