import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Edit3,
  Trash2,
  Eye,
  PlusCircle,
  Clock,
  CheckCircle,
  MapPin,
  Calendar,
  Frown,
  Loader2,
} from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import { TypeBadge, StatusBadge, CategoryBadge } from '../components/common/Badge';
import Button from '../components/common/Button';
import ConfirmationModal from '../components/common/ConfirmationModal';
import { getImageUrl } from '../utils/imageUtils';

export const MyPostsPage = () => {
  const { success, error: toastError } = useToast();
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'lost', 'found', 'active', 'resolved'
  const [items, setItems] = useState([]);
  const [counts, setCounts] = useState({
    total: 0,
    lost: 0,
    found: 0,
    active: 0,
    resolved: 0,
  });
  const [loading, setLoading] = useState(true);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchMyPosts = useCallback(async () => {
    setLoading(true);
    try {
      let query = '';
      if (activeTab === 'lost' || activeTab === 'found') {
        query = `?type=${activeTab}`;
      } else if (activeTab === 'active') {
        query = `?status=active`;
      } else if (activeTab === 'resolved') {
        query = `?status=resolved`;
      }

      const { data } = await api.get(`/items/my-posts${query}`);
      if (data.data) {
        setItems(data.data.items);
        setCounts(data.data.counts);
      }
    } catch (err) {
      toastError(err.message || 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  }, [activeTab, toastError]);

  useEffect(() => {
    fetchMyPosts();
  }, [fetchMyPosts]);

  const handleStatusChange = async (itemId, newStatus) => {
    try {
      await api.patch(`/items/${itemId}/status`, { status: newStatus });
      success(`Status updated to ${newStatus}`);
      fetchMyPosts();
    } catch (err) {
      toastError(err.message || 'Failed to update status');
    }
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/items/${itemToDelete._id}`);
      success('Post deleted successfully');
      setDeleteModalOpen(false);
      setItemToDelete(null);
      fetchMyPosts();
    } catch (err) {
      toastError(err.message || 'Failed to delete post');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#252525] tracking-tight">
            My Campus Posts
          </h1>
          <p className="text-xs sm:text-sm text-[#858585] mt-1">
            Manage your reported lost and found items, update their status, or make edits.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/report-lost">
            <Button variant="danger" size="sm">
              <PlusCircle className="w-4 h-4 mr-1.5" />
              Report Lost
            </Button>
          </Link>
          <Link to="/report-found">
            <Button variant="primary" size="sm">
              <PlusCircle className="w-4 h-4 mr-1.5" />
              Report Found
            </Button>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E8E8ED] pb-px overflow-x-auto scrollbar-none">
        {[
          { id: 'all', label: 'All Posts', count: counts.total },
          { id: 'lost', label: 'Lost Items', count: counts.lost },
          { id: 'found', label: 'Found Items', count: counts.found },
          { id: 'active', label: 'Active Posts', count: counts.active },
          { id: 'resolved', label: 'Resolved / Claimed', count: counts.resolved },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'border-[#8B45E8] text-[#8B45E8]'
                  : 'border-transparent text-[#858585] hover:text-[#252525] hover:border-[#D5D5DF]'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                  isActive
                    ? 'bg-[#F1E9FA] text-[#8B45E8]'
                    : 'bg-[#F7F7FA] text-[#858585]'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Posts List */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#8B45E8] animate-spin mb-3" />
          <p className="text-xs text-[#858585]">Loading your posts...</p>
        </div>
      ) : items.length > 0 ? (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl border border-[#E8E8ED] p-4 sm:p-5 shadow-sm hover:border-[#8B45E8]/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Item Info */}
              <div className="flex items-start gap-4 flex-1">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#F1E9FA] overflow-hidden flex-shrink-0 border border-[#E8E8ED]">
                  {item.images?.[0]?.url ? (
                    <img
                      src={getImageUrl(item.images[0].url)}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-[#8B45E8]">
                      NO PHOTO
                    </div>
                  )}
                </div>

                <div className="space-y-1 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <TypeBadge type={item.type} />
                    <CategoryBadge category={item.category} />
                    <StatusBadge status={item.status} />
                  </div>

                  <h3 className="font-bold text-base text-[#252525] line-clamp-1">
                    {item.title}
                  </h3>

                  <p className="text-xs text-[#858585] line-clamp-1">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#858585] pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#8B45E8]" />
                      {item.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#4263EB]" />
                      {new Date(item.eventDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Selector & Actions */}
              <div className="flex flex-wrap items-center gap-2 pt-3 md:pt-0 border-t md:border-t-0 border-[#E8E8ED] self-end md:self-center">
                {/* Status Changer */}
                <select
                  value={item.status}
                  onChange={(e) => handleStatusChange(item._id, e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl border border-[#E8E8ED] bg-[#F7F7FA] text-xs font-semibold text-[#252525] focus:outline-none focus:ring-1 focus:ring-[#8B45E8]"
                >
                  <option value="active">Active</option>
                  <option value="claimed">Claimed</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>

                <Link to={`/items/${item._id}`}>
                  <Button variant="secondary" size="sm">
                    <Eye className="w-3.5 h-3.5 mr-1" />
                    View
                  </Button>
                </Link>

                <Link to={`/edit-item/${item._id}`}>
                  <Button variant="lavender" size="sm">
                    <Edit3 className="w-3.5 h-3.5 mr-1" />
                    Edit
                  </Button>
                </Link>

                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    setItemToDelete(item);
                    setDeleteModalOpen(true);
                  }}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[#F7F7FA] rounded-3xl border border-[#E8E8ED] py-16 px-4 text-center max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-[#F1E9FA] text-[#8B45E8] flex items-center justify-center mx-auto mb-4">
            <Frown className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-[#252525]">No Posts in this Category</h3>
          <p className="text-xs text-[#858585] mt-1.5 leading-relaxed max-w-xs mx-auto">
            You don't have any items under the "{activeTab}" filter.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link to="/report-lost">
              <Button variant="danger" size="sm">
                Report Lost Item
              </Button>
            </Link>
            <Link to="/report-found">
              <Button variant="primary" size="sm">
                Report Found Item
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={confirmDelete}
        isDanger={true}
        title="Delete Post"
        message={`Are you sure you want to permanently delete "${itemToDelete?.title}"? This cannot be undone.`}
        confirmText="Yes, Delete Post"
        isLoading={deleting}
      />
    </div>
  );
};

export default MyPostsPage;

