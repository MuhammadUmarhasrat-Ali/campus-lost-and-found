import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, PlusCircle, Frown, Loader2 } from 'lucide-react';
import api from '../services/api';
import ItemCard from '../components/items/ItemCard';
import ItemFilter from '../components/items/ItemFilter';
import Pagination from '../components/common/Pagination';
import Button from '../components/common/Button';

export const BrowseItemsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize filters from URL parameters
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    type: searchParams.get('type') || '',
    location: searchParams.get('location') || '',
    status: searchParams.get('status') || 'all',
    startDate: searchParams.get('startDate') || '',
    endDate: searchParams.get('endDate') || '',
    sort: searchParams.get('sort') || 'newest',
    page: parseInt(searchParams.get('page') || '1', 10),
  });

  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
  });
  const [loading, setLoading] = useState(true);

  // Sync state to URL params
  const updateUrlParams = useCallback((newFilters) => {
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, val]) => {
      if (val && val !== 'all' && !(key === 'page' && val === 1)) {
        params.set(key, val);
      }
    });
    setSearchParams(params, { replace: true });
  }, [setSearchParams]);

  // Fetch items from backend API
  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.search) queryParams.set('search', filters.search);
      if (filters.category && filters.category !== 'All') queryParams.set('category', filters.category);
      if (filters.type) queryParams.set('type', filters.type);
      if (filters.location) queryParams.set('location', filters.location);
      if (filters.status && filters.status !== 'all') queryParams.set('status', filters.status);
      if (filters.startDate) queryParams.set('startDate', filters.startDate);
      if (filters.endDate) queryParams.set('endDate', filters.endDate);
      if (filters.sort) queryParams.set('sort', filters.sort);
      queryParams.set('page', filters.page.toString());
      queryParams.set('limit', '12');

      const { data } = await api.get(`/items?${queryParams.toString()}`);
      if (data.data) {
        setItems(data.data.items);
        setPagination(data.data.pagination);
      }
    } catch (err) {
      console.error('Failed to fetch items:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Debounced fetch on filter changes
  useEffect(() => {
    const handler = setTimeout(() => {
      updateUrlParams(filters);
      fetchItems();
    }, 250);

    return () => clearTimeout(handler);
  }, [filters, fetchItems, updateUrlParams]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleReset = () => {
    setFilters({
      search: '',
      category: '',
      type: '',
      location: '',
      status: 'all',
      startDate: '',
      endDate: '',
      sort: 'newest',
      page: 1,
    });
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#252525] tracking-tight">
            Browse Campus Items
          </h1>
          <p className="text-xs sm:text-sm text-[#858585] mt-1">
            Search and filter through all reported lost and found belongings on campus.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/report-lost">
            <Button variant="danger" size="sm">
              Report Lost
            </Button>
          </Link>
          <Link to="/report-found">
            <Button variant="primary" size="sm">
              Report Found
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter Component */}
      <ItemFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
      />

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-[#858585] px-1">
        <span>
          Showing <strong className="text-[#252525]">{items.length}</strong> of{' '}
          <strong className="text-[#252525]">{pagination.totalItems}</strong> items
        </span>
        {filters.type && (
          <span className="capitalize">
            Filtered by: <strong className="text-[#8B45E8]">{filters.type}</strong>
          </span>
        )}
      </div>

      {/* Items Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div
              key={n}
              className="h-80 rounded-2xl bg-[#F1E9FA]/50 animate-pulse border border-[#E8E8ED]"
            />
          ))}
        </div>
      ) : items.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <ItemCard key={item._id} item={item} />
            ))}
          </div>

          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <div className="bg-[#F7F7FA] rounded-3xl border border-[#E8E8ED] py-16 px-4 text-center max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-[#F1E9FA] text-[#8B45E8] flex items-center justify-center mx-auto mb-4">
            <Frown className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-[#252525]">No Matching Items Found</h3>
          <p className="text-xs text-[#858585] mt-1.5 leading-relaxed max-w-sm mx-auto">
            We couldn't find any lost or found items matching your current search and filter criteria.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button variant="secondary" size="sm" onClick={handleReset}>
              Reset All Filters
            </Button>
            <Link to="/report-lost">
              <Button variant="primary" size="sm">
                Report a Missing Item
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrowseItemsPage;

