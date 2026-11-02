import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  onClick,
  className = '',
  icon: Icon,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed select-none cursor-pointer';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5 font-semibold',
  };

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-[#4263EB] to-[#8B45E8] text-white hover:opacity-95 hover:shadow-card hover:-translate-y-0.5 active:translate-y-0 focus:ring-[#8B45E8]',
    secondary:
      'bg-white text-[#252525] border border-[#E8E8ED] hover:bg-[#F7F7FA] hover:border-[#D5D5DF] shadow-sm active:bg-gray-100 focus:ring-[#4263EB]',
    lavender:
      'bg-[#F1E9FA] text-[#8B45E8] hover:bg-[#EADBFA] border border-[#8B45E8]/20 focus:ring-[#8B45E8]',
    outline:
      'bg-transparent text-[#8B45E8] border border-[#8B45E8] hover:bg-[#F1E9FA] focus:ring-[#8B45E8]',
    danger:
      'bg-[#FDECF3] text-[#E84383] border border-[#E84383]/20 hover:bg-[#E84383] hover:text-white focus:ring-[#E84383]',
    ghost:
      'bg-transparent text-[#858585] hover:text-[#252525] hover:bg-[#F7F7FA] focus:ring-gray-300',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${
        variantStyles[variant] || variantStyles.primary
      } ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4 flex-shrink-0" />
      ) : null}
      {children}
    </button>
  );
};

export default Button;

