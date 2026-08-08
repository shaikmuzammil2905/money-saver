import React from 'react';
import { Star, ShoppingCart, Flame, ArrowRight, Eye } from 'lucide-react';
import { FEATURED_DEALS } from '../data/products';

export default function FeaturedDeals({ onAddToCart, onQuickView, onViewAll }) {
  return (
    <section id="offers" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Flame className="w-6 h-6 text-brand-red animate-bounce" />
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
              Featured Deals
            </h2>
          </div>
          <button 
            onClick={onViewAll}
            className="text-xs sm:text-sm font-bold text-slate-700 hover:text-brand-red transition-colors flex items-center gap-1 group"
          >
            <span>View All Deals</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Product Grid (Responsive: 1 col on mobile, 2 sm, 3 md, 5 lg) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {FEATURED_DEALS.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm hover:shadow-xl transition-all duration-300 card-hover-effect flex flex-col justify-between relative overflow-hidden"
            >
              <div>
                {/* Image Container with Quick View Hover */}
                <div className="relative w-full h-44 mb-3 rounded-xl bg-slate-50 overflow-hidden flex items-center justify-center p-2">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />

                  {/* Discount Badge */}
                  <span className="absolute top-2 right-2 bg-brand-red text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow">
                    {product.discount}
                  </span>

                  {/* Quick View Button on Hover */}
                  <button
                    onClick={() => onQuickView(product)}
                    className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-bold rounded-xl backdrop-blur-[2px]"
                  >
                    <Eye className="w-4 h-4" /> Quick View
                  </button>
                </div>

                {/* Title & Subtitle */}
                <div className="mb-2">
                  <h3 className="font-extrabold text-sm text-slate-900 line-clamp-1 group-hover:text-brand-red transition-colors">
                    {product.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-1 font-medium">
                    {product.subtitle}
                  </p>
                </div>

                {/* Star Rating */}
                <div className="flex items-center gap-1.5 mb-3 text-xs">
                  <div className="flex items-center gap-0.5 text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{product.rating}</span>
                  </div>
                  <span className="text-slate-400 font-normal">({product.reviewsCount.toLocaleString()})</span>
                </div>
              </div>

              {/* Pricing & Add to Cart */}
              <div>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-xs text-slate-400 line-through font-medium">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                  <span className="text-lg font-black text-slate-900">
                    ₹{product.price.toLocaleString()}
                  </span>
                  <span className="text-[10px] font-bold text-brand-red bg-red-50 px-1.5 py-0.5 rounded">
                    {product.discount}
                  </span>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => onAddToCart(product)}
                  className="w-full py-2.5 px-3 rounded-xl bg-brand-green hover:bg-brand-greenHover text-white font-bold text-xs shadow-md shadow-brand-green/20 hover:shadow-brand-green/40 transition-all flex items-center justify-center gap-2 group/btn"
                >
                  <ShoppingCart className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
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
