import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusCircle,
  Search,
  Bookmark,
  MessageSquare,
  Package,
  CheckCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import StatCard from '../components/dashboard/StatCard';
import Button from '../components/common/Button';
import { TypeBadge, StatusBadge } from '../components/common/Badge';

export const DashboardPage = () => {
  const { user } = useAuth();
  const { success, error: toastError } = useToast();

  const [stats, setStats] = useState({
    total: 0,
    lost: 0,
    found: 0,
    active: 0,
    resolved: 0,
  });
  const [recentPosts, setRecentPosts] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [postsRes, requestsRes] = await Promise.all([
        api.get('/items/my-posts'),
        api.get('/contact-requests'),
      ]);

      if (postsRes.data?.data) {
        setStats(postsRes.data.data.counts);
        setRecentPosts(postsRes.data.data.items.slice(0, 4));
      }

      const reqList = Array.isArray(requestsRes.data)
        ? requestsRes.data
        : Array.isArray(requestsRes.data?.data)
        ? requestsRes.data.data
        : requestsRes.data?.data?.incoming || [];

      if (user) {
        const userId = user._id.toString();
        const pending = reqList.filter(
          (r) =>
            r.status === 'pending' &&
            (r.recipient_details?._id || r.recipient?._id || r.recipient)?.toString() === userId
        );
        setPendingRequests(pending);
      } else {
        setPendingRequests(reqList.filter((r) => r.status === 'pending'));
      }
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRequestAction = async (requestId, newStatus) => {
    try {
      await api.patch(`/contact-requests/${requestId}`, { status: newStatus });
      success(`Request ${newStatus} successfully`);
      fetchDashboardData();
    } catch (err) {
      toastError(err.message || 'Failed to update request');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#8B45E8] animate-spin mb-3" />
        <p className="text-xs text-[#858585]">Loading student dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#F1E9FA] via-[#F8F4FD] to-white border border-[#E8E8ED]">
        <div>
          <span className="text-xs font-bold text-[#8B45E8] uppercase tracking-wider">
            Student Overview
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#252525] mt-1">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-[#858585] mt-1">
            {user?.department} • {user?.academicYear} • ID: {user?.studentId}
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link to="/report-lost">
            <Button variant="danger" size="sm">
              <PlusCircle className="w-4 h-4 mr-1.5" />
              Report Lost Item
            </Button>
          </Link>
          <Link to="/report-found">
            <Button variant="primary" size="sm">
              <PlusCircle className="w-4 h-4 mr-1.5" />
              Report Found Item
            </Button>
          </Link>
          <Link to="/browse">
            <Button variant="secondary" size="sm">
              <Search className="w-4 h-4 mr-1.5" />
              Browse Campus
            </Button>
          </Link>
        </div>
      </div>

      {/* Real Statistics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="My Lost Reports"
          value={stats.lost}
          subtitle="Items you are looking for"
          variant="pink"
          icon={AlertCircle}
        />
        <StatCard
          title="My Found Items"
          value={stats.found}
          subtitle="Items you found & posted"
          variant="green"
          icon={CheckCircle}
        />
        <StatCard
          title="Active Posts"
          value={stats.active}
          subtitle="Awaiting resolution"
          variant="purple"
          icon={Clock}
        />
        <StatCard
          title="Resolved Belongings"
          value={stats.resolved}
          subtitle="Safely returned or claimed"
          variant="blue"
          icon={TrendingUp}
        />
      </div>

      {/* Pending Contact Requests Section */}
      {pendingRequests.length > 0 && (
        <div className="bg-white rounded-3xl border border-[#E8E8ED] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#FDECF3] text-[#E84383] flex items-center justify-center font-bold text-xs">
                {pendingRequests.length}
              </div>
              <h2 className="text-base font-bold text-[#252525]">
                Pending Claim Inquiries on Your Posts
              </h2>
            </div>
            <Link
              to="/contact-requests"
              className="text-xs font-bold text-[#8B45E8] hover:underline"
            >
              View All Requests
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingRequests.map((req) => {
              const sender = req.sender_details || req.sender;
              const item = req.item_details || req.item;

              return (
                <div
                  key={req._id}
                  className="p-4 rounded-2xl bg-[#F7F7FA] border border-[#E8E8ED] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#252525]">
                      {sender?.name || 'Student'} ({sender?.department || 'Campus'})
                    </span>
                    <span className="text-[10px] text-[#858585]">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-xs text-[#858585] italic bg-white p-3 rounded-xl border border-[#E8E8ED]">
                    "{req.message}"
                  </p>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-[11px] text-[#858585] truncate max-w-[150px]">
                      Item: <strong>{item?.title || 'Campus Item'}</strong>
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRequestAction(req._id, 'rejected')}
                        className="px-3 py-1 rounded-lg text-xs font-semibold text-[#858585] hover:text-[#E84383] hover:bg-[#FDECF3]/50 transition-colors"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => handleRequestAction(req._id, 'accepted')}
                        className="px-3 py-1 rounded-lg text-xs font-semibold bg-[#16B978] text-white hover:opacity-90 shadow-sm transition-opacity"
                      >
                        Accept Claim
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* My Recent Activity / Posts */}
      <div className="bg-white rounded-3xl border border-[#E8E8ED] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#252525]">My Recent Posts</h2>
            <p className="text-xs text-[#858585] mt-0.5">
              Items you have reported on campus.
            </p>
          </div>
          <Link
            to="/my-posts"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8B45E8] hover:text-[#4263EB] transition-colors"
          >
            <span>Manage All Posts</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {recentPosts.length > 0 ? (
          <div className="divide-y divide-[#E8E8ED]">
            {recentPosts.map((item) => (
              <div
                key={item._id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-[#F1E9FA] overflow-hidden flex-shrink-0 border border-[#E8E8ED]">
                    {item.images?.[0]?.url ? (
                      <img
                        src={item.images[0].url}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#8B45E8] font-bold text-xs">
                        {item.type === 'lost' ? 'LOST' : 'FOUND'}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <TypeBadge type={item.type} />
                      <StatusBadge status={item.status} />
                    </div>
                    <Link
                      to={`/items/${item._id}`}
                      className="font-bold text-sm text-[#252525] hover:text-[#8B45E8] transition-colors line-clamp-1 mt-1"
                    >
                      {item.title}
                    </Link>
                    <span className="text-[11px] text-[#858585] block">
                      {item.location} • {new Date(item.eventDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <Link to={`/items/${item._id}`}>
                    <Button variant="secondary" size="sm">
                      View
                    </Button>
                  </Link>
                  <Link to={`/edit-item/${item._id}`}>
                    <Button variant="lavender" size="sm">
                      Edit
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-[#F7F7FA] rounded-2xl border border-[#E8E8ED]">
            <p className="text-xs text-[#858585] mb-3">You haven't posted any items yet.</p>
            <div className="flex justify-center gap-2">
              <Link to="/report-lost">
                <Button variant="danger" size="sm">
                  Report Lost
                </Button>
              </Link>
              <Link to="/report-found">
                <Button variant="primary" size="sm">
                  Report Found
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;

