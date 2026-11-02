import mongoose from 'mongoose';

const contactRequestSchema = new mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required: true,
      index: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    message: {
      type: String,
      required: [true, 'Please provide a message explaining your claim or inquiry'],
      trim: true,
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'completed'],
      default: 'pending',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate pending requests from same sender for same item
contactRequestSchema.index({ item: 1, sender: 1, status: 1 });

const ContactRequest = mongoose.model('ContactRequest', contactRequestSchema);
export default ContactRequest;

