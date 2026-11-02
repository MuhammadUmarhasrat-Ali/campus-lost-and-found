import mongoose from 'mongoose';

export const ITEM_CATEGORIES = [
  'Electronics',
  'Books and Notes',
  'Bags',
  'Clothing',
  'Accessories',
  'ID Cards',
  'Keys',
  'Water Bottles',
  'Other',
];

const imageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      default: '',
    },
  },
  { _id: false }
);

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide item title / name'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide detailed description'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Please select item category'],
      enum: ITEM_CATEGORIES,
      index: true,
    },
    type: {
      type: String,
      required: [true, 'Please specify if item is lost or found'],
      enum: ['lost', 'found'],
      index: true,
    },
    images: {
      type: [imageSchema],
      default: [],
    },
    location: {
      type: String,
      required: [true, 'Please specify campus location (e.g. Lab 3, Library 2nd Floor, Cafeteria)'],
      trim: true,
      index: true,
    },
    eventDate: {
      type: Date,
      required: [true, 'Please specify date'],
      index: true,
    },
    eventTime: {
      type: String,
      trim: true,
      default: '',
    },
    additionalDetails: {
      type: String,
      trim: true,
      default: '',
    },
    contactPreference: {
      type: String,
      enum: ['in_app', 'email', 'phone', 'any'],
      default: 'in_app',
    },
    status: {
      type: String,
      enum: ['active', 'claimed', 'resolved', 'closed'],
      default: 'active',
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound text index for powerful partial and text search
itemSchema.index({
  title: 'text',
  description: 'text',
  location: 'text',
  category: 'text',
});

const Item = mongoose.model('Item', itemSchema);
export default Item;

