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
        
        {/* Top Header Section with Back Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm">
          
          <div className="flex items-center gap-3">
            {/* Top-Left Back Button */}
            <button
              onClick={onBack}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 transition-all flex items-center gap-2 text-xs sm:text-sm font-bold shadow-sm"
              aria-label="Back to Home"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700" />
              <span>Back</span>
            </button>

            {/* Clean Explorer Title */}
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Explorer
            </h1>
          </div>

          {/* Search & Sort Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                placeholder="Search products, fiber, OTT..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 text-xs sm:text-sm rounded-xl py-2.5 pl-9 pr-4 border border-slate-200 focus:outline-none focus:border-[#e50914]"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>

            {/* Sort Dropdown (Without "Featured") */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700">
              <SlidersHorizontal className="w-4 h-4 text-slate-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="default">Default Sort</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
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

