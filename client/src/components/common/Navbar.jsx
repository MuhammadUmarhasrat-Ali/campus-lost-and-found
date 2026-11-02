import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Compass,
  PlusCircle,
  Search,
  LayoutDashboard,
  Bookmark,
  MessageSquare,
  ShieldCheck,
  User,
  LogOut,
  Menu,
  X,
  Bell,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { success } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  // Fetch pending contact requests count if authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      api
        .get('/contact-requests')
        .then(({ data }) => {
          if (Array.isArray(data)) {
            const userId = user._id.toString();
            const count = data.filter(
              (r) =>
                r.status === 'pending' &&
                (r.recipient_details?._id || r.recipient?._id || r.recipient)?.toString() === userId
            ).length;
            setPendingRequestsCount(count);
          } else if (data?.data && typeof data.data.pendingIncomingCount === 'number') {
            setPendingRequestsCount(data.data.pendingIncomingCount);
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated, user, location.pathname]);

  const handleLogout = async () => {
    await logout();
    success('Logged out successfully');
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#E8E8ED]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#4263EB] to-[#8B45E8] flex items-center justify-center text-white shadow-soft group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-[#252525] via-[#354A3F] to-[#8B45E8] bg-clip-text text-transparent">
                Campus Lost & Found
              </span>
              <span className="block text-[10px] text-[#858585] -mt-1 font-medium">
                Student Recovery Hub
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              to="/"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isActive('/')
                  ? 'bg-[#F1E9FA] text-[#8B45E8] font-semibold'
                  : 'text-[#252525] hover:text-[#8B45E8] hover:bg-[#F7F7FA]'
              }`}
            >
              Home
            </Link>
            <Link
              to="/browse"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isActive('/browse')
                  ? 'bg-[#F1E9FA] text-[#8B45E8] font-semibold'
                  : 'text-[#252525] hover:text-[#8B45E8] hover:bg-[#F7F7FA]'
              }`}
            >
              Browse Items
            </Link>
            <Link
              to="/report-lost"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                isActive('/report-lost')
                  ? 'bg-[#FDECF3] text-[#E84383] font-semibold'
                  : 'text-[#252525] hover:text-[#E84383] hover:bg-[#FDECF3]/40'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#E84383]" />
              Report Lost
            </Link>
            <Link
              to="/report-found"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                isActive('/report-found')
                  ? 'bg-[#E6F9F1] text-[#16B978] font-semibold'
                  : 'text-[#252525] hover:text-[#16B978] hover:bg-[#E6F9F1]/40'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#16B978]" />
              Report Found
            </Link>
          </nav>

          {/* Auth Action Buttons (Desktop) */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                {/* Contact Requests notification pill */}
                <Link
                  to="/contact-requests"
                  title="Contact Requests"
                  className="relative p-2 rounded-xl text-[#858585] hover:text-[#8B45E8] hover:bg-[#F1E9FA] transition-colors"
                >
                  <MessageSquare className="w-5 h-5" />
                  {pendingRequestsCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#E84383] text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                      {pendingRequestsCount}
                    </span>
                  )}
                </Link>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 pl-3 rounded-full border border-[#E8E8ED] bg-[#F7F7FA] hover:bg-[#F1E9FA] transition-colors cursor-pointer"
                  >
                    <span className="text-xs font-semibold text-[#252525] max-w-[120px] truncate">
                      {user?.name}
                    </span>
                    <div className="w-7 h-7 rounded-full bg-gradient-to-r from-[#4263EB] to-[#8B45E8] text-white text-xs font-bold flex items-center justify-center">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-elevated border border-[#E8E8ED] py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-4 py-2 border-b border-[#E8E8ED]">
                        <p className="text-xs font-bold text-[#252525] truncate">{user?.name}</p>
                        <p className="text-[11px] text-[#858585] truncate">{user?.email}</p>
                        <span className="inline-block mt-1 text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded bg-[#F1E9FA] text-[#8B45E8]">
                          {user?.role}
                        </span>
                      </div>

                      <div className="py-1">
                        <Link
                          to="/dashboard"
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-[#252525] hover:bg-[#F7F7FA] hover:text-[#8B45E8] transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-[#858585]" />
                          Dashboard
                        </Link>
                        <Link
                          to="/my-posts"
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-[#252525] hover:bg-[#F7F7FA] hover:text-[#8B45E8] transition-colors"
                        >
                          <Bookmark className="w-4 h-4 text-[#858585]" />
                          My Posts
                        </Link>
                        <Link
                          to="/contact-requests"
                          className="flex items-center justify-between px-4 py-2 text-sm text-[#252525] hover:bg-[#F7F7FA] hover:text-[#8B45E8] transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <MessageSquare className="w-4 h-4 text-[#858585]" />
                            Requests
                          </div>
                          {pendingRequestsCount > 0 && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#E84383] text-white">
                              {pendingRequestsCount}
                            </span>
                          )}
                        </Link>
                        <Link
                          to="/profile"
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-[#252525] hover:bg-[#F7F7FA] hover:text-[#8B45E8] transition-colors"
                        >
                          <User className="w-4 h-4 text-[#858585]" />
                          Profile Settings
                        </Link>

                        {isAdmin && (
                          <Link
                            to="/admin"
                            className="flex items-center gap-2.5 px-4 py-2 text-sm font-semibold text-[#8B45E8] bg-[#F1E9FA]/50 hover:bg-[#F1E9FA] transition-colors"
                          >
                            <ShieldCheck className="w-4 h-4 text-[#8B45E8]" />
                            Admin Moderation
                          </Link>
                        )}
                      </div>

                      <div className="pt-1 border-t border-[#E8E8ED]">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2.5 w-full text-left px-4 py-2 text-sm text-[#E84383] hover:bg-[#FDECF3]/40 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-sm font-medium text-[#252525] hover:bg-[#F7F7FA] border border-transparent hover:border-[#E8E8ED] transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#4263EB] to-[#8B45E8] text-white shadow-soft hover:opacity-95 hover:shadow-card transition-all"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#252525] hover:bg-[#F7F7FA] transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E8E8ED] bg-white px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top duration-200">
          <Link
            to="/"
            className="block px-3 py-2 rounded-xl text-sm font-medium text-[#252525] hover:bg-[#F7F7FA]"
          >
            Home
          </Link>
          <Link
            to="/browse"
            className="block px-3 py-2 rounded-xl text-sm font-medium text-[#252525] hover:bg-[#F7F7FA]"
          >
            Browse Items
          </Link>
          <Link
            to="/report-lost"
            className="block px-3 py-2 rounded-xl text-sm font-medium text-[#E84383] bg-[#FDECF3]/50"
          >
            Report Lost Item
          </Link>
          <Link
            to="/report-found"
            className="block px-3 py-2 rounded-xl text-sm font-medium text-[#16B978] bg-[#E6F9F1]/50"
          >
            Report Found Item
          </Link>

          {isAuthenticated ? (
            <div className="pt-3 border-t border-[#E8E8ED] space-y-1">
              <div className="px-3 py-1">
                <p className="text-xs font-bold text-[#252525]">{user?.name}</p>
                <p className="text-[11px] text-[#858585]">{user?.email}</p>
              </div>
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-[#252525] hover:bg-[#F7F7FA]"
              >
                <LayoutDashboard className="w-4 h-4 text-[#858585]" />
                Dashboard
              </Link>
              <Link
                to="/my-posts"
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-[#252525] hover:bg-[#F7F7FA]"
              >
                <Bookmark className="w-4 h-4 text-[#858585]" />
                My Posts
              </Link>
              <Link
                to="/contact-requests"
                className="flex items-center justify-between px-3 py-2 rounded-xl text-sm text-[#252525] hover:bg-[#F7F7FA]"
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#858585]" />
                  Contact Requests
                </div>
                {pendingRequestsCount > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E84383] text-white">
                    {pendingRequestsCount} new
                  </span>
                )}
              </Link>
              <Link
                to="/profile"
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-[#252525] hover:bg-[#F7F7FA]"
              >
                <User className="w-4 h-4 text-[#858585]" />
                Profile Settings
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-[#8B45E8] bg-[#F1E9FA]"
                >
                  <ShieldCheck className="w-4 h-4 text-[#8B45E8]" />
                  Admin Panel
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-[#E84383] hover:bg-[#FDECF3]"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-[#E8E8ED] flex flex-col gap-2">
              <Link
                to="/login"
                className="w-full py-2.5 text-center text-sm font-medium text-[#252525] rounded-xl border border-[#E8E8ED]"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="w-full py-2.5 text-center text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-[#4263EB] to-[#8B45E8]"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;

