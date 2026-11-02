import User from '../models/User.js';
import Item from '../models/Item.js';
import Report from '../models/Report.js';
import ContactRequest from '../models/ContactRequest.js';
import { deleteStoredImage } from '../middleware/uploadMiddleware.js';

/**
 * @desc    Get admin overview statistics
 * @route   GET /api/admin/dashboard
 * @access  Private (Admin)
 */
export const getAdminStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalStudents,
      totalLost,
      totalFound,
      activeItems,
      resolvedItems,
      totalReports,
      pendingReports,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'student' }),
      Item.countDocuments({ type: 'lost' }),
      Item.countDocuments({ type: 'found' }),
      Item.countDocuments({ status: 'active' }),
      Item.countDocuments({ status: { $in: ['claimed', 'resolved'] } }),
      Report.countDocuments(),
      Report.countDocuments({ status: 'pending' }),
    ]);

    // Recent items
    const recentItems = await Item.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name department studentId');

    // Recent reports
    const recentReports = await Report.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('reportedItem', 'title category type')
      .populate('reportedBy', 'name studentId');

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalStudents,
          totalLost,
          totalFound,
          activeItems,
          resolvedItems,
          totalReports,
          pendingReports,
        },
        recentItems,
        recentReports,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get list of all users with search and pagination
 * @route   GET /api/admin/users
 * @access  Private (Admin)
 */
export const getUsers = async (req, res, next) => {
  try {
    const { search, role, status, page = 1, limit = 15 } = req.query;
    const query = {};

    if (search && search.trim() !== '') {
      const sanitized = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.$or = [
        { name: { $regex: sanitized, $options: 'i' } },
        { email: { $regex: sanitized, $options: 'i' } },
        { studentId: { $regex: sanitized, $options: 'i' } },
        { department: { $regex: sanitized, $options: 'i' } },
      ];
    }

    if (role && ['student', 'admin'].includes(role)) {
      query.role = role;
    }

    if (status !== undefined && status !== 'all') {
      query.isActive = status === 'active';
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 15));
    const skip = (pageNum - 1) * limitNum;

    const totalUsers = await User.countDocuments(query);
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          totalUsers,
          totalPages: Math.ceil(totalUsers / limitNum) || 1,
          currentPage: pageNum,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle user account activation status
 * @route   PATCH /api/admin/users/:id/status
 * @access  Private (Admin)
 */
export const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Protect against self-deactivation
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Administrators cannot deactivate their own account',
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User account has been ${user.isActive ? 'reactivated' : 'suspended'} successfully`,
      data: {
        user: user.toJSON(),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all items for administrative moderation
 * @route   GET /api/admin/items
 * @access  Private (Admin)
 */
export const getAdminItems = async (req, res, next) => {
  try {
    const { search, type, status, page = 1, limit = 20 } = req.query;
    const query = {};

    if (search && search.trim() !== '') {
      const sanitized = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.$or = [
        { title: { $regex: sanitized, $options: 'i' } },
        { location: { $regex: sanitized, $options: 'i' } },
      ];
    }

    if (type && ['lost', 'found'].includes(type)) {
      query.type = type;
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const total = await Item.countDocuments(query);
    const items = await Item.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate('user', 'name email studentId department');

    res.status(200).json({
      success: true,
      data: {
        items,
        pagination: {
          total,
          totalPages: Math.ceil(total / limitNum) || 1,
          currentPage: pageNum,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete any item post (admin moderation)
 * @route   DELETE /api/admin/items/:id
 * @access  Private (Admin)
 */
export const deleteAdminItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    // Clean up images
    if (item.images && item.images.length > 0) {
      for (const img of item.images) {
        await deleteStoredImage(img);
      }
    }

    await Promise.all([
      ContactRequest.deleteMany({ item: item._id }),
      Report.deleteMany({ reportedItem: item._id }),
      Item.findByIdAndDelete(item._id),
    ]);

    res.status(200).json({
      success: true,
      message: 'Item removed successfully by campus moderator',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all submitted content reports
 * @route   GET /api/admin/reports
 * @access  Private (Admin)
 */
export const getAdminReports = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    const reports = await Report.find(query)
      .sort({ createdAt: -1 })
      .populate('reportedItem', 'title category type status images location')
      .populate('reportedBy', 'name email studentId department');

    res.status(200).json({
      success: true,
      data: {
        reports,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update report status (dismiss, resolve, review)
 * @route   PATCH /api/admin/reports/:id
 * @access  Private (Admin)
 */
export const updateReportStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['pending', 'reviewed', 'dismissed', 'resolved'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid report status value',
      });
    }

    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    report.status = status;
    await report.save();

    res.status(200).json({
      success: true,
      message: `Report marked as ${status}`,
      data: {
        report,
      },
    });
  } catch (error) {
    next(error);
  }
};

