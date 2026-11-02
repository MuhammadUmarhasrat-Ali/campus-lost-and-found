import express from 'express';
import {
  createContactRequest,
  getContactRequests,
  updateContactRequestStatus,
} from '../controllers/contactController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createContactRequest);
router.get('/', optionalAuth, getContactRequests);
router.patch('/:id', protect, updateContactRequestStatus);

export default router;

