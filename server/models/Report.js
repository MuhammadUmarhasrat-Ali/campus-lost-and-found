import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    reportedItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required: true,
      index: true,
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    reason: {
      type: String,
      required: [true, 'Please provide a reason for the report'],
      enum: ['inappropriate', 'spam', 'duplicate', 'offensive', 'fraud', 'other'],
    },
    description: {
      type: String,
      required: [true, 'Please provide details about this report'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'dismissed', 'resolved'],
      default: 'pending',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const Report = mongoose.model('Report', reportSchema);
export default Report;

