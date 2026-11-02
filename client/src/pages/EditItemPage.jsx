import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
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

const editItemSchema = z.object({
  title: z.string().min(3, 'Item title must be at least 3 characters').max(120),
  category: z.string().min(1, 'Please select a category'),
  type: z.enum(['lost', 'found']),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000),
  location: z.string().min(2, 'Location is required'),
  eventDate: z.string().min(1, 'Date is required'),
  eventTime: z.string().optional(),
  additionalDetails: z.string().optional(),
  contactPreference: z.enum(['in_app', 'email', 'phone', 'any']),
  status: z.enum(['active', 'claimed', 'resolved', 'closed']),
});

export const EditItemPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();

  const [existingImages, setExistingImages] = useState([]);
  const [removeImageIds, setRemoveImageIds] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(editItemSchema),
  });

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/items/${id}`);
        const itm = data.data.item;

        reset({
          title: itm.title,
          category: itm.category,
          type: itm.type,
          description: itm.description,
          location: itm.location,
          eventDate: itm.eventDate ? itm.eventDate.split('T')[0] : '',
          eventTime: itm.eventTime || '',
          additionalDetails: itm.additionalDetails || '',
          contactPreference: itm.contactPreference || 'in_app',
          status: itm.status || 'active',
        });

        if (itm.images) {
          setExistingImages(itm.images);
        }
      } catch (err) {
        toastError(err.message || 'Could not load item for editing');
        navigate('/browse');
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id, reset, navigate, toastError]);

  const handleRemoveExisting = (publicId) => {
    setExistingImages((prev) => prev.filter((img) => img.publicId !== publicId));
    setRemoveImageIds((prev) => [...prev, publicId]);
  };

  const onSubmit = async (formDataValues) => {
    setSaving(true);
    try {
      const formData = new FormData();
      Object.entries(formDataValues).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          formData.append(key, val);
        }
      });

      // Pass publicIds to remove
      removeImageIds.forEach((idToRemove) => {
        formData.append('removeImageIds', idToRemove);
      });

      // Pass newly selected image files
      newImages.forEach((file) => {
        formData.append('images', file);
      });

      await api.put(`/items/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      success('Post updated successfully!');
      navigate(`/items/${id}`);
    } catch (err) {
      toastError(err.message || 'Failed to update item');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#8B45E8] animate-spin mb-3" />
        <p className="text-xs text-[#858585]">Loading post for editing...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#858585] hover:text-[#252525] transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Cancel & Go Back</span>
      </button>

      <div className="bg-white rounded-3xl border border-[#E8E8ED] shadow-sm p-6 sm:p-10 space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#252525]">
            Edit Item Post
          </h1>
          <p className="text-xs sm:text-sm text-[#858585] mt-1.5">
            Update listing details, status, or replace uploaded photographs.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-[#252525] uppercase tracking-wider mb-1.5">
              Item Title <span className="text-[#E84383]">*</span>
            </label>
            <input
              type="text"
              {...register('title')}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E8E8ED] bg-[#F7F7FA] text-sm text-[#252525] focus:outline-none focus:ring-2 focus:ring-[#8B45E8]/30 focus:border-[#8B45E8] focus:bg-white"
            />
            {errors.title && (
              <p className="text-xs text-[#E84383] mt-1">{errors.title.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#252525] uppercase tracking-wider mb-1.5">
                Post Type
              </label>
              <select
                {...register('type')}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E8E8ED] bg-[#F7F7FA] text-sm text-[#252525] focus:outline-none focus:ring-2 focus:ring-[#8B45E8]/30 focus:border-[#8B45E8] focus:bg-white"
              >
                <option value="lost">Lost Item</option>
                <option value="found">Found Item</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#252525] uppercase tracking-wider mb-1.5">
                Category
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
            </div>

            <div>
              <label className="block text-xs font-bold text-[#252525] uppercase tracking-wider mb-1.5">
                Current Status
              </label>
              <select
                {...register('status')}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E8E8ED] bg-[#F7F7FA] text-sm text-[#252525] focus:outline-none focus:ring-2 focus:ring-[#8B45E8]/30 focus:border-[#8B45E8] focus:bg-white"
              >
                <option value="active">Active</option>
                <option value="claimed">Claimed</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#252525] uppercase tracking-wider mb-1.5">
                Campus Location <span className="text-[#E84383]">*</span>
              </label>
              <input
                type="text"
                {...register('location')}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E8E8ED] bg-[#F7F7FA] text-sm text-[#252525] focus:outline-none focus:ring-2 focus:ring-[#8B45E8]/30 focus:border-[#8B45E8] focus:bg-white"
              />
              {errors.location && (
                <p className="text-xs text-[#E84383] mt-1">{errors.location.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#252525] uppercase tracking-wider mb-1.5">
                Event Date <span className="text-[#E84383]">*</span>
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
          </div>

          <div>
            <label className="block text-xs font-bold text-[#252525] uppercase tracking-wider mb-1.5">
              Description <span className="text-[#E84383]">*</span>
            </label>
            <textarea
              rows={4}
              {...register('description')}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E8E8ED] bg-[#F7F7FA] text-sm text-[#252525] focus:outline-none focus:ring-2 focus:ring-[#8B45E8]/30 focus:border-[#8B45E8] focus:bg-white resize-none"
            />
            {errors.description && (
              <p className="text-xs text-[#E84383] mt-1">{errors.description.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-[#252525] uppercase tracking-wider mb-1.5">
              Additional Details / Notes
            </label>
            <input
              type="text"
              {...register('additionalDetails')}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E8E8ED] bg-[#F7F7FA] text-sm text-[#252525] focus:outline-none focus:ring-2 focus:ring-[#8B45E8]/30 focus:border-[#8B45E8] focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#252525] uppercase tracking-wider mb-1.5">
              Photographs
            </label>
            <ImageUpload
              files={newImages}
              setFiles={setNewImages}
              existingImages={existingImages}
              onRemoveExisting={handleRemoveExisting}
              maxFiles={4}
            />
          </div>

          <div className="pt-4 border-t border-[#E8E8ED] flex items-center justify-end gap-3">
            <Button
              variant="secondary"
              size="md"
              onClick={() => navigate(-1)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={saving}
              className="px-8"
            >
              <Save className="w-4 h-4 mr-1.5" />
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditItemPage;

