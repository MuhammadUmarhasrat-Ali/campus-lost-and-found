import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Send, ShieldAlert } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import ImageUpload from '../components/common/ImageUpload';
import Button from '../components/common/Button';

const ITEM_CATEGORIES = [
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

const reportFoundSchema = z.object({
  title: z
    .string()
    .min(3, 'Item title must be at least 3 characters')
    .max(120),
  category: z.string().min(1, 'Please select a category'),
  description: z
    .string()
    .min(10, 'Please provide at least 10 characters describing the found item')
    .max(2000),
  location: z
    .string()
    .min(2, 'Please specify where you found this item (e.g. Cafeteria Table 4, Lab 2)'),
  eventDate: z.string().min(1, 'Date found is required'),
  eventTime: z.string().optional(),
  additionalDetails: z.string().optional(),
  contactPreference: z.enum(['in_app', 'email', 'phone', 'any']).default('in_app'),
});

export const ReportFoundPage = () => {
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(reportFoundSchema),
    defaultValues: {
      category: 'Electronics',
      contactPreference: 'in_app',
      eventDate: new Date().toISOString().split('T')[0],
      eventTime: '',
    },
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('category', data.category);
      formData.append('description', data.description);
      formData.append('type', 'found');
      formData.append('location', data.location);
      formData.append('eventDate', data.eventDate);
      if (data.eventTime) formData.append('eventTime', data.eventTime);
      if (data.additionalDetails)
        formData.append('additionalDetails', data.additionalDetails);
      formData.append('contactPreference', data.contactPreference);

      images.forEach((file) => {
        formData.append('images', file);
      });

      const res = await api.post('/items', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      success('Found item reported successfully! Thank you for helping.');
      navigate(`/items/${res.data.data.item._id}`);
    } catch (err) {
      toastError(err.message || 'Failed to submit report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#858585] hover:text-[#252525] transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Cancel & Go Back</span>
      </button>

      {/* Safety Prompt */}
      <div className="bg-[#E6F9F1]/60 border border-[#16B978]/30 rounded-2xl p-4 flex items-start gap-3 text-xs text-[#252525]">
        <ShieldAlert className="w-5 h-5 text-[#16B978] flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-[#16B978] block">Helpful Campus Tip</span>
          <p className="mt-0.5 text-[#858585] leading-relaxed">
            If you found valuable belongings like smart wallets, passports, or keys, you can also notify the
            Campus Main Security Gate so they have an official record.
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-3xl border border-[#E8E8ED] shadow-sm p-6 sm:p-10 space-y-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6F9F1] text-[#16B978] text-xs font-bold mb-3">
            <span className="w-2 h-2 rounded-full bg-[#16B978]" />
            Found Item Registration
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#252525]">
            Report a Found Item
          </h1>
          <p className="text-xs sm:text-sm text-[#858585] mt-1.5 leading-relaxed">
            Help the rightful student owner recover their property by listing what you found.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-[#252525] uppercase tracking-wider mb-1.5">
              Item Title / Name <span className="text-[#E84383]">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Dell 65W USB-C Laptop Charger, Milton Water Bottle"
              {...register('title')}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E8E8ED] bg-[#F7F7FA] text-sm text-[#252525] focus:outline-none focus:ring-2 focus:ring-[#8B45E8]/30 focus:border-[#8B45E8] focus:bg-white"
            />
            {errors.title && (
              <p className="text-xs text-[#E84383] mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Category & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#252525] uppercase tracking-wider mb-1.5">
                Category <span className="text-[#E84383]">*</span>
              </label>
              <select
                {...register('category')}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E8E8ED] bg-[#F7F7FA] text-sm text-[#252525] focus:outline-none focus:ring-2 focus:ring-[#8B45E8]/30 focus:border-[#8B45E8] focus:bg-white"
              >
                {ITEM_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-xs text-[#E84383] mt-1">{errors.category.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#252525] uppercase tracking-wider mb-1.5">
                Where Did You Find It? <span className="text-[#E84383]">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Central Library 2nd Floor, Main Cafeteria"
                {...register('location')}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E8E8ED] bg-[#F7F7FA] text-sm text-[#252525] focus:outline-none focus:ring-2 focus:ring-[#8B45E8]/30 focus:border-[#8B45E8] focus:bg-white"
              />
              {errors.location && (
                <p className="text-xs text-[#E84383] mt-1">{errors.location.message}</p>
              )}
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#252525] uppercase tracking-wider mb-1.5">
                Date Found <span className="text-[#E84383]">*</span>
              </label>
              <input
                type="date"
                {...register('eventDate')}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E8E8ED] bg-[#F7F7FA] text-sm text-[#252525] focus:outline-none focus:ring-2 focus:ring-[#8B45E8]/30 focus:border-[#8B45E8] focus:bg-white"
              />
              {errors.eventDate && (
                <p className="text-xs text-[#E84383] mt-1">{errors.eventDate.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#252525] uppercase tracking-wider mb-1.5">
                Approximate Time (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. 11:30 AM, Morning break"
                {...register('eventTime')}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E8E8ED] bg-[#F7F7FA] text-sm text-[#252525] focus:outline-none focus:ring-2 focus:ring-[#8B45E8]/30 focus:border-[#8B45E8] focus:bg-white"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-[#252525] uppercase tracking-wider mb-1.5">
              Description <span className="text-[#E84383]">*</span>
            </label>
            <textarea
              rows={4}
              placeholder="Describe where you found it, condition, packaging, general appearance..."
              {...register('description')}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E8E8ED] bg-[#F7F7FA] text-sm text-[#252525] focus:outline-none focus:ring-2 focus:ring-[#8B45E8]/30 focus:border-[#8B45E8] focus:bg-white resize-none"
            />
            {errors.description && (
              <p className="text-xs text-[#E84383] mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Additional details */}
          <div>
            <label className="block text-xs font-bold text-[#252525] uppercase tracking-wider mb-1.5">
              Holding Location or Handover Details (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Kept safely with me in Room 204 or submitted to Library Reception"
              {...register('additionalDetails')}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E8E8ED] bg-[#F7F7FA] text-sm text-[#252525] focus:outline-none focus:ring-2 focus:ring-[#8B45E8]/30 focus:border-[#8B45E8] focus:bg-white"
            />
          </div>

          {/* Contact Preference */}
          <div>
            <label className="block text-xs font-bold text-[#252525] uppercase tracking-wider mb-1.5">
              Contact Preference
            </label>
            <select
              {...register('contactPreference')}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E8E8ED] bg-[#F7F7FA] text-sm text-[#252525] focus:outline-none focus:ring-2 focus:ring-[#8B45E8]/30 focus:border-[#8B45E8] focus:bg-white"
            >
              <option value="in_app">
                In-App Contact Requests (Recommended: Screen claims before meeting)
              </option>
              <option value="email">College Email & In-App</option>
              <option value="phone">Phone & In-App</option>
              <option value="any">Display Phone & Email Publicly</option>
            </select>
          </div>

          {/* Image Upload Component */}
          <div>
            <label className="block text-xs font-bold text-[#252525] uppercase tracking-wider mb-1.5">
              Photograph of Found Item
            </label>
            <ImageUpload files={images} setFiles={setImages} maxFiles={4} />
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-[#E8E8ED] flex items-center justify-end gap-3">
            <Button
              variant="secondary"
              size="md"
              onClick={() => navigate(-1)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={submitting}
              className="px-8"
            >
              <Send className="w-4 h-4 mr-1.5" />
              Publish Found Item
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportFoundPage;

