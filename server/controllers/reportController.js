import Report from '../models/Report.js';
import Item from '../models/Item.js';
import { createReportSchema } from '../validators/itemValidator.js';

/**
 * @desc    Submit an inappropriate content / fraud report
 * @route   POST /api/reports
 * @access  Private
 */
export const createReport = async (req, res, next) => {
  try {
    const parseResult = createReportSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        message: parseResult.error.errors[0].message,
      });
    }

    const { itemId, reason, description } = parseResult.data;

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    const report = await Report.create({
      reportedItem: itemId,
      reportedBy: req.user._id,
      reason,
      description,
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for your report. Campus moderators will review it promptly.',
      data: {
        report,
      },
    });
  } catch (error) {
    next(error);
  }
};

