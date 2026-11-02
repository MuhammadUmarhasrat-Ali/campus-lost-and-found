import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Compass, Eye, EyeOff, Lock, Mail, User, Hash, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/common/Button';

const registerSchema = z
  .object({
    name: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().email('Please enter a valid campus email address'),
    studentId: z.string().min(2, 'Student ID / Roll Number is required'),
    department: z.string().min(2, 'Department is required (e.g. Computer Science)'),
    academicYear: z.string().min(1, 'Academic year is required (e.g. Year 2)'),
    phone: z.string().optional(),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register: registerAuth } = useAuth();
  const { success } = useToast();

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    setErrorMessage('');
    try {
      await registerAuth(data);
      success('Student account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed. Please check your details.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#4263EB] to-[#8B45E8] flex items-center justify-center text-white shadow-soft">
              <Compass className="w-6 h-6" />
            </div>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#252525] tracking-tight">
            Create Student Account
          </h1>
          <p className="text-xs sm:text-sm text-[#858585]">
            Join the campus network to report and recover belongings
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-[#E8E8ED] shadow-sm p-6 sm:p-10 space-y-6">
          {errorMessage && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-[#FDECF3] border border-[#E84383]/30 text-[#E84383] text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#252525] uppercase tracking-wider mb-1.5">
                Full Name <span className="text-[#E84383]">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#858585]" />
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  {...register('name')}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E8E8ED] bg-[#F7F7FA] text-sm text-[#252525] focus:outline-none focus:ring-2 focus:ring-[#8B45E8]/30 focus:border-[#8B45E8] focus:bg-white"
                />
              </div>
              {errors.name && (
                <p className="text-xs text-[#E84383] mt-1">{errors.name.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#252525] uppercase tracking-wider mb-1.5">
                  Campus Email <span className="text-[#E84383]">*</span>
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
                <label className="block text-xs font-bold text-[#252525] uppercase tracking-wider mb-1.5">
                  Student ID / Roll No <span className="text-[#E84383]">*</span>
                </label>
                <div className="relative">
                  <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#858585]" />
                  <input
                    type="text"
                    placeholder="e.g. CS2024019"
                    {...register('studentId')}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E8E8ED] bg-[#F7F7FA] text-sm text-[#252525] focus:outline-none focus:ring-2 focus:ring-[#8B45E8]/30 focus:border-[#8B45E8] focus:bg-white uppercase"
                  />
                </div>
                {errors.studentId && (
                  <p className="text-xs text-[#E84383] mt-1">{errors.studentId.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#252525] uppercase tracking-wider mb-1.5">
                  Department <span className="text-[#E84383]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Computer Science"
                  {...register('department')}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E8E8ED] bg-[#F7F7FA] text-sm text-[#252525] focus:outline-none focus:ring-2 focus:ring-[#8B45E8]/30 focus:border-[#8B45E8] focus:bg-white"
                />
                {errors.department && (
                  <p className="text-xs text-[#E84383] mt-1">{errors.department.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#252525] uppercase tracking-wider mb-1.5">
                  Academic Year / Sem <span className="text-[#E84383]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Year 3 (Sem 5)"
                  {...register('academicYear')}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E8E8ED] bg-[#F7F7FA] text-sm text-[#252525] focus:outline-none focus:ring-2 focus:ring-[#8B45E8]/30 focus:border-[#8B45E8] focus:bg-white"
                />
                {errors.academicYear && (
                  <p className="text-xs text-[#E84383] mt-1">{errors.academicYear.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#252525] uppercase tracking-wider mb-1.5">
                Contact Phone (Optional)
              </label>
              <input
                type="tel"
                placeholder="e.g. 9876543210"
                {...register('phone')}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E8E8ED] bg-[#F7F7FA] text-sm text-[#252525] focus:outline-none focus:ring-2 focus:ring-[#8B45E8]/30 focus:border-[#8B45E8] focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#252525] uppercase tracking-wider mb-1.5">
                  Password <span className="text-[#E84383]">*</span>
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
                  Confirm Password <span className="text-[#E84383]">*</span>
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
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={submitting}
              className="w-full mt-4"
            >
              Create Account
            </Button>
          </form>

          <div className="pt-2 text-center text-xs text-[#858585]">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-[#8B45E8] hover:underline">
              Log in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

