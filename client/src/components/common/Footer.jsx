import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Shield, Heart, HelpCircle, Mail, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#F7F7FA] border-t border-[#E8E8ED] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand info */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#4263EB] to-[#8B45E8] flex items-center justify-center text-white shadow-soft">
                <Compass className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-base tracking-tight text-[#252525]">
                Campus Lost & Found
              </span>
            </Link>
            <p className="text-xs text-[#858585] leading-relaxed">
              A modern student community platform to reunite college peers with their lost
              belongings safely, transparently and quickly.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#858585]">
              <MapPin className="w-4 h-4 text-[#8B45E8] flex-shrink-0" />
              <span>Campus Security & Main Gate Dispatch</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#252525] uppercase tracking-wider">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs text-[#858585]">
              <li>
                <Link to="/" className="hover:text-[#8B45E8] transition-colors">
                  Home Overview
                </Link>
              </li>
              <li>
                <Link to="/browse" className="hover:text-[#8B45E8] transition-colors">
                  Browse All Items
                </Link>
              </li>
              <li>
                <Link to="/report-lost" className="hover:text-[#E84383] transition-colors">
                  Report a Lost Item
                </Link>
              </li>
              <li>
                <Link to="/report-found" className="hover:text-[#16B978] transition-colors">
                  Report a Found Item
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-[#8B45E8] transition-colors">
                  Student Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#252525] uppercase tracking-wider">
              Item Categories
            </h4>
            <ul className="space-y-2 text-xs text-[#858585]">
              <li>
                <Link to="/browse?category=Electronics" className="hover:text-[#8B45E8] transition-colors">
                  Electronics & Gadgets
                </Link>
              </li>
              <li>
                <Link to="/browse?category=Books%20and%20Notes" className="hover:text-[#8B45E8] transition-colors">
                  Books, Notes & Calculators
                </Link>
              </li>
              <li>
                <Link to="/browse?category=ID%20Cards" className="hover:text-[#8B45E8] transition-colors">
                  Student IDs & Cards
                </Link>
              </li>
              <li>
                <Link to="/browse?category=Keys" className="hover:text-[#8B45E8] transition-colors">
                  Hostel & Vehicle Keys
                </Link>
              </li>
              <li>
                <Link to="/browse?category=Water%20Bottles" className="hover:text-[#8B45E8] transition-colors">
                  Bottles & Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Campus Safety Notice */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#252525] uppercase tracking-wider">
              Campus Verification
            </h4>
            <div className="p-4 rounded-2xl bg-[#F1E9FA]/60 border border-[#8B45E8]/20 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#8B45E8]">
                <Shield className="w-4 h-4" />
                <span>Peer Safety First</span>
              </div>
              <p className="text-[11px] text-[#252525] leading-relaxed">
                Meet in open campus areas (Library, Cafeteria, or Guard Desk) when exchanging items. Always verify student credentials.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[#E8E8ED] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#858585]">
          <p>© {new Date().getFullYear()} Campus Lost & Found. Academic Software Engineering Project.</p>
          <div className="flex items-center gap-1">
            <span>Designed for college campus communities with</span>
            <Heart className="w-3.5 h-3.5 text-[#E84383] fill-current" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

