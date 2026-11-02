import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 7);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, success: (msg) => addToast(msg, 'success'), error: (msg) => addToast(msg, 'error'), info: (msg) => addToast(msg, 'info') }}>
      {children}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xl shadow-card border backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-top-4 ${
              toast.type === 'success'
                ? 'bg-white border-[#16B978]/30 text-[#252525]'
                : toast.type === 'error'
                ? 'bg-white border-[#E84383]/40 text-[#252525]'
                : 'bg-white border-[#8B45E8]/30 text-[#252525]'
            }`}
          >
            <div className="flex items-center gap-3">
              {toast.type === 'success' && (
                <div className="w-8 h-8 rounded-full bg-[#E6F9F1] flex items-center justify-center flex-shrink-0 text-[#16B978]">
                  <CheckCircle className="w-4 h-4" />
                </div>
              )}
              {toast.type === 'error' && (
                <div className="w-8 h-8 rounded-full bg-[#FDECF3] flex items-center justify-center flex-shrink-0 text-[#E84383]">
                  <AlertCircle className="w-4 h-4" />
                </div>
              )}
              {toast.type === 'info' && (
                <div className="w-8 h-8 rounded-full bg-[#F1E9FA] flex items-center justify-center flex-shrink-0 text-[#8B45E8]">
                  <Info className="w-4 h-4" />
                </div>
              )}
              <span className="text-sm font-medium leading-snug">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#858585] hover:text-[#252525] transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

