import express from 'express';
import {
  createOrder,
  trackOrder,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  getDashboardStats,
  submitPaymentVerification,
  updatePaymentStatus,
} from '../controllers/orderController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', createOrder);
router.get('/track', trackOrder);
router.post('/:orderId/verify-payment', submitPaymentVerification);
router.get('/', protectAdmin, getAllOrders);
router.get('/dashboard/stats', protectAdmin, getDashboardStats);
router.patch('/:id/status', protectAdmin, updateOrderStatus);
router.patch('/:id/payment-status', protectAdmin, updatePaymentStatus);
router.delete('/:id', protectAdmin, deleteOrder);

export default router;

