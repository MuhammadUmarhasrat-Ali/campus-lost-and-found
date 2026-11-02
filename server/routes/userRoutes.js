import express from 'express';
import {
  getProfile,
  updateProfile,
  changePassword,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All user routes are protected

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);

export default router;

