import React, { useState } from 'react';
import { Search, Filter, X, RotateCcw, Calendar, MapPin, ChevronDown } from 'lucide-react';
import Button from '../common/Button';

export const CATEGORIES = [
  'All',
  'Electronics',
  'Books and Notes',
  'Bags',
  'Clothing',
  'Accessories',
  'ID Cards',
  'Keys',
  'Water Bottles',
  'Other',
];

export const ItemFilter = ({ filters, onFilterChange, onReset }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleTextChange = (field, value) => {
    onFilterChange({ ...filters, [field]: value, page: 1 });
  };

  const handleTypeSelect = (type) => {
    onFilterChange({ ...filters, type: type === 'all' ? '' : type, page: 1 });
  };

  const handleCategorySelect = (category) => {
    onFilterChange({
      ...filters,
      category: category === 'All' ? '' : category,
      page: 1,
    });
  };

  const activeFilterCount = [
    filters.type,
    filters.category && filters.category !== 'All',
    filters.status && filters.status !== 'all',
    filters.location,
    filters.startDate,
    filters.endDate,
  ].filter(Boolean).length;

  return (
    <div className="bg-white rounded-2xl border border-[#E8E8ED] shadow-sm p-4 sm:p-5 space-y-4">
      {/* Top Search Bar & Quick Type Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#858585]" />
          <input
            type="text"
            placeholder="Search items by name, keywords or description..."
            value={filters.search || ''}
            onChange={(e) => handleTextChange('search', e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-[#E8E8ED] bg-[#F7F7FA] text-sm text-[#252525] placeholder:text-[#858585] focus:outline-none focus:ring-2 focus:ring-[#8B45E8]/30 focus:border-[#8B45E8] focus:bg-white transition-all"
          />
          {filters.search && (
            <button
              onClick={() => handleTextChange('search', '')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#858585] hover:text-[#252525]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Type Toggle Pills */}
        <div className="flex items-center bg-[#F7F7FA] p-1 rounded-xl border border-[#E8E8ED]">
          <button
            type="button"
            onClick={() => handleTypeSelect('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              !filters.type
                ? 'bg-white text-[#252525] shadow-sm'
                : 'text-[#858585] hover:text-[#252525]'
            }`}
          >
            All Items
          </button>
          <button
            type="button"
            onClick={() => handleTypeSelect('lost')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              filters.type === 'lost'
                ? 'bg-[#FDECF3] text-[#E84383] shadow-sm'
                : 'text-[#858585] hover:text-[#E84383]'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#E84383]" />
            Lost Items
          </button>
          <button
            type="button"
            onClick={() => handleTypeSelect('found')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              filters.type === 'found'
                ? 'bg-[#E6F9F1] text-[#16B978] shadow-sm'
                : 'text-[#858585] hover:text-[#16B978]'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#16B978]" />
            Found Items
          </button>
        </div>

        {/* Filter Toggle Button */}
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
            showAdvanced || activeFilterCount > 0
              ? 'bg-[#F1E9FA] border-[#8B45E8]/30 text-[#8B45E8]'
              : 'bg-[#F7F7FA] border-[#E8E8ED] text-[#252525] hover:bg-gray-100'
          }`}
        >
          <Filter className="w-3.5 h-3.5" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-[#8B45E8] text-white text-[10px] font-bold flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform ${
              showAdvanced ? 'rotate-180' : ''
            }`}
          />
        </button>
      </div>

      {/* Category Pills (Horizontal Scrollable) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isSelected =
            (!filters.category && cat === 'All') || filters.category === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategorySelect(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-gradient-to-r from-[#4263EB] to-[#8B45E8] text-white shadow-soft'
                  : 'bg-[#F7F7FA] border border-[#E8E8ED] text-[#252525] hover:border-[#D5D5DF] hover:bg-[#F1E9FA]/50'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Advanced Filter Collapsible Panel */}
      {showAdvanced && (
        <div className="pt-4 border-t border-[#E8E8ED] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 animate-in fade-in duration-200">
          {/* Location filter */}
          <div>
            <label className="block text-[11px] font-bold text-[#858585] uppercase mb-1">
              Campus Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#858585]" />
              <input
                type="text"
                placeholder="e.g. Lab 3, Library..."
                value={filters.location || ''}
                onChange={(e) => handleTextChange('location', e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E8E8ED] bg-[#F7F7FA] text-xs focus:outline-none focus:ring-1 focus:ring-[#8B45E8] focus:bg-white"
              />
            </div>
          </div>

          {/* Status filter */}
          <div>
            <label className="block text-[11px] font-bold text-[#858585] uppercase mb-1">
              Item Status
            </label>
            <select
              value={filters.status || 'all'}
              onChange={(e) => handleTextChange('status', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#E8E8ED] bg-[#F7F7FA] text-xs focus:outline-none focus:ring-1 focus:ring-[#8B45E8] focus:bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Posts</option>
              <option value="claimed">Claimed Items</option>
              <option value="resolved">Resolved Items</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-[11px] font-bold text-[#858585] uppercase mb-1">
              Sort By
            </label>
            <select
              value={filters.sort || 'newest'}
              onChange={(e) => handleTextChange('sort', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#E8E8ED] bg-[#F7F7FA] text-xs focus:outline-none focus:ring-1 focus:ring-[#8B45E8] focus:bg-white"
            >
              <option value="newest">Recently Posted</option>
              <option value="oldest">Oldest Posted</option>
              <option value="eventDate_desc">Event Date (Newest first)</option>
              <option value="eventDate_asc">Event Date (Oldest first)</option>
            </select>
          </div>

          {/* Date range & Reset button */}
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label className="block text-[11px] font-bold text-[#858585] uppercase mb-1">
                Date From
              </label>
              <input
                type="date"
                value={filters.startDate || ''}
                onChange={(e) => handleTextChange('startDate', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-xl border border-[#E8E8ED] bg-[#F7F7FA] text-xs focus:outline-none focus:ring-1 focus:ring-[#8B45E8] focus:bg-white"
              />
            </div>
            <button
              type="button"
              onClick={onReset}
              title="Reset all filters"
              className="p-2 rounded-xl border border-[#E8E8ED] text-[#858585] hover:text-[#252525] hover:bg-[#F7F7FA] transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemFilter;

