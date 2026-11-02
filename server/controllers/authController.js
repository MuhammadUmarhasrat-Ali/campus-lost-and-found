import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { generateToken, clearTokenCookie } from '../utils/generateToken.js';
import { sendEmail } from '../utils/sendEmail.js';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../validators/authValidator.js';

/**
 * @desc    Register a new student
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res, next) => {
  try {
    const parseResult = registerSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        message: parseResult.error.errors[0].message,
        errors: parseResult.error.flatten().fieldErrors,
      });
    }

    const { name, email, studentId, department, academicYear, phone, password } =
      parseResult.data;

    // Check college email domain restriction if configured
    if (process.env.APPROVED_EMAIL_DOMAIN) {
      const allowedDomain = process.env.APPROVED_EMAIL_DOMAIN.toLowerCase().replace('@', '');
      const emailDomain = email.split('@')[1]?.toLowerCase();
      if (emailDomain !== allowedDomain) {
        return res.status(400).json({
          success: false,
          message: `Registration requires an official campus email address (@${allowedDomain})`,
        });
      }
    }

    // Check if email already registered
    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address is already registered',
      });
    }

    // Check if studentId already registered
    const existingStudentId = await User.findOne({ studentId: studentId.toUpperCase() });
    if (existingStudentId) {
      return res.status(400).json({
        success: false,
        message: 'An account with this Student ID / Roll Number is already registered',
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      studentId: studentId.toUpperCase(),
      department,
      academicYear,
      phone: phone || '',
      passwordHash,
      role: 'student', // Never allow setting admin role via registration
      isActive: true,
    });

    // Generate JWT and set HttpOnly cookie
    const token = generateToken(res, user._id);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      data: {
        user: user.toJSON(),
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login student or admin
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        message: parseResult.error.errors[0].message,
      });
    }

    const { email, password } = parseResult.data;

    // Query user with passwordHash
    const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact campus admin.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = generateToken(res, user._id);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      data: {
        user: user.toJSON(),
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Logout student or admin (clears cookie)
 * @route   POST /api/auth/logout
 * @access  Public
 */
export const logout = (req, res) => {
  clearTokenCookie(res);
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};

/**
 * @desc    Get currently logged in user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        user: req.user.toJSON(),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Request password reset token
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = async (req, res, next) => {
  try {
    const parseResult = forgotPasswordSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        message: parseResult.error.errors[0].message,
      });
    }

    const { email } = parseResult.data;
    const user = await User.findOne({ email: email.toLowerCase() });

    // Always respond with success message to prevent user enumeration
    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'If an account exists with this email, password reset instructions have been sent.',
      });
    }

    // Generate random reset token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Hash token and store in user document with 1 hour expiration
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save({ validateBeforeSave: false });

    // Construct reset URL
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

    const messageHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #EDE8DF; border-radius: 8px;">
        <h2 style="color: #8B45E8;">Campus Lost & Found - Password Reset</h2>
        <p>Hello ${user.name},</p>
        <p>You requested a password reset for your Campus Lost & Found account. Please click the button below to set a new password:</p>
        <p style="margin: 25px 0;">
          <a href="${resetUrl}" style="background-color: #8B45E8; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a>
        </p>
        <p>Or copy and paste this link into your browser:</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p style="color: #858585; font-size: 13px;">This link will expire in 60 minutes. If you did not request this, please ignore this email.</p>
      </div>
    `;

    const emailResult = await sendEmail({
      to: user.email,
      subject: 'Password Reset Request - Campus Lost & Found',
      text: `Reset your password by navigating to: ${resetUrl}`,
      html: messageHtml,
    });

    res.status(200).json({
      success: true,
      message: 'If an account exists with this email, password reset instructions have been sent.',
      // In development or when email is simulated, return the reset token directly to facilitate testing
      ...(emailResult.simulated && {
        devResetToken: resetToken,
        devResetUrl: resetUrl,
      }),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Reset password using reset token
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
export const resetPassword = async (req, res, next) => {
  try {
    const parseResult = resetPasswordSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        message: parseResult.error.errors[0].message,
      });
    }

    const { token, password } = parseResult.data;

    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    }).select('+passwordHash');

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired password reset token. Please request a new one.',
      });
    }

    // Set new password
    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // Auto login with new token
    const newToken = generateToken(res, user._id);

    res.status(200).json({
      success: true,
      message: 'Password reset successful. You are now logged in.',
      data: {
        user: user.toJSON(),
        token: newToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

