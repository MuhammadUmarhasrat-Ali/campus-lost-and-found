import React from 'react';

export const TypeBadge = ({ type, size = 'sm' }) => {
  const isLost = type?.toLowerCase() === 'lost';
  const sizeClasses = size === 'lg' ? 'px-3 py-1 text-xs font-semibold' : 'px-2.5 py-0.5 text-[11px] font-semibold';

  return (
    <span
      className={`inline-flex items-center rounded-full uppercase tracking-wider ${sizeClasses} ${
        isLost
          ? 'bg-[#FDECF3] text-[#E84383] border border-[#E84383]/20'
          : 'bg-[#E6F9F1] text-[#16B978] border border-[#16B978]/20'
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
          isLost ? 'bg-[#E84383]' : 'bg-[#16B978]'
        }`}
      />
      {isLost ? 'Lost Item' : 'Found Item'}
    </span>
  );
};

export const StatusBadge = ({ status }) => {
  const s = status?.toLowerCase() || 'active';

  const styles = {
    active: 'bg-[#F1E9FA] text-[#8B45E8] border-[#8B45E8]/20',
    claimed: 'bg-amber-50 text-amber-700 border-amber-200',
    resolved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    closed: 'bg-gray-100 text-gray-600 border-gray-200',
  };

  const labels = {
    active: 'Active',
    claimed: 'Claimed',
    resolved: 'Resolved',
    closed: 'Closed',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border capitalize ${
        styles[s] || styles.active
      }`}
    >
      {labels[s] || s}
    </span>
  );
};

export const CategoryBadge = ({ category }) => {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#F7F7FA] text-[#858585] border border-[#E8E8ED]">
      {category}
    </span>
  );
};

