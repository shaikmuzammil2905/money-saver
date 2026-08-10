import React from 'react';
import { Star, ShoppingCart, Flame, ChevronRight, Eye } from 'lucide-react';
import { FEATURED_DEALS } from '../data/products';

export default function FeaturedDeals({ onAddToCart, onQuickView, onViewAll }) {
  return (
    <section id="offers" className="py-8 sm:py-12 bg-white font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header matching image copy 5.png */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Flame className="w-6 h-6 text-[#e50914] fill-red-500" />
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-sans">
              Featured Deals
            </h2>
          </div>

          <button 
            onClick={onViewAll}
            className="text-xs sm:text-sm font-bold text-[#e50914] hover:text-red-700 transition-colors flex items-center gap-0.5 group"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform stroke-[2.5]" />
          </button>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
          {FEATURED_DEALS.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col justify-between group relative"
            >
              <div>
                {/* Title & Subtitle */}
                <div className="mb-2">
                  <h3 className="font-extrabold text-sm text-slate-900 line-clamp-1 group-hover:text-[#e50914] transition-colors">
                    {product.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-normal line-clamp-1 mt-0.5">
                    {product.subtitle}
                  </p>
                </div>

                {/* Product Image Container */}
                <div className="relative w-full h-40 my-3 rounded-xl bg-slate-50 flex items-center justify-center p-3 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-200"
                    loading="lazy"
                  />

                  {/* Quick View Button on Hover */}
                  <button
                    onClick={() => onQuickView(product)}
                    className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-bold rounded-xl backdrop-blur-[1px]"
                  >
                    <Eye className="w-4 h-4" /> Quick View
                  </button>
                </div>

                {/* Rating Row */}
                <div className="flex items-center gap-1.5 mb-3 text-xs">
                  <div className="flex items-center gap-1 text-amber-500 font-extrabold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{product.rating}</span>
                  </div>
                  <span className="text-slate-400 font-medium">({product.reviewsCount?.toLocaleString() || '1,256'})</span>
                </div>
              </div>

              {/* Price & Add to Cart Button */}
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

                {/* Full-width Green Add to Cart Button matching image copy 5.png */}
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
    </section>
  );
}
