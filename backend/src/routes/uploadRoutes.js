import express from 'express';
import { upload } from '../middleware/uploadMiddleware.js';
import { uploadImage } from '../controllers/uploadController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protectAdmin, upload.single('image'), uploadImage);

export default router;

