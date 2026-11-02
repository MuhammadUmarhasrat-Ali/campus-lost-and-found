import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#252525]/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className={`relative bg-white rounded-2xl shadow-elevated border border-[#E8E8ED] w-full ${maxWidth} overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E8ED]">
          <h3 className="text-lg font-bold text-[#252525]">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#858585] hover:text-[#252525] hover:bg-[#F7F7FA] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 max-h-[80vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export default Modal;

