import express from 'express';
import {
  getItems,
  getStats,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  getMyPosts,
  updateItemStatus,
} from '../controllers/itemController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/stats', getStats);
router.get('/my-posts', protect, getMyPosts);

router.get('/', optionalAuth, getItems);
router.post('/', protect, upload.array('images', 5), createItem);

router.get('/:id', optionalAuth, getItemById);
router.put('/:id', protect, upload.array('images', 5), updateItem);
router.delete('/:id', protect, deleteItem);
router.patch('/:id/status', protect, updateItemStatus);

export default router;

