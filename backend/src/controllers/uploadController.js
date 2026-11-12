import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

const isCloudinaryConfigured = () => {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
};

// @desc Upload product image (Cloudinary in production or local server fallback in development)
// @route POST /api/upload
// @access Private (Admin)
export const uploadImage = async (req, res) => {
  const filePath = req.file?.path;

  const cleanupFile = () => {
    if (filePath && fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.warn('Could not remove temporary uploaded file:', err.message);
      }
    }
  };

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file uploaded',
      });
    }

    const hasCloudinary = isCloudinaryConfigured();
    const isProduction = process.env.NODE_ENV === 'production';

    // 1. Try Cloudinary upload if configured
    if (hasCloudinary) {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });

      try {
        const result = await cloudinary.uploader.upload(filePath, {
          folder: 'ponivraa/products',
          resource_type: 'image',
        });

        // Clean up temporary local file after successful Cloudinary upload
        cleanupFile();

        return res.status(200).json({
          success: true,
          message: 'Image uploaded to Cloudinary successfully',
          url: result.secure_url,
        });
      } catch (cloudErr) {
        console.error('Cloudinary upload failure:', cloudErr.message);
        cleanupFile();

        if (isProduction) {
          return res.status(502).json({
            success: false,
            message: 'Image cloud storage failed. Please verify Cloudinary credentials and network connection.',
          });
        }
      }
    }

    // 2. Production requirement: Render ephemeral disks do not persist images
    if (isProduction && !hasCloudinary) {
      cleanupFile();
      return res.status(503).json({
        success: false,
        message:
          'Cloud image storage is not configured for production. Please configure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in Render environment.',
      });
    }

    // 3. Local server upload fallback (development only)
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;

    return res.status(200).json({
      success: true,
      message: 'Image uploaded to local storage successfully',
      url: fileUrl,
    });
  } catch (error) {
    cleanupFile();
    console.error('Upload handler error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to upload image',
      error: error.message,
    });
  }
};
