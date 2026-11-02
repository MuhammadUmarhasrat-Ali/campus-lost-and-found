import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { cloudinary, isCloudinaryConfigured } from '../config/cloudinary.js';

// Ensure local uploads directory exists
const uploadsDir = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer memory storage (allows analyzing and sending buffer to Cloudinary or disk)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file format. Only JPG, JPEG, PNG, and WEBP are allowed.'), false);
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
  fileFilter,
});

/**
 * Upload an array of multer memory files to Cloudinary or local disk
 */
export const processUploadedFiles = async (files) => {
  if (!files || files.length === 0) return [];

  const uploadPromises = files.map(async (file) => {
    if (isCloudinaryConfigured) {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'campus_lost_found/items',
            resource_type: 'image',
          },
          (error, result) => {
            if (error) return reject(error);
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
            });
          }
        );
        uploadStream.end(file.buffer);
      });
    } else {
      // Local disk fallback
      const ext = path.extname(file.originalname) || '.jpg';
      const filename = `item-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      const filePath = path.join(uploadsDir, filename);
      await fs.promises.writeFile(filePath, file.buffer);
      return {
        url: `/uploads/${filename}`,
        publicId: `local-${filename}`,
      };
    }
  });

  return Promise.all(uploadPromises);
};

/**
 * Delete image either from Cloudinary or local disk
 */
export const deleteStoredImage = async (image) => {
  if (!image) return;

  try {
    if (image.publicId && !image.publicId.startsWith('local-') && isCloudinaryConfigured) {
      await cloudinary.uploader.destroy(image.publicId);
    } else if (image.publicId && image.publicId.startsWith('local-')) {
      const filename = image.publicId.replace('local-', '');
      const filePath = path.join(uploadsDir, filename);
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
      }
    } else if (image.url && image.url.startsWith('/uploads/')) {
      const filename = path.basename(image.url);
      const filePath = path.join(uploadsDir, filename);
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
      }
    }
  } catch (err) {
    console.warn(`[Image Cleanup] Could not delete image ${image.publicId || image.url}:`, err.message);
  }
};

