import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  // 1. Check HTTP-only cookies
  if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  // 2. Check Authorization header as fallback
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided. Please log in.',
    });
  }

  try {
    const secret = process.env.JWT_SECRET || 'fallback_secret_for_development_campus_2026';
    const decoded = jwt.verify(token, secret);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists.',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your student account has been deactivated. Please contact campus admin.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, invalid or expired token. Please log in again.',
    });
  }
};

export const optionalAuth = async (req, res, next) => {
  let token;
  if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next();
  }

  try {
    const secret = process.env.JWT_SECRET || 'fallback_secret_for_development_campus_2026';
    const decoded = jwt.verify(token, secret);
    const user = await User.findById(decoded.id);
    if (user && user.isActive) {
      req.user = user;
    }
  } catch (err) {
    // Ignore invalid token in optional auth
  }
  next();
};

