import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

export const protectAdmin = async (req, res, next) => {
  let token;

  // 1. Check Authorization Bearer header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  // 2. Fallback to HTTP-only cookie if header is not present
  else if (req.cookies && req.cookies.admin_token) {
    token = req.cookies.admin_token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, please log in as admin',
    });
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret || secret.trim() === '') {
      return res.status(500).json({
        success: false,
        message: 'Server security configuration error (missing JWT secret)',
      });
    }

    const decoded = jwt.verify(token, secret);

    const admin = await Admin.findById(decoded.id).select('-password');
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Admin account not found or deactivated',
      });
    }

    req.admin = admin;
    return next();
  } catch (error) {
    console.error('JWT authorization error:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Session expired or invalid token. Please log in again.',
    });
  }
};
