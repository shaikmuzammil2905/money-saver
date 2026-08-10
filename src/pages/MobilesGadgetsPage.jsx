import React, { useState, useMemo } from 'react';
import { ALL_PRODUCTS } from '../data/products';
import { Smartphone, Headphones, Star, ShoppingCart, Eye, Search, SlidersHorizontal, Flame } from 'lucide-react';

export default function MobilesGadgetsPage({ onAddToCart, onQuickView }) {
  const [selectedSubCat, setSelectedSubCat] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  // Filter products relevant to Mobiles & Gadgets
  const mobileGadgetProducts = useMemo(() => {
    return ALL_PRODUCTS.filter((p) => 
      ['Smartphones', 'Headphones', 'Earbuds', 'Smart Watches', 'Bluetooth Speakers', 'Power Banks', 'Chargers'].includes(p.category)
    );
  }, []);

  const subCategories = ['All', 'Smartphones', 'Headphones', 'Earbuds', 'Smart Watches', 'Bluetooth Speakers', 'Power Banks', 'Chargers'];

  const filtered = useMemo(() => {
    return mobileGadgetProducts.filter((p) => {
      const matchCat = selectedSubCat === 'All' || p.category === selectedSubCat;
      const matchSearch = 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.subtitle?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCat && matchSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [mobileGadgetProducts, selectedSubCat, searchTerm, sortBy]);

  return (
    <div className="min-h-screen bg-slate-50 py-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Section */}
        <div className="relative rounded-3xl bg-slate-950 text-white p-6 sm:p-10 mb-8 border border-slate-800 shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(16,185,129,0.25),transparent_60%)] pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/60 text-emerald-400 text-xs font-black uppercase tracking-wider">
              <Smartphone className="w-3.5 h-3.5" /> Smartphones &amp; Mobile Accessories
            </span>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight leading-tight">
              Mobiles <span className="text-emerald-400">&amp; Smart Gadgets</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Explore 5G smartphones, active noise cancelling earbuds, premium bluetooth speakers, smartwatches &amp; ultra-fast chargers with genuine brand warranty &amp; express doorstep delivery.
            </p>
          </div>
        </div>

        {/* Filter Pills & Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          {/* Subcategory Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            {subCategories.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubCat(sub)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedSubCat === sub
                    ? 'bg-[#008744] text-white shadow-md shadow-emerald-700/30'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>

          {/* Search & Sort */}
          <div className="flex items-center gap-3">
            <div className="relative w-48 sm:w-56">
              <input
                type="text"
                placeholder="Search mobiles, earbuds..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 text-xs rounded-xl py-2 pl-8 pr-3 border border-slate-200 focus:outline-none focus:border-emerald-600"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-700 focus:outline-none"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Product Cards Grid matching image copy 5.png */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {filtered.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col justify-between group relative"
            >
              <div>
                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full inline-block mb-1">
                  {product.category}
                </span>

                <h3 className="font-extrabold text-sm text-slate-900 line-clamp-1 group-hover:text-emerald-700 transition-colors">
                  {product.title}
                </h3>
                <p className="text-xs text-slate-500 font-normal line-clamp-1 mt-0.5">
                  {product.subtitle}
                </p>

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

                <div className="flex items-center gap-1.5 mb-3 text-xs">
                  <div className="flex items-center gap-1 text-amber-500 font-extrabold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{product.rating}</span>
                  </div>
                  <span className="text-slate-400 font-medium">({product.reviewsCount?.toLocaleString() || '982'})</span>
                </div>
              </div>

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
                  <span className="text-[10px] font-extrabold text-white bg-[#e50914] px-2 py-0.5 rounded-md">
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

      </div>
    </div>
  );
}
