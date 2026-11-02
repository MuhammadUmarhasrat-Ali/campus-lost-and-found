import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { updateProfileSchema, changePasswordSchema } from '../validators/authValidator.js';

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user: user.toJSON(),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update allowed profile fields
 * @route   PUT /api/users/profile
 * @access  Private
 */
export const updateProfile = async (req, res, next) => {
  try {
    const parseResult = updateProfileSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        message: parseResult.error.errors[0].message,
      });
    }

    const { name, department, academicYear, phone } = parseResult.data;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (department) user.department = department;
    if (academicYear) user.academicYear = academicYear;
    if (phone !== undefined) user.phone = phone;

    // Notice we deliberately do NOT allow updating role, email, studentId or isActive
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: user.toJSON(),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Change password
 * @route   PUT /api/users/change-password
 * @access  Private
 */
export const changePassword = async (req, res, next) => {
  try {
    const parseResult = changePasswordSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        message: parseResult.error.errors[0].message,
      });
    }

    const { currentPassword, newPassword } = parseResult.data;
    const user = await User.findById(req.user._id).select('+passwordHash');

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password does not match',
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    next(error);
  }
};

