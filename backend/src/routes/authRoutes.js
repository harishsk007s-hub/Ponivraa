import express from 'express';
import {
  loginAdmin,
  logoutAdmin,
  getAdminProfile,
} from '../controllers/authController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';
import { loginRateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Public Rate-Limited Login Endpoint
router.post('/login', loginRateLimiter, loginAdmin);

// Protected Admin Endpoints
router.post('/logout', protectAdmin, logoutAdmin);
router.get('/me', protectAdmin, getAdminProfile);
router.get('/verify', protectAdmin, getAdminProfile);

export default router;
