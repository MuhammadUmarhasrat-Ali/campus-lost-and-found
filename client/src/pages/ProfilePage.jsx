import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Lock, Save, ShieldCheck, Mail, Hash } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import Button from '../components/common/Button';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  department: z.string().min(2, 'Department is required'),
  academicYear: z.string().min(1, 'Academic year is required'),
  phone: z.string().optional(),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'New passwords do not match',
    path: ['confirmPassword'],
  });

export const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const { success, error: toastError } = useToast();

  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  // Profile Form
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      department: user?.department || '',
      academicYear: user?.academicYear || '',
      phone: user?.phone || '',
    },
  });

  // Password Form
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors },
  } = useForm({
    resolver: zodResolver(passwordSchema),
  });

  const onUpdateProfile = async (data) => {
    setSavingProfile(true);
    try {
      await updateProfile(data);
      success('Profile updated successfully');
    } catch (err) {
      toastError(err.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const onChangePassword = async (data) => {
    setChangingPassword(true);
    try {
      await api.put('/users/change-password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      success('Password changed successfully');
      resetPasswordForm();
    } catch (err) {
      toastError(err.message || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#252525] tracking-tight">
          Student Profile & Settings
        </h1>
        <p className="text-xs sm:text-sm text-[#858585] mt-1">
          Manage your verified campus details and account credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Side: Summary Card */}
        <div className="md:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl border border-[#E8E8ED] p-6 text-center shadow-sm space-y-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#4263EB] to-[#8B45E8] text-white text-2xl font-black flex items-center justify-center mx-auto shadow-card">
              {user?.name?.charAt(0)}
            </div>

            <div>
              <h2 className="font-extrabold text-base text-[#252525]">{user?.name}</h2>
              <p className="text-xs text-[#858585] mt-0.5">{user?.email}</p>
              <span className="inline-block mt-2 px-3 py-1 rounded-full text-[11px] font-bold bg-[#F1E9FA] text-[#8B45E8] uppercase tracking-wider">
                {user?.role}
              </span>
            </div>

            <div className="pt-4 border-t border-[#E8E8ED] space-y-2 text-left text-xs">
              <div className="flex items-center gap-2 text-[#858585]">
                <Hash className="w-4 h-4 text-[#8B45E8]" />
                <span>
                  ID / Roll: <strong className="text-[#252525]">{user?.studentId}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2 text-[#858585]">
                <Mail className="w-4 h-4 text-[#4263EB]" />
                <span className="truncate">
                  Email: <strong className="text-[#252525] truncate">{user?.email}</strong>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Edit Profile & Password */}
        <div className="md:col-span-8 space-y-6">
          {/* General Profile Info Form */}
          <div className="bg-white rounded-3xl border border-[#E8E8ED] p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h3 className="font-bold text-base text-[#252525]">
                Personal & Academic Details
              </h3>
              <p className="text-xs text-[#858585] mt-0.5">
                Keep your campus department and year up to date for item claims.
              </p>
            </div>

            <form onSubmit={handleProfileSubmit(onUpdateProfile)} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#252525] uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  {...registerProfile('name')}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E8E8ED] bg-[#F7F7FA] text-sm text-[#252525] focus:outline-none focus:ring-2 focus:ring-[#8B45E8]/30 focus:border-[#8B45E8] focus:bg-white"
                />
                {profileErrors.name && (
                  <p className="text-xs text-[#E84383] mt-1">{profileErrors.name.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#252525] uppercase tracking-wider mb-1.5">
                    Department
                  </label>
                  <input
                    type="text"
                    {...registerProfile('department')}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E8E8ED] bg-[#F7F7FA] text-sm text-[#252525] focus:outline-none focus:ring-2 focus:ring-[#8B45E8]/30 focus:border-[#8B45E8] focus:bg-white"
                  />
                  {profileErrors.department && (
                    <p className="text-xs text-[#E84383] mt-1">
                      {profileErrors.department.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#252525] uppercase tracking-wider mb-1.5">
                    Academic Year / Semester
                  </label>
                  <input
                    type="text"
                    {...registerProfile('academicYear')}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E8E8ED] bg-[#F7F7FA] text-sm text-[#252525] focus:outline-none focus:ring-2 focus:ring-[#8B45E8]/30 focus:border-[#8B45E8] focus:bg-white"
                  />
                  {profileErrors.academicYear && (
                    <p className="text-xs text-[#E84383] mt-1">
                      {profileErrors.academicYear.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#252525] uppercase tracking-wider mb-1.5">
                  Contact Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 9876543210"
                  {...registerProfile('phone')}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E8E8ED] bg-[#F7F7FA] text-sm text-[#252525] focus:outline-none focus:ring-2 focus:ring-[#8B45E8]/30 focus:border-[#8B45E8] focus:bg-white"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={savingProfile}
                >
                  <Save className="w-4 h-4 mr-1.5" />
                  Save Profile
                </Button>
              </div>
            </form>
          </div>

          {/* Change Password Form */}
          <div className="bg-white rounded-3xl border border-[#E8E8ED] p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h3 className="font-bold text-base text-[#252525]">Change Password</h3>
              <p className="text-xs text-[#858585] mt-0.5">
                Ensure your account stays secure by using a strong password.
              </p>
            </div>

            <form onSubmit={handlePasswordSubmit(onChangePassword)} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#252525] uppercase tracking-wider mb-1.5">
                  Current Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  {...registerPassword('currentPassword')}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E8E8ED] bg-[#F7F7FA] text-sm text-[#252525] focus:outline-none focus:ring-2 focus:ring-[#8B45E8]/30 focus:border-[#8B45E8] focus:bg-white"
                />
                {passwordErrors.currentPassword && (
                  <p className="text-xs text-[#E84383] mt-1">
                    {passwordErrors.currentPassword.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#252525] uppercase tracking-wider mb-1.5">
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    {...registerPassword('newPassword')}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E8E8ED] bg-[#F7F7FA] text-sm text-[#252525] focus:outline-none focus:ring-2 focus:ring-[#8B45E8]/30 focus:border-[#8B45E8] focus:bg-white"
                  />
                  {passwordErrors.newPassword && (
                    <p className="text-xs text-[#E84383] mt-1">
                      {passwordErrors.newPassword.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#252525] uppercase tracking-wider mb-1.5">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    {...registerPassword('confirmPassword')}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E8E8ED] bg-[#F7F7FA] text-sm text-[#252525] focus:outline-none focus:ring-2 focus:ring-[#8B45E8]/30 focus:border-[#8B45E8] focus:bg-white"
                  />
                  {passwordErrors.confirmPassword && (
                    <p className="text-xs text-[#E84383] mt-1">
                      {passwordErrors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  type="submit"
                  variant="secondary"
                  size="sm"
                  isLoading={changingPassword}
                >
                  <Lock className="w-4 h-4 mr-1.5" />
                  Update Password
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

