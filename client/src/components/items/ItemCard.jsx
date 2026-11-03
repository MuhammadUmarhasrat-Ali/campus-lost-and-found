import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Clock, ArrowRight, Image as ImageIcon } from 'lucide-react';
import { TypeBadge, StatusBadge, CategoryBadge } from '../common/Badge';
import { getImageUrl } from '../../utils/imageUtils';

export const ItemCard = ({ item }) => {
  if (!item) return null;

  const formattedDate = item.eventDate
    ? new Date(item.eventDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Unknown date';

  const firstImage = item.images && item.images.length > 0 ? getImageUrl(item.images[0].url) : null;

  return (
    <div className="group rounded-2xl bg-[#F1E9FA] border border-[#E8E8ED] hover:border-[#8B45E8]/40 hover:shadow-card transition-all duration-300 flex flex-col overflow-hidden">
      {/* Image Container */}
      <div className="relative aspect-[16/10] w-full bg-white/70 overflow-hidden">
        {firstImage ? (
          <img
            src={firstImage}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-[#858585] bg-[#F7F7FA]">
            <ImageIcon className="w-10 h-10 opacity-40 mb-1" />
            <span className="text-[11px] font-medium opacity-60">No photo uploaded</span>
          </div>
        )}

        {/* Badges on top of image */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <TypeBadge type={item.type} />
        </div>
        <div className="absolute top-3 right-3">
          <StatusBadge status={item.status} />
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="mb-2">
            <CategoryBadge category={item.category} />
          </div>

          <h3 className="font-bold text-base text-[#252525] line-clamp-1 group-hover:text-[#8B45E8] transition-colors">
            {item.title}
          </h3>

          <p className="text-xs text-[#858585] mt-1.5 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Metadata Details */}
        <div className="mt-4 pt-3 border-t border-[#E8E8ED]/70 space-y-1.5 text-xs text-[#858585]">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-[#8B45E8] flex-shrink-0" />
            <span className="truncate text-[#252525] font-medium">{item.location}</span>
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#858585]">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#4263EB]" />
              {formattedDate}
            </span>
            {item.eventTime && (
              <span className="flex items-center gap-1 truncate max-w-[90px]">
                <Clock className="w-3 h-3 text-[#858585]" />
                {item.eventTime}
              </span>
            )}
          </div>
        </div>

        {/* View Details Action */}
        <div className="mt-4">
          <Link
            to={`/items/${item._id}`}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-bold bg-white text-[#252525] border border-[#E8E8ED] group-hover:bg-gradient-to-r group-hover:from-[#4263EB] group-hover:to-[#8B45E8] group-hover:text-white group-hover:border-transparent transition-all shadow-sm"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;

