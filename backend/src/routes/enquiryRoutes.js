import express from 'express';
import {
  createEnquiry,
  getAllEnquiries,
  toggleEnquiryRead,
  deleteEnquiry,
} from '../controllers/enquiryController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', createEnquiry);
router.get('/', protectAdmin, getAllEnquiries);
router.patch('/:id/read', protectAdmin, toggleEnquiryRead);
router.delete('/:id', protectAdmin, deleteEnquiry);

export default router;

