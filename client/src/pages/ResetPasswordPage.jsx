import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Compass, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';

const resetSchema = z
  .object({
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const { success, error: toastError } = useToast();

  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    setErrorMessage('');
    try {
      const res = await api.post('/auth/reset-password', {
        token,
        password: data.password,
      });

      if (res.data?.data?.token) {
        localStorage.setItem('token', res.data.data.token);
      }

      await refreshUser();
      success('Password reset successfully! You are now logged in.');
      navigate('/dashboard');
    } catch (err) {
      setErrorMessage(err.message || 'Failed to reset password. Token may be invalid or expired.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#4263EB] to-[#8B45E8] flex items-center justify-center text-white shadow-soft">
              <Compass className="w-6 h-6" />
            </div>
          </Link>
          <h1 className="text-2xl font-extrabold text-[#252525]">Set New Password</h1>
          <p className="text-xs text-[#858585]">
            Create a secure new password for your student account
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-[#E8E8ED] shadow-sm p-6 sm:p-8 space-y-6">
          {errorMessage && (
            <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-[#FDECF3] border border-[#E84383]/30 text-[#E84383] text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#252525] uppercase tracking-wider mb-1.5">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#858585]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password')}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#E8E8ED] bg-[#F7F7FA] text-sm text-[#252525] focus:outline-none focus:ring-2 focus:ring-[#8B45E8]/30 focus:border-[#8B45E8] focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#858585] hover:text-[#252525]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-[#E84383] mt-1">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#252525] uppercase tracking-wider mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#858585]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('confirmPassword')}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E8E8ED] bg-[#F7F7FA] text-sm text-[#252525] focus:outline-none focus:ring-2 focus:ring-[#8B45E8]/30 focus:border-[#8B45E8] focus:bg-white"
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-[#E84383] mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={submitting}
              className="w-full mt-2"
            >
              Reset & Log In
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;

