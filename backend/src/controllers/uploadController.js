import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// Configure Cloudinary if credentials exist
if (
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// @desc Upload product image (Cloudinary or local server fallback)
// @route POST /api/upload
// @access Private (Admin)
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file uploaded',
      });
    }

    // Check if Cloudinary is configured
    if (
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    ) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'ponivraa/products',
        });

        // Clean up local temp file after upload to Cloudinary
        try {
          fs.unlinkSync(req.file.path);
        } catch (cleanupErr) {
          console.warn('Could not remove temp uploaded file:', cleanupErr.message);
        }

        return res.status(200).json({
          success: true,
          message: 'Image uploaded to Cloudinary successfully',
          url: result.secure_url,
        });
      } catch (cloudErr) {
        console.error('Cloudinary upload error:', cloudErr);
        // Fallback to local file URL
      }
    }

    // Local server upload fallback
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;

    return res.status(200).json({
      success: true,
      message: 'Image uploaded to local storage successfully',
      url: fileUrl,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to upload image',
      error: error.message,
    });
  }
};

