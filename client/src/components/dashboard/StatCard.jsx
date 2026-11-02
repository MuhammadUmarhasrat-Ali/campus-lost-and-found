import React from 'react';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'purple',
  onClick,
}) => {
  const variantStyles = {
    purple: {
      bg: 'bg-[#F1E9FA]/60 hover:bg-[#F1E9FA]',
      border: 'border-[#8B45E8]/20',
      iconBg: 'bg-[#8B45E8] text-white',
      valueColor: 'text-[#8B45E8]',
    },
    blue: {
      bg: 'bg-[#EDF2FE] hover:bg-[#E3ECFE]',
      border: 'border-[#4263EB]/20',
      iconBg: 'bg-[#4263EB] text-white',
      valueColor: 'text-[#4263EB]',
    },
    green: {
      bg: 'bg-[#E6F9F1]/70 hover:bg-[#E6F9F1]',
      border: 'border-[#16B978]/20',
      iconBg: 'bg-[#16B978] text-white',
      valueColor: 'text-[#16B978]',
    },
    pink: {
      bg: 'bg-[#FDECF3]/70 hover:bg-[#FDECF3]',
      border: 'border-[#E84383]/20',
      iconBg: 'bg-[#E84383] text-white',
      valueColor: 'text-[#E84383]',
    },
  };

  const current = variantStyles[variant] || variantStyles.purple;

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl p-5 border transition-all duration-300 ${
        current.bg
      } ${current.border} ${
        onClick ? 'cursor-pointer hover:shadow-soft hover:-translate-y-0.5' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-[#858585] uppercase tracking-wider">
            {title}
          </p>
          <h3 className={`text-2xl sm:text-3xl font-extrabold mt-1 ${current.valueColor}`}>
            {value ?? 0}
          </h3>
          {subtitle && (
            <p className="text-[11px] text-[#858585] mt-1 font-medium">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-soft ${current.iconBg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;

