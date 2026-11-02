import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Compass, Mail, ArrowLeft, CheckCircle2, AlertCircle, KeyRound } from 'lucide-react';
import api from '../services/api';
import Button from '../components/common/Button';

const schema = z.object({
  email: z.string().email('Please enter a valid campus email address'),
});

export const ForgotPasswordPage = () => {
  const [submitting, setSubmitting] = useState(false);
  const [successInfo, setSuccessInfo] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    setErrorMessage('');
    try {
      const res = await api.post('/auth/forgot-password', { email: data.email });
      setSuccessInfo(res.data);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to process request');
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
          <h1 className="text-2xl font-extrabold text-[#252525]">Reset Your Password</h1>
          <p className="text-xs text-[#858585]">
            Enter your registered campus email to receive reset instructions
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-[#E8E8ED] shadow-sm p-6 sm:p-8 space-y-6">
          {successInfo ? (
            <div className="space-y-4 text-center py-4">
              <div className="w-12 h-12 rounded-full bg-[#E6F9F1] text-[#16B978] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-[#252525]">Check Your Inbox</h3>
              <p className="text-xs text-[#858585] leading-relaxed">
                If an account matches your email address, we have sent instructions to reset your password.
              </p>

              {/* Dev Token Simulation Helper */}
              {successInfo.devResetToken && (
                <div className="mt-4 p-4 rounded-2xl bg-[#F1E9FA] border border-[#8B45E8]/30 text-left space-y-2">
                  <span className="text-[11px] font-bold text-[#8B45E8] flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5" />
                    Development Reset Link (Simulated SMTP):
                  </span>
                  <Link
                    to={`/reset-password/${successInfo.devResetToken}`}
                    className="text-xs font-semibold text-[#4263EB] hover:underline block break-all"
                  >
                    Click here to reset password directly
                  </Link>
                </div>
              )}

              <div className="pt-4">
                <Link to="/login">
                  <Button variant="secondary" size="sm" className="w-full">
                    Return to Login
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {errorMessage && (
                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-[#FDECF3] border border-[#E84383]/30 text-[#E84383] text-xs">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

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

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={submitting}
                className="w-full"
              >
                Send Reset Link
              </Button>

              <div className="pt-2 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs text-[#858585] hover:text-[#252525]"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to login</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

