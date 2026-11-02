import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, Search } from 'lucide-react';
import Button from '../components/common/Button';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="w-16 h-16 rounded-3xl bg-[#F1E9FA] text-[#8B45E8] flex items-center justify-center mb-6 shadow-soft">
        <Compass className="w-8 h-8 animate-spin" style={{ animationDuration: '8s' }} />
      </div>
      <h1 className="text-4xl sm:text-6xl font-black text-[#252525] tracking-tight">404</h1>
      <h2 className="text-xl sm:text-2xl font-bold text-[#252525] mt-2">Page Not Found</h2>
      <p className="text-xs sm:text-sm text-[#858585] max-w-md mt-2 leading-relaxed">
        The campus link you followed might have expired, moved, or the reported item may have been removed.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link to="/">
          <Button variant="primary" size="md">
            <Home className="w-4 h-4 mr-2" />
            Go to Homepage
          </Button>
        </Link>
        <Link to="/browse">
          <Button variant="secondary" size="md">
            <Search className="w-4 h-4 mr-2" />
            Browse Items
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;

