import Admin from '../models/Admin.js';
import jwt from 'jsonwebtoken';

const generateToken = (id, email) => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.trim() === '') {
    throw new Error('JWT_SECRET is not configured on the server');
  }
  return jwt.sign({ id, email, role: 'admin' }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  };
};

// @desc Admin login
// @route POST /api/auth/login
// @access Public (Rate limited)
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Input validation
    if (!email || typeof email !== 'string' || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Admin email is required',
      });
    }

    if (!password || typeof password !== 'string' || !password.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Password is required',
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address format',
      });
    }

    // 2. Locate admin record
    const admin = await Admin.findOne({ email: cleanEmail });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials',
      });
    }

    // 3. Bcrypt password verification
    const isMatch = await admin.matchPassword(password.trim());
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials',
      });
    }

    // 4. Generate token and set HTTP-only cookie
    const token = generateToken(admin._id, admin.email);
    res.cookie('admin_token', token, getCookieOptions());

    return res.status(200).json({
      success: true,
      message: 'Admin authenticated successfully',
      data: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        token,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during authentication',
      error: error.message,
    });
  }
};

// @desc Admin logout
// @route POST /api/auth/logout
// @access Private (Admin)
export const logoutAdmin = async (req, res) => {
  try {
    res.clearCookie('admin_token', getCookieOptions());
    return res.status(200).json({
      success: true,
      message: 'Admin logged out successfully',
    });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error during logout',
      error: error.message,
    });
  }
};

// @desc Verify session / Get admin profile
// @route GET /api/auth/me or GET /api/auth/verify
// @access Private (Admin)
export const getAdminProfile = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      authenticated: true,
      data: {
        _id: req.admin._id,
        name: req.admin.name,
        email: req.admin.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error verifying session',
      error: error.message,
    });
  }
};
