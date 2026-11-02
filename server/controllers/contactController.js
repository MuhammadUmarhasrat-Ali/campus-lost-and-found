import ContactRequest from '../models/ContactRequest.js';
import Item from '../models/Item.js';
import {
  createContactRequestSchema,
  updateContactStatusSchema,
} from '../validators/itemValidator.js';

/**
 * @desc    Submit a contact / claim request on an item
 * @route   POST /api/contact-requests
 * @access  Private
 */
export const createContactRequest = async (req, res, next) => {
  try {
    const parseResult = createContactRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        message: parseResult.error.errors[0].message,
      });
    }

    const { itemId, message, phone } = parseResult.data;

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item post not found',
      });
    }

    // Prevent requesting on one's own post
    if (item.user.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot send a contact request on your own posted item',
      });
    }

    // Check if duplicate pending request exists
    const existing = await ContactRequest.findOne({
      item: itemId,
      sender: req.user._id,
      status: 'pending',
    });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You already have a pending contact request for this item',
      });
    }

    const contactRequest = await ContactRequest.create({
      item: itemId,
      sender: req.user._id,
      recipient: item.user,
      message,
      phone: phone || req.user.phone || '',
      status: 'pending',
    });

    const populated = await ContactRequest.findById(contactRequest._id)
      .populate('item', 'title category type status images')
      .populate('sender', 'name email department academicYear phone')
      .populate('recipient', 'name email department academicYear');

    res.status(201).json({
      success: true,
      message: 'Contact request submitted successfully. The student will be notified.',
      data: {
        contactRequest: populated,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get contact requests using aggregation pipeline
 * @route   GET /api/contact-requests
 * @access  Public / Private
 */
export const getContactRequests = async (req, res, next) => {
  try {
    const pipeline = [
      {
        $lookup: {
          from: 'items',
          localField: 'item',
          foreignField: '_id',
          as: 'item_details'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'sender',
          foreignField: '_id',
          as: 'sender_details'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'recipient',
          foreignField: '_id',
          as: 'recipient_details'
        }
      },
      { $unwind: { path: '$item_details', preserveNullAndEmptyArrays: true } },
      { $unwind: { path: '$sender_details', preserveNullAndEmptyArrays: true } },
      { $unwind: { path: '$recipient_details', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          'sender_details.passwordHash': 0,
          'recipient_details.passwordHash': 0
        }
      }
    ];

    const contactRequests = await ContactRequest.aggregate(pipeline);

    res.status(200).json(contactRequests);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update status of a contact request (accept, reject, complete)
 * @route   PATCH /api/contact-requests/:id
 * @access  Private
 */
export const updateContactRequestStatus = async (req, res, next) => {
  try {
    const parseResult = updateContactStatusSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        message: parseResult.error.errors[0].message,
      });
    }

    const { status } = parseResult.data;
    const request = await ContactRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Contact request not found',
      });
    }

    // Only recipient can accept/reject; sender or recipient can mark completed
    const isRecipient = request.recipient.toString() === req.user._id.toString();
    const isSender = request.sender.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isRecipient && !isSender && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this contact request',
      });
    }

    if ((status === 'accepted' || status === 'rejected') && !isRecipient && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Only the item poster can accept or reject requests',
      });
    }

    request.status = status;
    await request.save();

    const populated = await ContactRequest.findById(request._id)
      .populate('item', 'title category type status images')
      .populate('sender', 'name email department academicYear phone')
      .populate('recipient', 'name email department academicYear phone');

    res.status(200).json({
      success: true,
      message: `Contact request marked as ${status}`,
      data: {
        contactRequest: populated,
      },
    });
  } catch (error) {
    next(error);
  }
};

