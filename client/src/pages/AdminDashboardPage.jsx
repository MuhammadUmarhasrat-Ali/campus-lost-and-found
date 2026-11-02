import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldCheck,
  Users,
  Package,
  AlertTriangle,
  Search,
  CheckCircle,
  XCircle,
  Trash2,
  Clock,
  ExternalLink,
  Loader2,
  UserCheck,
  UserX,
} from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import StatCard from '../components/dashboard/StatCard';
import Button from '../components/common/Button';
import { TypeBadge, StatusBadge } from '../components/common/Badge';
import ConfirmationModal from '../components/common/ConfirmationModal';

export const AdminDashboardPage = () => {
  const { success, error: toastError } = useToast();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'users', 'items', 'reports'

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalLost: 0,
    totalFound: 0,
    activeItems: 0,
    resolvedItems: 0,
    totalReports: 0,
    pendingReports: 0,
  });

  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');

  const [items, setItems] = useState([]);
  const [itemSearch, setItemSearch] = useState('');

  const [reports, setReports] = useState([]);

  const [loading, setLoading] = useState(true);

  // Delete Item confirmation
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch admin dashboard stats
  const fetchOverview = useCallback(async () => {
    try {
      const { data } = await api.get('/admin/dashboard');
      if (data.data) {
        setStats(data.data.stats);
      }
    } catch (err) {
      toastError(err.message || 'Failed to load admin stats');
    }
  }, [toastError]);

  // Fetch users
  const fetchUsers = useCallback(async () => {
    try {
      const query = userSearch ? `?search=${encodeURIComponent(userSearch)}` : '';
      const { data } = await api.get(`/admin/users${query}`);
      if (data.data) {
        setUsers(data.data.users);
      }
    } catch (err) {
      toastError(err.message || 'Failed to load users');
    }
  }, [userSearch, toastError]);

  // Fetch items
  const fetchItems = useCallback(async () => {
    try {
      const query = itemSearch ? `?search=${encodeURIComponent(itemSearch)}` : '';
      const { data } = await api.get(`/admin/items${query}`);
      if (data.data) {
        setItems(data.data.items);
      }
    } catch (err) {
      toastError(err.message || 'Failed to load items');
    }
  }, [itemSearch, toastError]);

  // Fetch reports
  const fetchReports = useCallback(async () => {
    try {
      const { data } = await api.get('/admin/reports');
      if (data.data) {
        setReports(data.data.reports);
      }
    } catch (err) {
      toastError(err.message || 'Failed to load reports');
    }
  }, [toastError]);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchOverview(), fetchUsers(), fetchItems(), fetchReports()]).finally(
      () => setLoading(false)
    );
  }, [fetchOverview, fetchUsers, fetchItems, fetchReports]);

  // Toggle user activation
  const handleToggleUser = async (userId) => {
    try {
      const { data } = await api.patch(`/admin/users/${userId}/status`);
      success(data.message);
      fetchUsers();
    } catch (err) {
      toastError(err.message);
    }
  };

  // Delete item
  const confirmDeleteItem = async () => {
    if (!itemToDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/admin/items/${itemToDelete._id}`);
      success('Item removed by administrator');
      setDeleteModalOpen(false);
      setItemToDelete(null);
      fetchItems();
      fetchOverview();
    } catch (err) {
      toastError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  // Update report status
  const handleReportStatus = async (reportId, status) => {
    try {
      await api.patch(`/admin/reports/${reportId}`, { status });
      success(`Report status changed to ${status}`);
      fetchReports();
      fetchOverview();
    } catch (err) {
      toastError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#8B45E8] animate-spin mb-3" />
        <p className="text-xs text-[#858585]">Loading administrator control panel...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#242424] via-[#354A3F] to-[#242424] text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-elevated">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-xs font-bold mb-2">
            <ShieldCheck className="w-4 h-4 text-[#16B978]" />
            <span>Campus Administration & Moderation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Security & Oversight Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-white/80 mt-1">
            Supervise reported campus items, resolve student flags, and manage user accounts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-center">
            <span className="text-[10px] text-white/70 uppercase block font-bold">
              Pending Reports
            </span>
            <span className="text-xl font-black text-[#E84383]">
              {stats.pendingReports}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E8E8ED] pb-px overflow-x-auto scrollbar-none">
        {[
          { id: 'overview', label: 'Overview Metrics', count: null },
          { id: 'users', label: 'User Management', count: stats.totalUsers },
          { id: 'items', label: 'All Item Posts', count: items.length },
          { id: 'reports', label: 'Content Reports', count: stats.pendingReports },
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
              {tab.count !== null && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    isActive
                      ? 'bg-[#F1E9FA] text-[#8B45E8]'
                      : 'bg-[#F7F7FA] text-[#858585]'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <StatCard
              title="Registered Students"
              value={stats.totalStudents}
              subtitle="Active college accounts"
              variant="blue"
              icon={Users}
            />
            <StatCard
              title="Total Lost Items"
              value={stats.totalLost}
              subtitle="Lost item posts"
              variant="pink"
              icon={AlertTriangle}
            />
            <StatCard
              title="Total Found Items"
              value={stats.totalFound}
              subtitle="Found item posts"
              variant="green"
              icon={CheckCircle}
            />
            <StatCard
              title="Content Reports"
              value={stats.totalReports}
              subtitle={`${stats.pendingReports} pending moderation`}
              variant="purple"
              icon={ShieldCheck}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quick Status Split */}
            <div className="bg-white rounded-3xl border border-[#E8E8ED] p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-base text-[#252525]">Campus Posts Breakdown</h3>
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-[#F7F7FA] border border-[#E8E8ED] text-xs">
                  <span className="font-semibold text-[#858585]">Active Open Items:</span>
                  <span className="font-extrabold text-[#4263EB]">{stats.activeItems}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-2xl bg-[#F7F7FA] border border-[#E8E8ED] text-xs">
                  <span className="font-semibold text-[#858585]">Successfully Resolved:</span>
                  <span className="font-extrabold text-[#16B978]">{stats.resolvedItems}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-2xl bg-[#F7F7FA] border border-[#E8E8ED] text-xs">
                  <span className="font-semibold text-[#858585]">Total All Time Items:</span>
                  <span className="font-extrabold text-[#252525]">{stats.totalLost + stats.totalFound}</span>
                </div>
              </div>
            </div>

            {/* Moderation Alert Card */}
            <div className="bg-white rounded-3xl border border-[#E8E8ED] p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-base text-[#252525]">Pending Attention</h3>
              <div className="space-y-3 pt-2">
                <div className="p-4 rounded-2xl bg-[#FDECF3]/70 border border-[#E84383]/20 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-[#E84383] block">
                      Reports Awaiting Action
                    </span>
                    <span className="text-[11px] text-[#858585]">
                      Review user reports regarding inappropriate posts or fraud
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveTab('reports')}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#E84383] text-white shadow-soft cursor-pointer"
                  >
                    Review ({stats.pendingReports})
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-[#F1E9FA]/70 border border-[#8B45E8]/20 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-[#8B45E8] block">
                      Student Accounts
                    </span>
                    <span className="text-[11px] text-[#858585]">
                      Search and verify registered campus accounts
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveTab('users')}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#8B45E8] text-white shadow-soft cursor-pointer"
                  >
                    Manage ({stats.totalUsers})
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Users Management */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-[#E8E8ED] p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-base text-[#252525]">User Accounts</h3>
              <p className="text-xs text-[#858585] mt-0.5">
                View all registered campus students and administrators.
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#858585]" />
              <input
                type="text"
                placeholder="Search by name, email, student ID..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#E8E8ED] bg-[#F7F7FA] text-xs focus:outline-none focus:ring-1 focus:ring-[#8B45E8]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E8E8ED] text-[#858585] uppercase tracking-wider font-bold">
                  <th className="py-3 px-3">Student Name</th>
                  <th className="py-3 px-3">Student ID</th>
                  <th className="py-3 px-3">Department</th>
                  <th className="py-3 px-3">Role</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E8ED]">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-[#F7F7FA]/70 transition-colors">
                    <td className="py-3.5 px-3">
                      <span className="font-bold text-[#252525] block">{u.name}</span>
                      <span className="text-[11px] text-[#858585]">{u.email}</span>
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-[#252525]">
                      {u.studentId}
                    </td>
                    <td className="py-3.5 px-3 text-[#858585]">{u.department}</td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          u.role === 'admin'
                            ? 'bg-[#F1E9FA] text-[#8B45E8]'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          u.isActive
                            ? 'bg-[#E6F9F1] text-[#16B978]'
                            : 'bg-[#FDECF3] text-[#E84383]'
                        }`}
                      >
                        {u.isActive ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => handleToggleUser(u._id)}
                          className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-colors cursor-pointer ${
                            u.isActive
                              ? 'text-[#E84383] hover:bg-[#FDECF3]'
                              : 'text-[#16B978] hover:bg-[#E6F9F1]'
                          }`}
                        >
                          {u.isActive ? 'Suspend' : 'Reactivate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: All Items Moderation */}
      {activeTab === 'items' && (
        <div className="bg-white rounded-3xl border border-[#E8E8ED] p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-base text-[#252525]">All Campus Posts</h3>
              <p className="text-xs text-[#858585] mt-0.5">
                Moderator list of all posted items. Delete spam or offensive posts.
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#858585]" />
              <input
                type="text"
                placeholder="Search items by title or location..."
                value={itemSearch}
                onChange={(e) => setItemSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchItems()}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#E8E8ED] bg-[#F7F7FA] text-xs focus:outline-none focus:ring-1 focus:ring-[#8B45E8]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E8E8ED] text-[#858585] uppercase tracking-wider font-bold">
                  <th className="py-3 px-3">Item Details</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Location</th>
                  <th className="py-3 px-3">Posted By</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E8ED]">
                {items.map((itm) => (
                  <tr key={itm._id} className="hover:bg-[#F7F7FA]/70 transition-colors">
                    <td className="py-3.5 px-3 max-w-xs">
                      <span className="font-bold text-[#252525] block truncate">
                        {itm.title}
                      </span>
                      <span className="text-[11px] text-[#858585] block truncate">
                        {itm.category} • {new Date(itm.eventDate).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <TypeBadge type={itm.type} />
                    </td>
                    <td className="py-3.5 px-3 text-[#252525] font-medium">
                      {itm.location}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="font-semibold text-[#252525] block">
                        {itm.user?.name || 'Student'}
                      </span>
                      <span className="text-[10px] text-[#858585]">
                        {itm.user?.studentId}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <StatusBadge status={itm.status} />
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`/items/${itm._id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg text-[#858585] hover:text-[#8B45E8] hover:bg-[#F1E9FA]"
                          title="Open item page"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => {
                            setItemToDelete(itm);
                            setDeleteModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-[#858585] hover:text-[#E84383] hover:bg-[#FDECF3]"
                          title="Delete inappropriate post"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Content Reports */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-3xl border border-[#E8E8ED] p-6 shadow-sm space-y-6">
          <div>
            <h3 className="font-bold text-base text-[#252525]">Reported Items Queue</h3>
            <p className="text-xs text-[#858585] mt-0.5">
              Items flagged by campus students for review and moderation.
            </p>
          </div>

          {reports.length > 0 ? (
            <div className="space-y-4">
              {reports.map((rep) => (
                <div
                  key={rep._id}
                  className="p-5 rounded-2xl bg-[#F7F7FA] border border-[#E8E8ED] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#FDECF3] text-[#E84383]">
                        {rep.reason}
                      </span>
                      <span className="text-xs text-[#858585]">
                        Reported by {rep.reportedBy?.name} ({rep.reportedBy?.studentId}) on{' '}
                        {new Date(rep.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                        rep.status === 'pending'
                          ? 'bg-[#F1E9FA] text-[#8B45E8]'
                          : rep.status === 'resolved'
                          ? 'bg-[#E6F9F1] text-[#16B978]'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {rep.status}
                    </span>
                  </div>

                  <p className="text-xs text-[#252525] bg-white p-3 rounded-xl border border-[#E8E8ED]">
                    "{rep.description}"
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-[#858585]">
                      Target Post:{' '}
                      <strong className="text-[#252525]">
                        {rep.reportedItem?.title || 'Unknown post'}
                      </strong>
                    </span>

                    <div className="flex items-center gap-2">
                      {rep.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleReportStatus(rep._id, 'dismissed')}
                            className="px-3 py-1 rounded-lg text-xs font-semibold text-[#858585] hover:bg-gray-200 transition-colors cursor-pointer"
                          >
                            Dismiss Report
                          </button>
                          <button
                            onClick={() => handleReportStatus(rep._id, 'resolved')}
                            className="px-3 py-1 rounded-lg text-xs font-semibold bg-[#16B978] text-white hover:opacity-90 shadow-sm transition-opacity cursor-pointer"
                          >
                            Mark Handled
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-[#F7F7FA] rounded-2xl border border-[#E8E8ED]">
              <CheckCircle className="w-10 h-10 text-[#16B978] mx-auto mb-2 opacity-80" />
              <p className="text-sm font-bold text-[#252525]">No Pending Reports</p>
              <p className="text-xs text-[#858585] mt-1">The moderation queue is completely clear!</p>
            </div>
          )}
        </div>
      )}

      {/* Delete Item Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={confirmDeleteItem}
        isDanger={true}
        title="Admin Content Removal"
        message={`Are you sure you want to remove "${itemToDelete?.title}"? All associated data and photos will be deleted.`}
        confirmText="Yes, Remove Content"
        isLoading={deleting}
      />
    </div>
  );
};

export default AdminDashboardPage;

