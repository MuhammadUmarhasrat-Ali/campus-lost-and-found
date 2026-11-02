import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Compass, Eye, EyeOff, Lock, Mail, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/common/Button';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid campus email address'),
  password: z.string().min(1, 'Password is required'),
});

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { success } = useToast();

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    setErrorMessage('');
    try {
      await login(data.email, data.password);
      success('Welcome back! Logged in successfully.');
      navigate(from, { replace: true });
    } catch (err) {
      setErrorMessage(err.message || 'Invalid email or password');
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemoAccount = (role) => {
    if (role === 'admin') {
      setValue('email', 'admin@campus.edu');
      setValue('password', 'Admin@123456');
    } else {
      setValue('email', 'rahul@campus.edu');
      setValue('password', 'Password@123');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#4263EB] to-[#8B45E8] flex items-center justify-center text-white shadow-soft">
              <Compass className="w-6 h-6" />
            </div>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#252525] tracking-tight">
            Log in to Campus Hub
          </h1>
          <p className="text-xs sm:text-sm text-[#858585]">
            Access your lost & found items and contact notifications
          </p>
        </div>

        {/* Demo Credentials Quick-Fill Pill */}
        <div className="p-3 rounded-2xl bg-[#F1E9FA]/70 border border-[#8B45E8]/20 text-center space-y-2">
          <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-[#8B45E8]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Demo Quick Access (1-Click Fill)</span>
          </div>
          <div className="flex justify-center gap-2">
            <button
              type="button"
              onClick={() => fillDemoAccount('student')}
              className="px-3 py-1 rounded-xl bg-white text-[11px] font-bold text-[#4263EB] border border-[#4263EB]/20 hover:bg-[#F7F7FA] shadow-sm transition-colors cursor-pointer"
            >
              Demo Student
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('admin')}
              className="px-3 py-1 rounded-xl bg-white text-[11px] font-bold text-[#8B45E8] border border-[#8B45E8]/20 hover:bg-[#F7F7FA] shadow-sm transition-colors cursor-pointer"
            >
              Demo Admin
            </button>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl border border-[#E8E8ED] shadow-sm p-6 sm:p-8 space-y-6">
          {errorMessage && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-[#FDECF3] border border-[#E84383]/30 text-[#E84383] text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#252525] uppercase tracking-wider mb-1.5">
                Campus Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#858585]" />
                <input
                  type="email"
                  placeholder="student@campus.edu"
                  {...register('email')}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E8E8ED] bg-[#F7F7FA] text-sm text-[#252525] focus:outline-none focus:ring-2 focus:ring-[#8B45E8]/30 focus:border-[#8B45E8] focus:bg-white"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-[#E84383] mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-[#252525] uppercase tracking-wider">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-[#8B45E8] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
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

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={submitting}
              className="w-full mt-2"
            >
              Sign In
            </Button>
          </form>

          <div className="pt-2 text-center text-xs text-[#858585]">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-[#8B45E8] hover:underline">
              Register as student
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

