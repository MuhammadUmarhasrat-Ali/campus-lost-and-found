import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-9 h-9 rounded-xl border border-[#E8E8ED] bg-white flex items-center justify-center text-[#252525] hover:bg-[#F7F7FA] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
        // Show first, last, and window around current
        if (
          pageNum === 1 ||
          pageNum === totalPages ||
          (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
        ) {
          const isActive = pageNum === currentPage;
          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`w-9 h-9 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-[#4263EB] to-[#8B45E8] text-white shadow-soft'
                  : 'bg-white border border-[#E8E8ED] text-[#252525] hover:bg-[#F7F7FA]'
              }`}
            >
              {pageNum}
            </button>
          );
        } else if (
          pageNum === currentPage - 2 ||
          pageNum === currentPage + 2
        ) {
          return (
            <span key={pageNum} className="text-[#858585] px-1 text-xs">
              ...
            </span>
          );
        }
        return null;
      })}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-9 h-9 rounded-xl border border-[#E8E8ED] bg-white flex items-center justify-center text-[#252525] hover:bg-[#F7F7FA] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Pagination;

