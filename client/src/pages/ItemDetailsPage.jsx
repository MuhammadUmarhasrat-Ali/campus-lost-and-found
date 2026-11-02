import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  Clock,
  User,
  Shield,
  MessageSquare,
  AlertTriangle,
  Edit3,
  Trash2,
  CheckCircle,
  ArrowLeft,
  Share2,
  Phone,
  Mail,
  Loader2,
  Image as ImageIcon,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { TypeBadge, StatusBadge, CategoryBadge } from '../components/common/Badge';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import ConfirmationModal from '../components/common/ConfirmationModal';

export const ItemDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { success, error: toastError } = useToast();

  const [item, setItem] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Modals state
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactMessage, setContactMessage] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [submittingContact, setSubmittingContact] = useState(false);

  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('inappropriate');
  const [reportDescription, setReportDescription] = useState('');
  const [submittingReport, setSubmittingReport] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/items/${id}`);
        if (data.data) {
          setItem(data.data.item);
          setIsOwner(data.data.isOwner);
        }
      } catch (err) {
        toastError(err.message || 'Item post not found');
        navigate('/browse');
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id, navigate, toastError]);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/items/${id}` } });
      return;
    }

    if (!contactMessage.trim()) {
      toastError('Please enter a message explaining your claim or inquiry.');
      return;
    }

    setSubmittingContact(true);
    try {
      await api.post('/contact-requests', {
        itemId: item._id,
        message: contactMessage.trim(),
        phone: contactPhone.trim(),
      });
      success('Contact request submitted! The student has been notified.');
      setContactModalOpen(false);
      setContactMessage('');
    } catch (err) {
      toastError(err.message);
    } finally {
      setSubmittingContact(false);
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/items/${id}` } });
      return;
    }

    if (!reportDescription.trim()) {
      toastError('Please provide details for your report.');
      return;
    }

    setSubmittingReport(true);
    try {
      await api.post('/reports', {
        itemId: item._id,
        reason: reportReason,
        description: reportDescription.trim(),
      });
      success('Thank you. Campus moderators have been notified.');
      setReportModalOpen(false);
      setReportDescription('');
    } catch (err) {
      toastError(err.message);
    } finally {
      setSubmittingReport(false);
    }
  };

  const handleDeleteItem = async () => {
    setDeleting(true);
    try {
      await api.delete(`/items/${item._id}`);
      success('Post deleted successfully');
      navigate('/browse');
    } catch (err) {
      toastError(err.message);
      setDeleting(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    setUpdatingStatus(true);
    try {
      const { data } = await api.patch(`/items/${item._id}/status`, {
        status: newStatus,
      });
      setItem((prev) => ({ ...prev, status: data.data.item.status }));
      success(`Status updated to "${newStatus}"`);
    } catch (err) {
      toastError(err.message);
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#8B45E8] animate-spin mb-3" />
        <p className="text-xs text-[#858585]">Loading item details...</p>
      </div>
    );
  }

  if (!item) return null;

  const formattedDate = item.eventDate
    ? new Date(item.eventDate).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Unknown date';

  const hasImages = item.images && item.images.length > 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#858585] hover:text-[#252525] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to listings</span>
        </button>

        {/* Share Button */}
        <button
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            success('Post link copied to clipboard!');
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E8E8ED] bg-white text-xs font-medium text-[#252525] hover:bg-[#F7F7FA] transition-colors cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share Link</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[4/3] rounded-3xl bg-[#F1E9FA] border border-[#E8E8ED] overflow-hidden shadow-sm">
            {hasImages ? (
              <img
                src={item.images[activeImageIndex]?.url}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-[#858585] bg-[#F7F7FA]">
                <ImageIcon className="w-16 h-16 opacity-30 mb-2" />
                <span className="text-xs font-semibold opacity-60">No image provided</span>
              </div>
            )}

            <div className="absolute top-4 left-4">
              <TypeBadge type={item.type} size="lg" />
            </div>
            <div className="absolute top-4 right-4">
              <StatusBadge status={item.status} />
            </div>
          </div>

          {/* Thumbnails if multiple images */}
          {hasImages && item.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {item.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    activeImageIndex === idx
                      ? 'border-[#8B45E8] shadow-sm'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img.url}
                    alt="Thumbnail"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Additional details card */}
          {item.additionalDetails && (
            <div className="p-5 rounded-2xl bg-[#F7F7FA] border border-[#E8E8ED] space-y-1.5">
              <h4 className="text-xs font-bold text-[#858585] uppercase tracking-wider">
                Identifying Marks & Notes
              </h4>
              <p className="text-xs text-[#252525] leading-relaxed whitespace-pre-line">
                {item.additionalDetails}
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Information, Poster & Actions */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-[#E8E8ED] p-6 shadow-sm space-y-6">
            <div>
              <div className="mb-2.5">
                <CategoryBadge category={item.category} />
              </div>

              <h1 className="text-xl sm:text-2xl font-extrabold text-[#252525] leading-tight">
                {item.title}
              </h1>

              <p className="text-xs sm:text-sm text-[#858585] mt-3 leading-relaxed whitespace-pre-line">
                {item.description}
              </p>
            </div>

            {/* Quick Meta Grid */}
            <div className="py-4 border-y border-[#E8E8ED] space-y-2.5 text-xs">
              <div className="flex items-start gap-2.5 text-[#252525]">
                <MapPin className="w-4 h-4 text-[#8B45E8] mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-[11px] text-[#858585] block font-semibold uppercase">
                    Campus Location
                  </span>
                  <span className="font-bold">{item.location}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-[#252525]">
                <Calendar className="w-4 h-4 text-[#4263EB] mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-[11px] text-[#858585] block font-semibold uppercase">
                    {item.type === 'lost' ? 'Lost Date' : 'Found Date'}
                  </span>
                  <span className="font-bold">{formattedDate}</span>
                </div>
              </div>

              {item.eventTime && (
                <div className="flex items-start gap-2.5 text-[#252525]">
                  <Clock className="w-4 h-4 text-[#858585] mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-[11px] text-[#858585] block font-semibold uppercase">
                      Approximate Time
                    </span>
                    <span className="font-bold">{item.eventTime}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Poster Details with Privacy Safeguards */}
            <div className="p-4 rounded-2xl bg-[#F1E9FA]/60 border border-[#8B45E8]/20 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#4263EB] to-[#8B45E8] text-white font-bold flex items-center justify-center flex-shrink-0">
                  {item.user?.name?.charAt(0) || 'S'}
                </div>
                <div className="flex-1 truncate">
                  <p className="text-xs font-bold text-[#252525] truncate">
                    {item.user?.name}
                  </p>
                  <p className="text-[11px] text-[#858585] truncate">
                    {item.user?.department} • {item.user?.academicYear}
                  </p>
                </div>
              </div>

              {/* Verified Direct Contact (if allowed by preference) */}
              {!item.user?.isPosterMasked && (
                <div className="pt-2 border-t border-[#8B45E8]/10 space-y-1.5 text-xs text-[#252525]">
                  {item.user?.email && (
                    <div className="flex items-center gap-2 text-[11px] text-[#858585]">
                      <Mail className="w-3.5 h-3.5 text-[#8B45E8]" />
                      <span className="font-medium truncate">{item.user.email}</span>
                    </div>
                  )}
                  {item.user?.phone && (
                    <div className="flex items-center gap-2 text-[11px] text-[#858585]">
                      <Phone className="w-3.5 h-3.5 text-[#16B978]" />
                      <span className="font-medium">{item.user.phone}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {isOwner ? (
                /* Owner Controls */
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#858585]">Change Status:</span>
                    <select
                      value={item.status}
                      disabled={updatingStatus}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      className="px-3 py-1.5 rounded-xl border border-[#E8E8ED] bg-[#F7F7FA] text-xs font-bold focus:outline-none focus:ring-1 focus:ring-[#8B45E8]"
                    >
                      <option value="active">Active</option>
                      <option value="claimed">Claimed</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link to={`/edit-item/${item._id}`} className="flex-1">
                      <Button variant="secondary" size="md" className="w-full">
                        <Edit3 className="w-4 h-4 mr-1.5" />
                        Edit Post
                      </Button>
                    </Link>
                    <Button
                      variant="danger"
                      size="md"
                      onClick={() => setDeleteModalOpen(true)}
                      className="flex-1"
                    >
                      <Trash2 className="w-4 h-4 mr-1.5" />
                      Delete Post
                    </Button>
                  </div>
                </div>
              ) : (
                /* Non-owner / Student Contact */
                <div className="space-y-2.5">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full"
                    onClick={() => {
                      if (!isAuthenticated) {
                        navigate('/login', { state: { from: `/items/${id}` } });
                      } else {
                        setContactModalOpen(true);
                      }
                    }}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    {item.type === 'lost' ? 'I Found This Item (Contact Owner)' : 'Claim This Item (Contact Finder)'}
                  </Button>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => {
                        if (!isAuthenticated) {
                          navigate('/login', { state: { from: `/items/${id}` } });
                        } else {
                          setReportModalOpen(true);
                        }
                      }}
                      className="inline-flex items-center gap-1.5 text-xs text-[#858585] hover:text-[#E84383] transition-colors cursor-pointer"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Report Inappropriate Content</span>
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => setDeleteModalOpen(true)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E84383] hover:underline cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Admin Remove</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Request Modal */}
      <Modal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        title={item.type === 'lost' ? 'Notify Owner About Found Item' : 'Claim Item & Contact Finder'}
      >
        <form onSubmit={handleContactSubmit} className="space-y-4">
          <p className="text-xs text-[#858585] leading-relaxed">
            Send a direct message to the student who posted this item. Mention identifying details,
            marks, or where you can meet up on campus.
          </p>

          <div>
            <label className="block text-xs font-bold text-[#252525] mb-1.5">
              Your Message <span className="text-[#E84383]">*</span>
            </label>
            <textarea
              rows={4}
              required
              placeholder="e.g. Hello, I believe this is mine. It has my roll number written inside the case..."
              value={contactMessage}
              onChange={(e) => setContactMessage(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E8ED] bg-[#F7F7FA] text-xs text-[#252525] focus:outline-none focus:ring-2 focus:ring-[#8B45E8]/30 focus:border-[#8B45E8] focus:bg-white resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#252525] mb-1.5">
              Your Contact Phone Number (Optional)
            </label>
            <input
              type="tel"
              placeholder="e.g. 9876543210"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E8ED] bg-[#F7F7FA] text-xs text-[#252525] focus:outline-none focus:ring-2 focus:ring-[#8B45E8]/30 focus:border-[#8B45E8] focus:bg-white"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setContactModalOpen(false)}
              disabled={submittingContact}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={submittingContact}
            >
              Send Request
            </Button>
          </div>
        </form>
      </Modal>

      {/* Report Modal */}
      <Modal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        title="Report Content to Campus Moderators"
      >
        <form onSubmit={handleReportSubmit} className="space-y-4">
          <p className="text-xs text-[#858585] leading-relaxed">
            If this post contains inappropriate language, spam, incorrect information or fraudulent claims,
            let the administrative team know.
          </p>

          <div>
            <label className="block text-xs font-bold text-[#252525] mb-1.5">
              Reason for Report
            </label>
            <select
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#E8E8ED] bg-[#F7F7FA] text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#8B45E8]"
            >
              <option value="inappropriate">Inappropriate content or photo</option>
              <option value="spam">Spam or commercial advertisement</option>
              <option value="duplicate">Duplicate post</option>
              <option value="offensive">Harassment or offensive language</option>
              <option value="fraud">Fraudulent or fake claim</option>
              <option value="other">Other issue</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#252525] mb-1.5">
              Additional Details <span className="text-[#E84383]">*</span>
            </label>
            <textarea
              rows={3}
              required
              placeholder="Explain why this post should be reviewed or removed..."
              value={reportDescription}
              onChange={(e) => setReportDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E8ED] bg-[#F7F7FA] text-xs text-[#252525] focus:outline-none focus:ring-2 focus:ring-[#8B45E8]/30 focus:border-[#8B45E8] focus:bg-white resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setReportModalOpen(false)}
              disabled={submittingReport}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="danger"
              size="sm"
              isLoading={submittingReport}
            >
              Submit Report
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteItem}
        isDanger={true}
        title="Delete Item Post"
        message="Are you sure you want to permanently delete this post? All photos, comments, and claim requests associated with it will be removed."
        confirmText="Yes, Delete Post"
        isLoading={deleting}
      />
    </div>
  );
};

export default ItemDetailsPage;

