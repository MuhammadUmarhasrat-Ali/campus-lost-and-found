import Item from '../models/Item.js';
import ContactRequest from '../models/ContactRequest.js';
import Report from '../models/Report.js';
import {
  createItemSchema,
  updateItemSchema,
  updateItemStatusSchema,
} from '../validators/itemValidator.js';
import { processUploadedFiles, deleteStoredImage } from '../middleware/uploadMiddleware.js';

/**
 * @desc    Get all items with search, filter, sort and pagination
 * @route   GET /api/items
 * @access  Public
 */
export const getItems = async (req, res, next) => {
  try {
    const {
      search,
      category,
      type,
      location,
      status,
      startDate,
      endDate,
      sort = 'newest',
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};

    // Search query across title, description, and location
    if (search && search.trim() !== '') {
      const sanitized = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.$or = [
        { title: { $regex: sanitized, $options: 'i' } },
        { description: { $regex: sanitized, $options: 'i' } },
        { location: { $regex: sanitized, $options: 'i' } },
      ];
    }

    // Filter by Category
    if (category && category !== 'All') {
      query.category = category;
    }

    // Filter by Type (lost / found)
    if (type && ['lost', 'found'].includes(type.toLowerCase())) {
      query.type = type.toLowerCase();
    }

    // Filter by Location
    if (location && location.trim() !== '') {
      query.location = { $regex: location.trim(), $options: 'i' };
    }

    // Filter by Status (exclude claimed/resolved unless explicitly requested)
    if (status && status.trim() !== '' && status.toLowerCase() !== 'all') {
      query.status = status.toLowerCase();
    } else {
      query.status = { $nin: ['resolved', 'claimed', 'Resolved', 'Claimed'] };
    }

    // Filter by Date range
    if (startDate || endDate) {
      query.eventDate = {};
      if (startDate) {
        query.eventDate.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.eventDate.$lte = end;
      }
    }

    // Sorting
    let sortOptions = { createdAt: -1 };
    if (sort === 'oldest') {
      sortOptions = { createdAt: 1 };
    } else if (sort === 'eventDate_desc') {
      sortOptions = { eventDate: -1 };
    } else if (sort === 'eventDate_asc') {
      sortOptions = { eventDate: 1 };
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 12));
    const skip = (pageNum - 1) * limitNum;

    const totalItems = await Item.countDocuments(query);
    const items = await Item.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .populate('user', 'name department academicYear studentId')
      .lean();

    const totalPages = Math.ceil(totalItems / limitNum) || 1;

    res.status(200).json({
      success: true,
      data: {
        items,
        pagination: {
          totalItems,
          totalPages,
          currentPage: pageNum,
          limit: limitNum,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get real statistics for landing page and dashboard
 * @route   GET /api/items/stats
 * @access  Public
 */
export const getStats = async (req, res, next) => {
  try {
    const [totalLost, totalFound, activePosts, resolvedItems] = await Promise.all([
      Item.countDocuments({ type: 'lost' }),
      Item.countDocuments({ type: 'found' }),
      Item.countDocuments({ status: 'active' }),
      Item.countDocuments({ status: { $in: ['claimed', 'resolved'] } }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalLost,
        totalFound,
        activePosts,
        resolvedItems,
        totalItems: totalLost + totalFound,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single item details
 * @route   GET /api/items/:id
 * @access  Public
 */
export const getItemById = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id).populate(
      'user',
      'name email phone department academicYear studentId'
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item post not found',
      });
    }

    // Privacy protection:
    // If requester is not logged in or is not the poster/admin, respect privacy
    const isOwner = req.user && req.user._id.toString() === item.user._id.toString();
    const isAdmin = req.user && req.user.role === 'admin';

    const itemObj = item.toObject();

    // If contact preference is strictly in-app or user is not logged in, mask phone/email
    if (!isOwner && !isAdmin) {
      if (!req.user || item.contactPreference === 'in_app') {
        itemObj.user = {
          _id: item.user._id,
          name: item.user.name,
          department: item.user.department,
          academicYear: item.user.academicYear,
          isPosterMasked: true,
        };
      }
    }

    res.status(200).json({
      success: true,
      data: {
        item: itemObj,
        isOwner: Boolean(isOwner),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new lost or found item
 * @route   POST /api/items
 * @access  Private (Student/Admin)
 */
export const createItem = async (req, res, next) => {
  try {
    const parseResult = createItemSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        message: parseResult.error.errors[0].message,
        errors: parseResult.error.flatten().fieldErrors,
      });
    }

    const {
      title,
      description,
      category,
      type,
      location,
      eventDate,
      eventTime,
      additionalDetails,
      contactPreference,
    } = parseResult.data;

    // Process uploaded images (if any)
    let uploadedImages = [];
    if (req.files && req.files.length > 0) {
      uploadedImages = await processUploadedFiles(req.files);
    }

    const item = await Item.create({
      title,
      description,
      category,
      type,
      images: uploadedImages,
      location,
      eventDate: new Date(eventDate),
      eventTime: eventTime || '',
      additionalDetails: additionalDetails || '',
      contactPreference: contactPreference || 'in_app',
      status: 'active',
      user: req.user._id,
    });

    const populatedItem = await Item.findById(item._id).populate(
      'user',
      'name department academicYear studentId'
    );

    res.status(201).json({
      success: true,
      message: `${type === 'lost' ? 'Lost' : 'Found'} item reported successfully`,
      data: {
        item: populatedItem,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an existing item
 * @route   PUT /api/items/:id
 * @access  Private (Owner / Admin)
 */
export const updateItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item post not found',
      });
    }

    // Check ownership or admin
    const isOwner = item.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to edit this item',
      });
    }

    const parseResult = updateItemSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        message: parseResult.error.errors[0].message,
      });
    }

    const data = parseResult.data;

    // Update fields
    if (data.title) item.title = data.title;
    if (data.description) item.description = data.description;
    if (data.category) item.category = data.category;
    if (data.type) item.type = data.type;
    if (data.location) item.location = data.location;
    if (data.eventDate) item.eventDate = new Date(data.eventDate);
    if (data.eventTime !== undefined) item.eventTime = data.eventTime;
    if (data.additionalDetails !== undefined) item.additionalDetails = data.additionalDetails;
    if (data.contactPreference) item.contactPreference = data.contactPreference;
    if (data.status) item.status = data.status;

    // If new files were uploaded, add them
    if (req.files && req.files.length > 0) {
      const newImages = await processUploadedFiles(req.files);
      item.images.push(...newImages);
    }

    // If requested to remove specific images
    if (req.body.removeImageIds) {
      const idsToRemove = Array.isArray(req.body.removeImageIds)
        ? req.body.removeImageIds
        : [req.body.removeImageIds];

      const retainedImages = [];
      for (const img of item.images) {
        if (idsToRemove.includes(img.publicId)) {
          await deleteStoredImage(img);
        } else {
          retainedImages.push(img);
        }
      }
      item.images = retainedImages;
    }

    await item.save();

    const updatedItem = await Item.findById(item._id).populate(
      'user',
      'name department academicYear studentId'
    );

    res.status(200).json({
      success: true,
      message: 'Item updated successfully',
      data: {
        item: updatedItem,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete an item post
 * @route   DELETE /api/items/:id
 * @access  Private (Owner / Admin)
 */
export const deleteItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    const isOwner = item.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this post',
      });
    }

    // Delete all associated images
    if (item.images && item.images.length > 0) {
      for (const img of item.images) {
        await deleteStoredImage(img);
      }
    }

    // Remove associated contact requests and reports
    await Promise.all([
      ContactRequest.deleteMany({ item: item._id }),
      Report.deleteMany({ reportedItem: item._id }),
      Item.findByIdAndDelete(item._id),
    ]);

    res.status(200).json({
      success: true,
      message: 'Item post and associated data deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current user's posts
 * @route   GET /api/items/my-posts
 * @access  Private
 */
export const getMyPosts = async (req, res, next) => {
  try {
    const { type, status } = req.query;
    const query = { user: req.user._id };

    if (type && ['lost', 'found'].includes(type.toLowerCase())) {
      query.type = type.toLowerCase();
    }

    if (status && status !== 'all') {
      query.status = status.toLowerCase();
    }

    const items = await Item.find(query).sort({ createdAt: -1 });

    const totalLost = items.filter((i) => i.type === 'lost').length;
    const totalFound = items.filter((i) => i.type === 'found').length;
    const activeCount = items.filter((i) => i.status === 'active').length;
    const resolvedCount = items.filter((i) => ['claimed', 'resolved'].includes(i.status)).length;

    res.status(200).json({
      success: true,
      data: {
        items,
        counts: {
          total: items.length,
          lost: totalLost,
          found: totalFound,
          active: activeCount,
          resolved: resolvedCount,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Quickly update item status (active, claimed, resolved, closed)
 * @route   PATCH /api/items/:id/status
 * @access  Private (Owner / Admin)
 */
export const updateItemStatus = async (req, res, next) => {
  try {
    const parseResult = updateItemStatusSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        message: parseResult.error.errors[0].message,
      });
    }

    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    const isOwner = item.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update status of this item',
      });
    }

    item.status = parseResult.data.status;
    await item.save();

    res.status(200).json({
      success: true,
      message: `Item status updated to ${item.status}`,
      data: {
        item,
      },
    });
  } catch (error) {
    next(error);
  }
};

