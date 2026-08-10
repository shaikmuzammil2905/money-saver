import React, { useState, useMemo } from 'react';
import { ALL_PRODUCTS } from '../data/products';
import { Star, ShoppingCart, ArrowLeft, Search, Filter, SlidersHorizontal, Eye, Flame } from 'lucide-react';

export default function ViewAllProducts({ onBack, onAddToCart, onQuickView, selectedCategory = 'All' }) {
  const [activeCategory, setActiveCategory] = useState(selectedCategory);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('featured'); // 'featured', 'price-low', 'price-high', 'rating'

  // Extract unique category names
  const categories = useMemo(() => {
    const set = new Set(ALL_PRODUCTS.map((p) => p.category));
    return ['All', ...Array.from(set)];
  }, []);

  // Filter & Sort Products
  const filteredProducts = useMemo(() => {
    return ALL_PRODUCTS.filter((product) => {
      const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
      const matchesSearch = 
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.subtitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [activeCategory, searchTerm, sortBy]);

  return (
    <section className="min-h-screen bg-slate-50 py-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header Bar with Back Button */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors flex items-center gap-1.5 text-xs sm:text-sm font-bold"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Back to Home</span>
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <Flame className="w-6 h-6 text-[#e50914] fill-red-500" />
                All Products &amp; Smart Deals
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Showing {filteredProducts.length} items across all categories
              </p>
            </div>
          </div>

          {/* Search & Sort Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 text-xs sm:text-sm rounded-xl py-2.5 pl-9 pr-4 border border-slate-200 focus:outline-none focus:border-[#e50914]"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700">
              <SlidersHorizontal className="w-4 h-4 text-slate-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-[#e50914] text-white shadow-md shadow-red-600/30'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center my-8">
            <Filter className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No products found</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">Try adjusting your category filter or search term.</p>
            <button
              onClick={() => { setActiveCategory('All'); setSearchTerm(''); }}
              className="px-5 py-2.5 bg-[#e50914] text-white rounded-xl text-xs font-bold shadow hover:bg-red-700 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          /* Products Grid matching image copy 5.png styling */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col justify-between group relative"
              >
                <div>
                  {/* Category Pill Tag */}
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full inline-block mb-1">
                    {product.category}
                  </span>

                  {/* Title & Subtitle */}
                  <h3 className="font-extrabold text-sm text-slate-900 line-clamp-1 group-hover:text-[#e50914] transition-colors">
                    {product.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-normal line-clamp-1 mt-0.5">
                    {product.subtitle}
                  </p>

                  {/* Image Container */}
                  <div className="relative w-full h-44 my-3 rounded-xl bg-slate-50 flex items-center justify-center p-3 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-200"
                      loading="lazy"
                    />

                    <button
                      onClick={() => onQuickView(product)}
                      className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-bold rounded-xl backdrop-blur-[1px]"
                    >
                      <Eye className="w-4 h-4" /> Quick View
                    </button>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1.5 mb-3 text-xs">
                    <div className="flex items-center gap-1 text-amber-500 font-extrabold">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{product.rating}</span>
                    </div>
                    <span className="text-slate-400 font-medium">({product.reviewsCount?.toLocaleString() || '1,256'})</span>
                  </div>
                </div>

                {/* Pricing & Add to Cart */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xs text-slate-400 line-through font-medium">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                      <span className="text-base sm:text-lg font-black text-slate-900">
                        ₹{product.price.toLocaleString()}
                      </span>
                    </div>

                    <span className="text-[10px] font-extrabold text-white bg-[#e50914] px-2 py-0.5 rounded-md shadow-sm">
                      {product.discount}
                    </span>
                  </div>

                  <button
                    onClick={() => onAddToCart(product)}
                    className="w-full py-2.5 px-3 rounded-xl bg-[#008744] hover:bg-[#007038] text-white font-bold text-xs shadow-md shadow-emerald-700/20 transition-colors flex items-center justify-center gap-2 group/btn"
                  >
                    <ShoppingCart className="w-4 h-4 stroke-[2.5]" />
                    <span>Add to Cart</span>
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
