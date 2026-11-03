import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Phone,
  Mail,
  ArrowRight,
  ShieldCheck,
  Loader2,
  Inbox,
  Send,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/common/Button';
import { TypeBadge } from '../components/common/Badge';
import { getImageUrl } from '../utils/imageUtils';

export const ContactRequestsPage = () => {
  const { user } = useAuth();
  const { success, error: toastError } = useToast();
  const [activeTab, setActiveTab] = useState('incoming'); // 'incoming' | 'outgoing'
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/contact-requests');
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
        ? data.data
        : data?.data?.incoming || [];

      if (user) {
        const userId = user._id.toString();
        const inc = list.filter(
          (r) =>
            (r.recipient_details?._id || r.recipient?._id || r.recipient)?.toString() === userId
        );
        const out = list.filter(
          (r) =>
            (r.sender_details?._id || r.sender?._id || r.sender)?.toString() === userId
        );
        setIncoming(inc.length > 0 || out.length > 0 ? inc : list);
        setOutgoing(out);
      } else {
        setIncoming(list);
        setOutgoing([]);
      }
    } catch (err) {
      toastError(err.message || 'Failed to fetch contact requests');
    } finally {
      setLoading(false);
    }
  }, [user, toastError]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleUpdateStatus = async (requestId, newStatus) => {
    try {
      await api.patch(`/contact-requests/${requestId}`, { status: newStatus });
      success(`Request marked as ${newStatus}`);
      fetchRequests();
    } catch (err) {
      toastError(err.message || 'Failed to update request');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E6F9F1] text-[#16B978]">
            <CheckCircle className="w-3.5 h-3.5" /> Accepted
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FDECF3] text-[#E84383]">
            <XCircle className="w-3.5 h-3.5" /> Declined
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-[#4263EB]">
            <ShieldCheck className="w-3.5 h-3.5" /> Handed Over
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#F1E9FA] text-[#8B45E8]">
            <Clock className="w-3.5 h-3.5" /> Pending Review
          </span>
        );
    }
  };

  const currentList = activeTab === 'incoming' ? incoming : outgoing;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#252525] tracking-tight">
          Campus Contact & Claim Requests
        </h1>
        <p className="text-xs sm:text-sm text-[#858585] mt-1">
          Safely communicate and coordinate handovers with students who claim or inquire about items.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 bg-[#F7F7FA] p-1.5 rounded-2xl border border-[#E8E8ED] max-w-md">
        <button
          onClick={() => setActiveTab('incoming')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'incoming'
              ? 'bg-white text-[#252525] shadow-sm'
              : 'text-[#858585] hover:text-[#252525]'
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span>Received Inquiries</span>
          <span className="px-2 py-0.5 rounded-full bg-[#F1E9FA] text-[#8B45E8] text-[10px]">
            {incoming.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('outgoing')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'outgoing'
              ? 'bg-white text-[#252525] shadow-sm'
              : 'text-[#858585] hover:text-[#252525]'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>My Sent Claims</span>
          <span className="px-2 py-0.5 rounded-full bg-[#F7F7FA] text-[#858585] text-[10px]">
            {outgoing.length}
          </span>
        </button>
      </div>

      {/* Requests Feed */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#8B45E8] animate-spin mb-3" />
          <p className="text-xs text-[#858585]">Loading requests...</p>
        </div>
      ) : currentList.length > 0 ? (
        <div className="space-y-4">
          {currentList.map((req) => {
            const item = req.item_details || req.item;
            const sender = req.sender_details || req.sender;
            const recipient = req.recipient_details || req.recipient;

            return (
              <div
                key={req._id}
                className="bg-white rounded-3xl border border-[#E8E8ED] p-5 sm:p-6 shadow-sm hover:border-[#8B45E8]/30 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8E8ED] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#4263EB] to-[#8B45E8] text-white font-bold flex items-center justify-center text-sm">
                      {activeTab === 'incoming'
                        ? sender?.name?.charAt(0) || 'S'
                        : recipient?.name?.charAt(0) || 'R'}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-[#252525]">
                        {activeTab === 'incoming'
                          ? `${sender?.name || 'Student'} (${sender?.department || 'Campus'})`
                          : `To: ${recipient?.name || 'Student'} (${recipient?.department || 'Campus'})`}
                      </h3>
                      <span className="text-[11px] text-[#858585]">
                        Submitted on {new Date(req.createdAt).toLocaleDateString()} at{' '}
                        {new Date(req.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>

                  <div>{getStatusBadge(req.status)}</div>
                </div>

                {/* Related Item Snippet */}
                <div className="p-3.5 rounded-2xl bg-[#F7F7FA] border border-[#E8E8ED] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 truncate">
                    <div className="w-10 h-10 rounded-xl bg-white overflow-hidden flex-shrink-0 border border-[#E8E8ED]">
                      {item?.images?.[0]?.url ? (
                        <img
                          src={getImageUrl(item.images[0].url)}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[9px] font-bold text-[#8B45E8]">
                          ITEM
                        </div>
                      )}
                    </div>
                    <div className="truncate">
                      <span className="text-[10px] uppercase font-bold text-[#858585] block">
                        Associated Post
                      </span>
                      <Link
                        to={`/items/${item?._id}`}
                        className="font-bold text-xs text-[#252525] hover:text-[#8B45E8] truncate block"
                      >
                        {item?.title || 'Campus Item'}
                      </Link>
                    </div>
                  </div>

                  <Link to={`/items/${item?._id}`}>
                    <button className="text-xs font-bold text-[#8B45E8] hover:underline flex items-center gap-1 cursor-pointer">
                      <span>View Post</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </Link>
                </div>

                {/* Message Body */}
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-[#858585] uppercase tracking-wider block">
                    Inquiry Message:
                  </span>
                  <p className="text-xs sm:text-sm text-[#252525] leading-relaxed bg-[#F8F4FD]/50 p-4 rounded-2xl border border-[#8B45E8]/10 whitespace-pre-line">
                    {req.message}
                  </p>
                </div>

                {/* Revealed Contact Information upon Acceptance */}
                {req.status === 'accepted' && (
                  <div className="p-4 rounded-2xl bg-[#E6F9F1]/60 border border-[#16B978]/30 space-y-2 animate-in fade-in">
                    <span className="text-xs font-bold text-[#16B978] block">
                      ✓ Verified Peer Contact Information (Safe Coordination)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#252525] pt-1">
                      {activeTab === 'incoming' ? (
                        <>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-[#8B45E8]" />
                            <span>{sender?.email}</span>
                          </div>
                          {req.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-[#16B978]" />
                              <span>{req.phone}</span>
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-[#8B45E8]" />
                            <span>{recipient?.email}</span>
                          </div>
                          {recipient?.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-[#16B978]" />
                              <span>{recipient.phone}</span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions Footer */}
                <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2">
                  {activeTab === 'incoming' && req.status === 'pending' && (
                    <>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleUpdateStatus(req._id, 'rejected')}
                      >
                        Decline Claim
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleUpdateStatus(req._id, 'accepted')}
                      >
                        Accept & Share Details
                      </Button>
                    </>
                  )}

                  {req.status === 'accepted' && (
                    <Button
                      variant="lavender"
                      size="sm"
                      onClick={() => handleUpdateStatus(req._id, 'completed')}
                    >
                      <CheckCircle className="w-4 h-4 mr-1.5" />
                      Mark Handover Completed
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-[#F7F7FA] rounded-3xl border border-[#E8E8ED] py-16 px-4 text-center max-w-md mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-[#F1E9FA] text-[#8B45E8] flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-[#252525]">
            No {activeTab === 'incoming' ? 'Incoming Inquiries' : 'Outgoing Claims'}
          </h3>
          <p className="text-xs text-[#858585] mt-1.5 leading-relaxed">
            {activeTab === 'incoming'
              ? 'When fellow students message or claim your reported items, their requests will appear here.'
              : 'You haven’t sent any claim requests on items yet.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ContactRequestsPage;

