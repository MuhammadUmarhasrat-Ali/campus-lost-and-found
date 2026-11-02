import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  PlusCircle,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  Laptop,
  BookOpen,
  CreditCard,
  Key,
  Coffee,
  Package,
  Clock,
  Sparkles,
} from 'lucide-react';
import api from '../services/api';
import ItemCard from '../components/items/ItemCard';
import Button from '../components/common/Button';

export const HomePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    totalLost: 0,
    totalFound: 0,
    activePosts: 0,
    resolvedItems: 0,
    totalItems: 0,
  });
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, itemsRes] = await Promise.all([
          api.get('/items/stats'),
          api.get('/items?limit=6&sort=newest'),
        ]);

        if (statsRes.data?.data) {
          setStats(statsRes.data.data);
        }
        if (itemsRes.data?.data?.items) {
          setRecentItems(itemsRes.data.data.items);
        }
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/browse');
    }
  };

  const categories = [
    { name: 'Electronics', icon: Laptop, count: 'Earbuds, Laptops, Chargers' },
    { name: 'Books and Notes', icon: BookOpen, count: 'Textbooks, Notebooks, Calculators' },
    { name: 'ID Cards', icon: CreditCard, count: 'Student IDs, Library Passes, Metro' },
    { name: 'Keys', icon: Key, count: 'Hostel Rooms, Bike & Locker Keys' },
    { name: 'Water Bottles', icon: Coffee, count: 'Flasks, Thermos, Shakers' },
    { name: 'Bags', icon: Package, count: 'Backpacks, Pouches, Duffels' },
  ];

  return (
    <div className="space-y-16 lg:space-y-24 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-24 bg-gradient-to-b from-[#F7F7FA] via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Subtle announcement pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F1E9FA] border border-[#8B45E8]/20 text-[#8B45E8] text-xs font-bold mb-6 animate-in fade-in duration-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Official Campus Lost & Found Network</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#252525] tracking-tight max-w-4xl mx-auto leading-[1.15]">
            Lost Something on Campus? <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#4263EB] via-[#8B45E8] to-[#E84383] bg-clip-text text-transparent">
              Let's Help You Find It.
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-[#858585] max-w-2xl mx-auto leading-relaxed">
            A smarter way for students to report lost belongings, discover found items and reunite with what matters.
          </p>

          {/* Quick Hero Search Bar */}
          <div className="mt-8 max-w-2xl mx-auto">
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center bg-white p-2 rounded-2xl shadow-card border border-[#E8E8ED] hover:border-[#8B45E8]/40 transition-all"
            >
              <div className="flex-1 flex items-center pl-3">
                <Search className="w-5 h-5 text-[#858585] mr-3" />
                <input
                  type="text"
                  placeholder="Search by item name, model or location (e.g. boAt earbuds, Lab 3)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-sm text-[#252525] placeholder:text-[#858585] focus:outline-none bg-transparent"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-gradient-to-r from-[#4263EB] to-[#8B45E8] text-white shadow-soft hover:opacity-95 transition-opacity cursor-pointer"
              >
                Search
              </button>
            </form>
          </div>

          {/* Call to Action Buttons */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link to="/browse?type=lost">
              <Button variant="danger" size="md">
                <span className="w-2 h-2 rounded-full bg-[#E84383] mr-2" />
                Browse Lost Items
              </Button>
            </Link>
            <Link to="/browse?type=found">
              <Button
                variant="secondary"
                size="md"
                className="hover:border-[#16B978]/50 text-[#16B978] bg-[#E6F9F1]/40"
              >
                <span className="w-2 h-2 rounded-full bg-[#16B978] mr-2" />
                Browse Found Items
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Real Statistics Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-[#F1E9FA]/70 border border-[#8B45E8]/20 rounded-2xl p-5 text-center">
            <p className="text-xs font-semibold text-[#858585] uppercase tracking-wider">
              Total Lost Items
            </p>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-[#E84383] mt-1.5">
              {stats.totalLost}
            </h3>
            <span className="text-[11px] text-[#858585] mt-1 block">Reported missing</span>
          </div>

          <div className="bg-[#E6F9F1]/60 border border-[#16B978]/20 rounded-2xl p-5 text-center">
            <p className="text-xs font-semibold text-[#858585] uppercase tracking-wider">
              Total Found Items
            </p>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-[#16B978] mt-1.5">
              {stats.totalFound}
            </h3>
            <span className="text-[11px] text-[#858585] mt-1 block">Awaiting owners</span>
          </div>

          <div className="bg-[#EDF2FE]/70 border border-[#4263EB]/20 rounded-2xl p-5 text-center">
            <p className="text-xs font-semibold text-[#858585] uppercase tracking-wider">
              Active Listings
            </p>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-[#4263EB] mt-1.5">
              {stats.activePosts}
            </h3>
            <span className="text-[11px] text-[#858585] mt-1 block">Open campus cases</span>
          </div>

          <div className="bg-[#F8F4FD] border border-[#8B45E8]/20 rounded-2xl p-5 text-center">
            <p className="text-xs font-semibold text-[#858585] uppercase tracking-wider">
              Reunited & Resolved
            </p>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-[#8B45E8] mt-1.5">
              {stats.resolvedItems}
            </h3>
            <span className="text-[11px] text-[#858585] mt-1 block">Belongings recovered</span>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#8B45E8] uppercase tracking-wider">
            Simple 3-Step Process
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#252525] mt-2">
            How Campus Recovery Works
          </h2>
          <p className="text-xs sm:text-sm text-[#858585] mt-2">
            Designed specifically for student daily life to ensure lost belongings find their way back home quickly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          <div className="bg-[#F7F7FA] border border-[#E8E8ED] rounded-2xl p-6 text-center hover:shadow-card transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#FDECF3] text-[#E84383] font-bold text-lg flex items-center justify-center mx-auto mb-4">
              1
            </div>
            <h3 className="font-bold text-base text-[#252525]">Report Your Item</h3>
            <p className="text-xs text-[#858585] mt-2 leading-relaxed">
              Post details about what you lost or found. Add campus location (e.g. Lab 3, Library), date, and an optional photograph.
            </p>
          </div>

          <div className="bg-[#F7F7FA] border border-[#E8E8ED] rounded-2xl p-6 text-center hover:shadow-card transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#F1E9FA] text-[#8B45E8] font-bold text-lg flex items-center justify-center mx-auto mb-4">
              2
            </div>
            <h3 className="font-bold text-base text-[#252525]">Search & Match</h3>
            <p className="text-xs text-[#858585] mt-2 leading-relaxed">
              Browse listings with real-time filters by category, location, and date to spot your belongings or see if anyone posted them.
            </p>
          </div>

          <div className="bg-[#F7F7FA] border border-[#E8E8ED] rounded-2xl p-6 text-center hover:shadow-card transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#E6F9F1] text-[#16B978] font-bold text-lg flex items-center justify-center mx-auto mb-4">
              3
            </div>
            <h3 className="font-bold text-base text-[#252525]">Reconnect & Claim</h3>
            <p className="text-xs text-[#858585] mt-2 leading-relaxed">
              Send an in-app claim request with identifying proof. Meet at a secure campus spot to collect your item and mark it resolved.
            </p>
          </div>
        </div>
      </section>

      {/* Recently Reported Items */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-[#8B45E8] uppercase tracking-wider">
              Campus Activity
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#252525] mt-1">
              Recently Reported Items
            </h2>
            <p className="text-xs sm:text-sm text-[#858585] mt-1">
              Check if an item you lost or found was recently listed by fellow students.
            </p>
          </div>
          <Link
            to="/browse"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8B45E8] hover:text-[#4263EB] transition-colors"
          >
            <span>View All Items</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-80 rounded-2xl bg-[#F1E9FA]/50 animate-pulse border border-[#E8E8ED]"
              />
            ))}
          </div>
        ) : recentItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentItems.map((item) => (
              <ItemCard key={item._id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-[#F7F7FA] rounded-2xl border border-[#E8E8ED]">
            <p className="text-sm font-medium text-[#858585]">
              No items reported yet. Be the first student to report a lost or found item!
            </p>
          </div>
        )}
      </section>

      {/* Popular Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-[#8B45E8] uppercase tracking-wider">
            Explore by Category
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#252525] mt-1">
            Commonly Lost Belongings
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                to={`/browse?category=${encodeURIComponent(cat.name)}`}
                className="group p-4 rounded-2xl bg-[#F7F7FA] border border-[#E8E8ED] hover:border-[#8B45E8]/40 hover:bg-[#F1E9FA]/50 transition-all text-center flex flex-col items-center justify-center"
              >
                <div className="w-11 h-11 rounded-2xl bg-white shadow-soft flex items-center justify-center text-[#8B45E8] group-hover:scale-110 transition-transform mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-[#252525] group-hover:text-[#8B45E8] transition-colors">
                  {cat.name}
                </h4>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Peer Safety & Trust CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-[#4263EB] to-[#8B45E8] p-8 sm:p-12 text-white relative overflow-hidden shadow-elevated">
          <div className="relative z-10 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm inline-block mb-4">
              Safe Campus Recovery
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Found something on campus grounds?
            </h2>
            <p className="mt-3 text-sm sm:text-base text-white/90 leading-relaxed">
              Help a fellow student relieve their stress. It takes less than 60 seconds to upload details and reunite an owner with their property.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/report-found">
                <button className="px-6 py-3 rounded-xl font-bold text-xs sm:text-sm bg-white text-[#8B45E8] hover:bg-[#F7F7FA] transition-colors shadow-soft cursor-pointer">
                  Report Found Item Now
                </button>
              </Link>
              <Link to="/report-lost">
                <button className="px-6 py-3 rounded-xl font-bold text-xs sm:text-sm bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-sm transition-colors cursor-pointer">
                  Report Lost Belonging
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

