import { z } from 'zod';
import { ITEM_CATEGORIES } from '../models/Item.js';

export const createItemSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(120),
  description: z.string().min(5, 'Description must be at least 5 characters').max(2000),
  category: z.enum(ITEM_CATEGORIES, {
    errorMap: () => ({ message: 'Please select a valid category' }),
  }),
  type: z.enum(['lost', 'found'], {
    errorMap: () => ({ message: 'Type must be lost or found' }),
  }),
  location: z.string().min(2, 'Location is required (e.g. Lab 3, Library)').max(150),
  eventDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Valid date is required',
  }),
  eventTime: z.string().optional().default(''),
  additionalDetails: z.string().optional().default(''),
  contactPreference: z.enum(['in_app', 'email', 'phone', 'any']).optional().default('in_app'),
});

export const updateItemSchema = createItemSchema.partial().extend({
  status: z.enum(['active', 'claimed', 'resolved', 'closed']).optional(),
});

export const updateItemStatusSchema = z.object({
  status: z.enum(['active', 'claimed', 'resolved', 'closed'], {
    errorMap: () => ({ message: 'Invalid status' }),
  }),
});

export const createContactRequestSchema = z.object({
  itemId: z.string().min(1, 'Item ID is required'),
  message: z.string().min(5, 'Message must be at least 5 characters').max(1000),
  phone: z.string().optional().default(''),
});

export const updateContactStatusSchema = z.object({
  status: z.enum(['pending', 'accepted', 'rejected', 'completed'], {
    errorMap: () => ({ message: 'Invalid contact request status' }),
  }),
});

export const createReportSchema = z.object({
  itemId: z.string().min(1, 'Item ID is required'),
  reason: z.enum(['inappropriate', 'spam', 'duplicate', 'offensive', 'fraud', 'other']),
  description: z.string().min(5, 'Description must be at least 5 characters').max(1000),
});

