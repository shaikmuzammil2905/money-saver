import React, { useState, useMemo } from 'react';
import { ALL_PRODUCTS } from '../data/products';
import { ArrowLeft, Search, Filter, SlidersHorizontal } from 'lucide-react';
import ProductCard from './ProductCard';

export default function ViewAllProducts({ onBack, onAddToCart, onQuickView, selectedCategory = 'All', wishlistIds = [], onToggleWishlist }) {
  const [activeGroup, setActiveGroup] = useState('All');
  const [activeSubCategory, setActiveSubCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default'); // 'default', 'price-low', 'price-high', 'rating'

  // Extract unique category names
  const subCategories = useMemo(() => {
    const set = new Set(ALL_PRODUCTS.map((p) => p.category));
    return ['All', ...Array.from(set)];
  }, []);

  // Primary Category Group Buttons
  const groupButtons = [
    { id: 'All', name: 'All Categories' },
    { id: 'Internet Fiber', name: '🌐 Internet Fiber' },
    { id: 'OTT Platforms', name: '📺 OTT Platforms' },
    { id: 'Mobile / Gadgets', name: '📱 Mobile / Gadgets' },
    { id: 'Other Products', name: '💻 Other Products' }
  ];

  // Filter & Sort Products
  const filteredProducts = useMemo(() => {
    return ALL_PRODUCTS.filter((product) => {
      const matchesGroup = activeGroup === 'All' || product.categoryGroup === activeGroup;
      const matchesSubCat = activeSubCategory === 'All' || product.category === activeSubCategory;
      const matchesSearch = 
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.subtitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.categoryGroup?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesGroup && matchesSubCat && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [activeGroup, activeSubCategory, searchTerm, sortBy]);

  return (
    <section className="min-h-screen bg-slate-50 py-6 sm:py-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Top Header Section with Back Icon & Search Bar */}
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2.5 sm:gap-3 w-full">
            {/* Prominent Top-Left Back Button Icon */}
            <button
              onClick={onBack}
              className="p-3 sm:p-3.5 rounded-xl bg-[#e50914] hover:bg-red-700 active:scale-95 text-white transition-all flex items-center justify-center shadow-md shrink-0"
              aria-label="Back to Home"
              title="Back to Home"
            >
              <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
            </button>

            {/* Full-Width Search Input Bar */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search products, fiber, OTT..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 text-xs sm:text-sm rounded-xl py-2.5 sm:py-3 pl-9 sm:pl-10 pr-4 border border-slate-200 focus:outline-none focus:border-[#e50914] focus:bg-white transition-colors"
              />
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 absolute left-3 sm:left-3.5 top-3 sm:top-3.5" />
            </div>
          </div>
        </div>

        {/* Primary Category Group Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {groupButtons.map((grp) => (
            <button
              key={grp.id}
              onClick={() => { setActiveGroup(grp.id); setActiveSubCategory('All'); }}
              className={`px-4 py-2.5 rounded-xl text-xs font-black whitespace-nowrap transition-all ${
                activeGroup === grp.id
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {grp.name}
            </button>
          ))}
        </div>

        {/* Subcategory Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {subCategories.map((sub) => (
            <button
              key={sub}
              onClick={() => setActiveSubCategory(sub)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                activeSubCategory === sub
                  ? 'bg-[#e50914] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center my-4">
            <Filter className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No products found</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">Try adjusting your category filter or search term.</p>
            <button
              onClick={() => { setActiveGroup('All'); setActiveSubCategory('All'); setSearchTerm(''); }}
              className="px-5 py-2.5 bg-[#e50914] text-white rounded-xl text-xs font-bold shadow hover:bg-red-700 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onQuickView={onQuickView}
                isWishlisted={wishlistIds.includes(product.id)}
                onToggleWishlist={onToggleWishlist}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}

