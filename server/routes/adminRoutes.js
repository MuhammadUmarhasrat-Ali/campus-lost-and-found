import express from 'express';
import {
  getAdminStats,
  getUsers,
  toggleUserStatus,
  getAdminItems,
  deleteAdminItem,
  getAdminReports,
  updateReportStatus,
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Require both authentication and admin authorization for all routes
router.use(protect, requireAdmin);

router.get('/dashboard', getAdminStats);
router.get('/users', getUsers);
router.patch('/users/:id/status', toggleUserStatus);

router.get('/items', getAdminItems);
router.delete('/items/:id', deleteAdminItem);

router.get('/reports', getAdminReports);
router.patch('/reports/:id', updateReportStatus);

export default router;

